import { AboutItem } from '../models/index.js';
import { ABOUT_ITEMS } from './content.js';
import { seedTranslated } from './seedHelpers.js';

export const seedAbout = () => seedTranslated(AboutItem, ABOUT_ITEMS, ['type']);
