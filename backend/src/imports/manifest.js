import path from 'node:path';
import Joi from 'joi';
import { ABOUT_ITEM_TYPES, SURGERY_CATEGORIES } from '../config/constants.js';
import { mediaSlotsOf } from '../config/mediaSlots.js';
import { mediaAltSchema } from '../validators/media.validator.js';

// The photos in images-source/ and where each one goes. Files are named without their
// extension: JPEG, PNG, and WebP are accepted. Photos not listed here (other posters or ads)
// are never imported. Alt text says only what the photo shows.

export const SOURCE_EXTENSIONS = Object.freeze(['.jpg', '.jpeg', '.png', '.webp']);

// Before/after photos whose patients gave written consent, as confirmed by the doctor.
export const CONSENTED_FOLDER = 'consented';

const DOCTOR = Object.freeze({ ar: 'د. عبد الحكيم عبد السلام', en: 'Dr. Abdelhakim Abdelsalam' });
const IN_WHITE_COAT = Object.freeze({ altAr: `${DOCTOR.ar} بالبالطو الأبيض`, altEn: `${DOCTOR.en} in a white coat` });

// Crops are fractions of the photo's width and height; focus points are percentages (see media.focusX).
export const ENTRIES = Object.freeze([
  // The poster as received. It stays in the library only: its text and the hospital logo are
  // never shown on the site.
  { key: 'portrait-ad', source: 'portrait-ad', ...IN_WHITE_COAT },
  {
    key: 'portrait-ad-cutout',
    source: 'portrait-ad',
    ...IN_WHITE_COAT,
    // The doctor alone on a transparent background. The square ends just below the crossed arms,
    // which also leaves out the piece of the reception desk next to the elbow.
    cutout: { bottom: 0.94 },
    // Used instead when the cut-out cannot be made cleanly: the part of the poster with only the
    // doctor (no text boxes or logo), shown in a rounded frame.
    fallbackCrop: { left: 0, top: 0.15, width: 0.57, height: 0.465 },
    site: 'heroImage',
  },
  {
    key: 'portrait-suit',
    source: 'portrait-suit',
    altAr: DOCTOR.ar,
    altEn: DOCTOR.en,
    // A TV screenshot: the crop keeps the doctor and leaves out the channel logos, the hashtag, and the news ticker.
    crop: { left: 0.261, top: 0.059, width: 0.581, height: 0.871 },
    focus: { x: 50, y: 30 },
    site: 'portrait',
  },
  {
    key: 'surgery-1',
    source: 'surgery-1',
    altAr: `${DOCTOR.ar} أثناء عملية جراحية`,
    altEn: `${DOCTOR.en} during an operation`,
    // A screenshot: the crop leaves out the photo viewer's arrow and dots along its edges.
    crop: { left: 0, top: 0, width: 0.944, height: 0.955 },
    focus: { x: 30, y: 35 },
    item: { type: ABOUT_ITEM_TYPES.SURGERY, titleAr: 'أثناء عملية جراحية', titleEn: 'During an operation' },
  },
  {
    key: 'surgery-endoscope',
    source: 'surgery-endoscope',
    altAr: `${DOCTOR.ar} أثناء استخدام المنظار`,
    altEn: `${DOCTOR.en} using an endoscope`,
    focus: { x: 55, y: 30 },
    item: { type: ABOUT_ITEM_TYPES.SURGERY, titleAr: 'المنظار', titleEn: 'Endoscopy' },
  },
]);

// Before/after titles and alt text name the procedure type only, with nothing about the result.
const procedure = (titleAr, titleEn, altAr, altEn) => Object.freeze({ titleAr, titleEn, altAr, altEn });

const PROCEDURES = Object.freeze({
  ear: procedure('عملية بالأذن', 'Ear procedure', 'صورة قبل وبعد لعملية بالأذن', 'Before and after photo of an ear procedure'),
  nose: procedure('عملية بالأنف', 'Nose procedure', 'صورة قبل وبعد لعملية بالأنف', 'Before and after photo of a nose procedure'),
  throat: procedure(
    'عملية بالحلق',
    'Throat procedure',
    'صورة قبل وبعد لعملية بالحلق',
    'Before and after photo of a throat procedure',
  ),
});
const UNNAMED_PROCEDURE = procedure('قبل وبعد', 'Before and after', 'صورة قبل وبعد', 'Before and after photo');

// In these photos the doctor and the before/after board sit a little above the middle.
const RESULT_FOCUS = Object.freeze({ x: 50, y: 40 });

const words = (name) => name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

// A photo in consented/ is named after its procedure type, e.g. ear-before-after.png.
export const resultEntry = (fileName) => {
  const name = path.parse(fileName).name;
  const category = SURGERY_CATEGORIES.find((value) => words(name).includes(value)) ?? null;
  const { altAr, altEn, ...title } = category ? PROCEDURES[category] : UNNAMED_PROCEDURE;
  return {
    key: `result-${words(name).join('-')}`,
    source: `${CONSENTED_FOLDER}/${name}`,
    altAr,
    altEn,
    focus: RESULT_FOCUS,
    item: { type: ABOUT_ITEM_TYPES.RESULT, category, ...title },
  };
};

const fraction = Joi.number().min(0).max(1);

const cropSchema = Joi.object({
  left: fraction.required(),
  top: fraction.required(),
  width: fraction.greater(0).required(),
  height: fraction.greater(0).required(),
}).custom((crop, helpers) =>
  crop.left + crop.width <= 1 && crop.top + crop.height <= 1 ? crop : helpers.error('any.invalid'),
);

const percent = Joi.number().integer().min(0).max(100);

const SINGLE_SITE_SLOTS = mediaSlotsOf('site')
  .filter(([, { single }]) => single)
  .map(([slot]) => slot);

export const entrySchema = Joi.object({
  key: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .max(100)
    .required(),
  source: Joi.string().required(),
  crop: cropSchema,
  cutout: Joi.object({ bottom: fraction.greater(0.5).required() }),
  fallbackCrop: cropSchema,
  focus: Joi.object({ x: percent.required(), y: percent.required() }),
  site: Joi.string().valid(...SINGLE_SITE_SLOTS),
  item: Joi.object({
    type: Joi.string().valid(ABOUT_ITEM_TYPES.SURGERY, ABOUT_ITEM_TYPES.RESULT).required(),
  }).unknown(),
})
  .concat(mediaAltSchema)
  .oxor('crop', 'cutout')
  .oxor('site', 'item');
