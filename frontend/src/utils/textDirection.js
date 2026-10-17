// The first letter decides, as the browser does for dir="auto".
const STARTS_RIGHT_TO_LEFT = /^\P{L}*[\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Syriac}\p{Script=Thaana}]/u;

export const textDirection = (text = '') => (STARTS_RIGHT_TO_LEFT.test(text) ? 'rtl' : 'ltr');
