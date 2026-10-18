import { listOf, objectOf } from '../utils/shape.js';

// Mirrors backend/src/config/mediaSlots.js: where images can be attached. Forms hold the image
// objects (to show thumbnails) and send their ids as `<slot>Id` or `<slot>Ids`.
export const MEDIA_OWNERS = Object.freeze({
  clinic: { coverImage: { single: true }, gallery: {} },
  service: { image: { single: true } },
  aboutItem: { gallery: {} },
  site: { heroImage: { single: true }, portrait: { single: true }, aboutGallery: {} },
});

export const withMediaIds = (ownerType, values) => {
  const payload = { ...values };
  for (const [slot, { single }] of Object.entries(MEDIA_OWNERS[ownerType])) {
    if (!(slot in payload)) continue;
    const selection = payload[slot];
    delete payload[slot];
    if (single) payload[`${slot}Id`] = selection?.id ?? null;
    else payload[`${slot}Ids`] = (selection ?? []).map(({ id }) => id);
  }
  return payload;
};

export const emptyMediaValues = (ownerType) =>
  Object.fromEntries(Object.entries(MEDIA_OWNERS[ownerType]).map(([slot, { single }]) => [slot, single ? null : []]));

// Fills in image slots missing from an API record: no image for a single slot, an empty list otherwise.
export const withMediaDefaults = (ownerType, record) => {
  const values = objectOf(record);
  const slots = Object.entries(emptyMediaValues(ownerType)).map(([slot, empty]) => [
    slot,
    Array.isArray(empty) ? listOf(values[slot]) : (values[slot] ?? empty),
  ]);
  return { ...values, ...Object.fromEntries(slots) };
};
