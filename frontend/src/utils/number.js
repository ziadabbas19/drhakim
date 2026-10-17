import { DISPLAY_LOCALE } from '../config/constants.js';

const numberFormatter = new Intl.NumberFormat(DISPLAY_LOCALE);

export const formatNumber = (value) => numberFormatter.format(value);
