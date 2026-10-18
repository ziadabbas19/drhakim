import { withMediaDefaults } from '../../config/mediaSlots.js';
import { listOf, objectOf } from '../../utils/shape.js';
import { ABOUT_ITEM_TYPES } from './aboutItemTypes.js';

// The public About content in the shape the pages read: every list exists (empty when the API
// leaves it out) and every image slot is filled in, whatever the API sends.
export const aboutContentOf = (data) => {
  const { profile, items } = objectOf(data);
  const groups = objectOf(items);
  return {
    profile: withMediaDefaults('site', profile),
    items: Object.fromEntries(
      Object.keys(ABOUT_ITEM_TYPES).map((type) => [
        type,
        listOf(groups[type]).map((item) => withMediaDefaults('aboutItem', item)),
      ]),
    ),
  };
};

const itemSection = (type, texts) => ({
  key: type,
  icon: ABOUT_ITEM_TYPES[type].icon,
  list: (content) => content.items[type],
  ...texts,
});

// The About page sections below the biography, in order. Each shows its list from the About
// content, or the `about.empty.<key>` message while the list is empty.
export const ABOUT_SECTIONS = Object.freeze([
  itemSection('qualification', { tone: 'muted', title: 'about.qualifications' }),
  itemSection('timeline', { title: 'about.timeline.title', eyebrow: 'about.timeline.eyebrow' }),
  itemSection('membership', { tone: 'muted', title: 'about.memberships.title', eyebrow: 'about.memberships.eyebrow' }),
  {
    key: 'gallery',
    icon: 'images',
    list: (content) => content.profile.aboutGallery,
    title: 'about.gallery.title',
    eyebrow: 'about.gallery.eyebrow',
  },
  itemSection('surgery', {
    tone: 'muted',
    title: 'about.surgeries.title',
    eyebrow: 'about.surgeries.eyebrow',
    description: 'about.surgeries.description',
  }),
]);
