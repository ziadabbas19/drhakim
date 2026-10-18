import sharp from 'sharp';

// Turns a portrait into a square cut-out of the person on a transparent background.
//
// The background-removal model gives a soft mask, which is cleaned up before use:
// 1. only the largest connected shape is kept (stray pieces such as logos or text are dropped),
//    and opened by one pixel, which removes thin slivers along the outline;
// 2. the model's soft edge is pulled slightly inwards, so no background colour is left around
//    the outline, and lightly feathered;
// 3. edge pixels take their colour from the inside of the shape, so the outline has no light or
//    dark halo on either theme;
// 4. the square runs from just above the head to `bottom` (a fraction of the photo's height),
//    centred on the head.
// It returns null when the mask does not look like one person reaching the bottom of the photo,
// so the caller can use a framed photo instead.

const MASK_THRESHOLD = 127;
const EDGE_CHOKE = Object.freeze({ low: 110, high: 230 });
const FEATHER_SIGMA = 0.5;
const COLOUR_SPREAD_SIGMA = 3;
// How much of the inside must be near an outline pixel (out of 255) to take its colour from it.
const MIN_COLOUR_WEIGHT = 8;
// Share of the person's height used to find the centre of the head, and the space above the head.
const HEAD_SHARE = 0.12;
const PADDING = 0.06;
// A usable mask covers a plausible part of the photo, with the head in its upper part.
const COVERAGE = Object.freeze({ min: 0.08, max: 0.85 });
const MAX_HEAD_TOP = 0.6;

const clamp = (value, max) => Math.max(0, Math.min(max, value));

const createMask = (width, height) => {
  const size = width * height;
  const indexOf = (x, y) => y * width + x;
  const inside = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

  // A square minimum or maximum filter, applied in two passes. The photo's edges are extended,
  // so a person cut off by the frame (at the waist) is not eroded along that edge.
  const filter = (mask, radius, combine, start) => {
    const pass = (input, dx, dy) => {
      const output = new Uint8Array(size);
      for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
          let value = start;
          for (let step = -radius; step <= radius; step += 1) {
            value = combine(value, input[indexOf(clamp(x + step * dx, width - 1), clamp(y + step * dy, height - 1))]);
          }
          output[indexOf(x, y)] = value;
        }
      }
      return output;
    };
    return pass(pass(mask, 1, 0), 0, 1);
  };

  const erode = (mask, radius) => filter(mask, radius, Math.min, 1);
  const dilate = (mask, radius) => filter(mask, radius, Math.max, 0);

  // Four-way flood fill; returns the largest shape and its pixel count.
  const largestShape = (mask) => {
    const labels = new Int32Array(size);
    const stack = new Int32Array(size);
    let best = { label: 0, count: 0 };
    let label = 0;
    for (let start = 0; start < size; start += 1) {
      if (!mask[start] || labels[start]) continue;
      label += 1;
      labels[start] = label;
      let top = 0;
      let count = 0;
      stack[top++] = start;
      while (top) {
        const index = stack[--top];
        count += 1;
        const x = index % width;
        const y = (index - x) / width;
        for (const [nx, ny] of [
          [x + 1, y],
          [x - 1, y],
          [x, y + 1],
          [x, y - 1],
        ]) {
          if (!inside(nx, ny)) continue;
          const next = indexOf(nx, ny);
          if (mask[next] && !labels[next]) {
            labels[next] = label;
            stack[top++] = next;
          }
        }
      }
      if (count > best.count) best = { label, count };
    }
    return { mask: Uint8Array.from(labels, (value) => (value && value === best.label ? 1 : 0)), count: best.count };
  };

  const rowHas = (mask, y) => mask.subarray(y * width, (y + 1) * width).some(Boolean);

  return { size, erode, dilate, largestShape, rowHas };
};

const blurChannel = async (values, { width, height }, sigma) => {
  const { data } = await sharp(Buffer.from(values.buffer, values.byteOffset, values.byteLength), {
    raw: { width, height, channels: 1 },
  })
    .blur(sigma)
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data;
};

const remapEdge = (alpha) =>
  Math.max(0, Math.min(255, Math.round(((alpha - EDGE_CHOKE.low) * 255) / (EDGE_CHOKE.high - EDGE_CHOKE.low))));

