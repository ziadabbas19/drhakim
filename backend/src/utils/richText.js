import sanitizeHtml from 'sanitize-html';

// Paragraphs, emphasis, lists, and links only. Everything else is dropped, including inline
// styles, scripts, event handlers, and images.
const RICH_TEXT_OPTIONS = Object.freeze({
  allowedTags: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a', 'h3', 'blockquote'],
  allowedAttributes: { a: ['href', 'rel', 'target'] },
  allowedSchemes: ['https', 'mailto', 'tel'],
  transformTags: {
    b: 'strong',
    i: 'em',
    div: 'p',
    h1: 'h3',
    h2: 'h3',
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer', target: '_blank' }),
  },
  exclusiveFilter: (frame) => frame.tag === 'p' && !frame.text.trim(),
});

export const sanitizeRichText = (html) => sanitizeHtml(html, RICH_TEXT_OPTIONS).trim();

export const richTextToPlain = (html) => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).trim();
