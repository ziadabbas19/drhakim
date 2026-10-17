import sharp from 'sharp';

export const createImage = ({ width = 640, height = 480, format = 'png', color = '#1c8193' } = {}) =>
  sharp({ create: { width, height, channels: 3, background: color } })
    .toFormat(format)
    .toBuffer();

export const imageForm = (files) => {
  const form = new FormData();
  for (const { buffer, name, type } of files) form.append('files', new Blob([buffer], { type }), name);
  return form;
};