// Spreads the colours of `interior` outwards: each channel and the interior itself are blurred,
// and dividing one by the other gives the average nearby interior colour.
const interiorColours = async (rgba, interior, size) => {
  const weights = await blurChannel(Uint8Array.from(interior, (value) => value * 255), size, COLOUR_SPREAD_SIGMA);
  const channels = await Promise.all(
    [0, 1, 2].map((channel) =>
      blurChannel(
        Uint8Array.from(interior, (value, index) => (value ? rgba[index * 4 + channel] : 0)),
        size,
        COLOUR_SPREAD_SIGMA,
      ),
    ),
  );
  return { weights, channels };
};

const squareAround = (rgba, shape, { width, height }, bottomRow) => {
  let top = 0;
  while (top < bottomRow && !shape.subarray(top * width, (top + 1) * width).some(Boolean)) top += 1;

  const headRows = Math.max(1, Math.round((bottomRow - top) * HEAD_SHARE));
  let sum = 0;
  let count = 0;
  for (let y = top; y < top + headRows; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (shape[y * width + x]) {
        sum += x;
        count += 1;
      }
    }
  }

  const side = Math.round((bottomRow - top) / (1 - PADDING));
  const left = Math.round(sum / count - side / 2);
  const squareTop = bottomRow - side;
  const square = Buffer.alloc(side * side * 4);
  for (let y = 0; y < side; y += 1) {
    const sy = squareTop + y;
    if (sy < 0 || sy >= bottomRow) continue;
    for (let x = 0; x < side; x += 1) {
      const sx = left + x;
      if (sx < 0 || sx >= width) continue;
      rgba.copy(square, (y * side + x) * 4, (sy * width + sx) * 4, (sy * width + sx + 1) * 4);
    }
  }
  return { square, side, top };
};

// `rgba` is the photo with the model's mask as its alpha channel.
export const refineCutout = async ({ data: rgba, width, height }, { bottom = 1 } = {}) => {
  const mask = createMask(width, height);
  const size = { width, height };
  const bottomRow = Math.min(height, Math.round(height * bottom));

  const alpha = Uint8Array.from({ length: mask.size }, (_, index) => rgba[index * 4 + 3]);
  const person = mask.largestShape(Uint8Array.from(alpha, (value) => (value > MASK_THRESHOLD ? 1 : 0)));
  const coverage = person.count / mask.size;
  if (coverage < COVERAGE.min || coverage > COVERAGE.max || !mask.rowHas(person.mask, bottomRow - 1)) return null;

  const shape = mask.dilate(mask.erode(person.mask, 1), 1);
  const edgeZone = mask.dilate(shape, 2);
  const outline = await blurChannel(
    Uint8Array.from(alpha, (value, index) => (edgeZone[index] ? remapEdge(value) : 0)),
    size,
    FEATHER_SIGMA,
  );

  // Pixels of the person keep their colour unless they are on the outline; outline pixels take
  // the colour from the inside, and the faintest ones, too far out to know it, are dropped.
  const interior = mask.erode(shape, 3);
  const { weights, channels } = await interiorColours(rgba, interior, size);
  const cleaned = Buffer.alloc(mask.size * 4);
  for (let index = 0; index < mask.size; index += 1) {
    if (!outline[index]) continue;
    const recolour = !interior[index] && weights[index] > MIN_COLOUR_WEIGHT;
    if (!recolour && !shape[index]) continue;
    cleaned[index * 4 + 3] = outline[index];
    for (let channel = 0; channel < 3; channel += 1) {
      cleaned[index * 4 + channel] = recolour
        ? Math.min(255, Math.round((channels[channel][index] * 255) / weights[index]))
        : rgba[index * 4 + channel];
    }
  }

  const { square, side, top } = squareAround(cleaned, shape, size, bottomRow);
  if (top / height > MAX_HEAD_TOP) return null;
  return sharp(square, { raw: { width: side, height: side, channels: 4 } })
    .png()
    .toBuffer();
};

// `removeBackground(png)` returns the PNG with a transparent background (see backgroundRemoval.js).
export const createCutout = async (buffer, { removeBackground, bottom }) => {
  const foreground = await removeBackground(await sharp(buffer).png().toBuffer());
  const { data, info } = await sharp(foreground).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return refineCutout({ data, width: info.width, height: info.height }, { bottom });
};
