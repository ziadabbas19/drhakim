// Every place an image can be attached. A single slot is sent as `<slot>Id` and returned as one
// image (or null); a gallery slot is sent as `<slot>Ids` and returned as an ordered list.
export const MEDIA_OWNERS = Object.freeze({
  clinic: { coverImage: { single: true }, gallery: {} },
  service: { image: { single: true } },
  aboutItem: { gallery: {} },
  // Site-wide images have no owner record.
  site: { heroImage: { single: true }, portrait: { single: true }, aboutGallery: {} },
});

export const mediaInputKey = (slot, { single = false } = {}) => (single ? `${slot}Id` : `${slot}Ids`);

export const mediaSlotsOf = (ownerType) => Object.entries(MEDIA_OWNERS[ownerType]);
