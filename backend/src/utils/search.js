import { Op } from 'sequelize';

const escapeLikePattern = (value) => value.replace(/[\\%_]/g, '\\$&');

// Case-insensitive "contains" condition for a search box.
export const containsText = (search) => ({ [Op.iLike]: `%${escapeLikePattern(search)}%` });
