import { createHash } from 'node:crypto';
import sanitizeHtml from 'sanitize-html';

// Control characters (including line breaks) and invisible direction overrides that could disguise text.
const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F-\u009F‎‏‪-‮⁦-⁩]/g;
const ENTITIES = Object.freeze({ '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&amp;': '&' });
const ESCAPED_ENTITY = /&(?:lt|gt|quot|#39|amp);/g;

// Text sent from a public form, kept as plain text: tags removed, control characters dropped,
// and runs of spaces collapsed. It is always shown as text, never as HTML.
export const toPlainText = (value) =>
  sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(ESCAPED_ENTITY, (entity) => ENTITIES[entity])
    .replace(CONTROL_CHARACTERS, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Arabic diacritics and tatweel, and letter variants people type interchangeably.
const ARABIC_MARKS = /[ؐ-ًؚ-ٰٟۖ-ۭـ]/g;
const LETTER_VARIANTS = [
  [/[أإآٱ]/g, 'ا'],
  [/ى/g, 'ي'],
  [/ة/g, 'ه'],
];

const normalizeForComparison = (text = '') =>
  LETTER_VARIANTS.reduce(
    (normalized, [pattern, letter]) => normalized.replace(pattern, letter),
    text.normalize('NFKC').toLowerCase().replace(ARABIC_MARKS, ''),
  )
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

// The same words in a different case, spacing, or punctuation give the same fingerprint.
export const textFingerprint = (...parts) =>
  createHash('sha256')
    .update(parts.map((part) => normalizeForComparison(part ?? '')).join('\n'))
    .digest('hex');
