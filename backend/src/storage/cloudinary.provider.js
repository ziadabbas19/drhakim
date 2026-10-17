import { createHash } from 'node:crypto';
import { messages } from '../i18n/index.js';
import { ApiError } from '../utils/ApiError.js';

const API_ORIGIN = 'https://api.cloudinary.com/v1_1';
const DELIVERY_ORIGIN = 'https://res.cloudinary.com';
const MS_PER_SECOND = 1000;

// Cloudinary signs the alphabetically sorted parameters followed by the API secret.
export const signParams = (params, apiSecret) =>
  createHash('sha1')
    .update(
      Object.keys(params)
        .toSorted()
        .map((name) => `${name}=${params[name]}`)
        .join('&') + apiSecret,
    )
    .digest('hex');

// Production storage, because the host's disk is wiped on every deploy. Smaller sizes are
// produced on the fly by Cloudinary from the URL, so only the full image is uploaded.
export const createCloudinaryProvider = ({ cloudName, apiKey, apiSecret, folder }, request = fetch) => {
  const endpoint = (action) => `${API_ORIGIN}/${cloudName}/image/${action}`;

  const deliveryUrl = (publicId, width) =>
    `${DELIVERY_ORIGIN}/${cloudName}/image/upload/${width ? `c_limit,w_${width},` : ''}f_auto,q_auto/${publicId}`;

  const call = async (action, params, file) => {
    const signed = { ...params, timestamp: Math.floor(Date.now() / MS_PER_SECOND) };
    const form = new FormData();
    for (const [name, value] of Object.entries(signed)) form.append(name, String(value));
    form.append('api_key', apiKey);
    form.append('signature', signParams(signed, apiSecret));
    if (file) form.append('file', file);

    const response = await request(endpoint(action), { method: 'POST', body: form });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error(`Cloudinary ${action} failed: ${body.error?.message ?? response.status}`);
      throw ApiError.badGateway(messages.media.storageFailed);
    }
    return body;
  };

  return {
    name: 'cloudinary',

    async upload({ key, buffer, mimeType, width, variants }) {
      const { public_id: publicId } = await call(
        'upload',
        { public_id: `${folder}/${key}` },
        new Blob([buffer], { type: mimeType }),
      );
      return {
        storageKey: publicId,
        url: deliveryUrl(publicId),
        variants: [
          ...variants.map((variant) => ({ width: variant.width, url: deliveryUrl(publicId, variant.width) })),
          { width, url: deliveryUrl(publicId) },
        ],
      };
    },

    async remove(storageKey) {
      await call('destroy', { invalidate: true, public_id: storageKey });
    },
  };
};
