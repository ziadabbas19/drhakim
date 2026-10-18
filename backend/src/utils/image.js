import sharp from 'sharp';
import { MEDIA } from '../config/constants.js';

const OUTPUT_MIME_TYPE = 'image/webp';
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MIN_SIGNATURE_BYTES = 12;

const SIGNATURES = Object.freeze([
  { mimeType: 'image/jpeg', matches: (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  { mimeType: 'image/png', matches: (bytes) => bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE) },
  {
    mimeType: 'image/webp',
    matches: (bytes) => bytes.toString('latin1', 0, 4) === 'RIFF' && bytes.toString('latin1', 8, 12) === 'WEBP',
  },
]);

// Reads the file's leading bytes, so a renamed file or a spoofed Content-Type is not trusted.
export const detectImageType = (buffer) =>
  Buffer.isBuffer(buffer) && buffer.length >= MIN_SIGNATURE_BYTES
    ? (SIGNATURES.find(({ matches }) => matches(buffer))?.mimeType ?? null)
    : null;

const toWebp = (input, resize) => sharp(input).resize(resize).webp({ quality: MEDIA.quality });

// Auto-rotates by EXIF, strips metadata (including location), fits the largest side within the
// limit, and prepares smaller copies that providers render only if they store them.
export const processImage = async (buffer) => {
  const { data, info } = await sharp(buffer, { limitInputPixels: MEDIA.maxInputPixels })
    .rotate()
    .resize({ width: MEDIA.maxDimension, height: MEDIA.maxDimension, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: MEDIA.quality })
    .toBuffer({ resolveWithObject: true });

  const placeholder = await toWebp(data, { width: MEDIA.placeholderWidth }).toBuffer();
  const { isOpaque } = await sharp(data).stats();

  return {
    buffer: data,
    width: info.width,
    height: info.height,
    sizeBytes: info.size,
    mimeType: OUTPUT_MIME_TYPE,
    hasTransparency: !isOpaque,
    placeholder: `data:${OUTPUT_MIME_TYPE};base64,${placeholder.toString('base64')}`,
    variants: MEDIA.variantWidths
      .filter((width) => width < info.width)
      .map((width) => ({ width, render: () => toWebp(data, { width }).toBuffer() })),
  };
};
