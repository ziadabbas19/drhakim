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
