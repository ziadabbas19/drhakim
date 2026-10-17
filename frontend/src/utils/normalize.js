const ARABIC_INDIC_ZERO = 0x0660;
const EASTERN_ARABIC_INDIC_ZERO = 0x06f0;

const normalizeDigits = (value) =>
  value.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, (digit) => {
    const code = digit.charCodeAt(0);
    const zero = code >= EASTERN_ARABIC_INDIC_ZERO ? EASTERN_ARABIC_INDIC_ZERO : ARABIC_INDIC_ZERO;
    return String(code - zero);
  });

export const normalizePhone = (phone) =>
  normalizeDigits(phone)
    .replace(/[\s()-]/g, '')
    .replace(/^(\+|00)20/, '0');
