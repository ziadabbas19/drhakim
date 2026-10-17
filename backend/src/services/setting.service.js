import { mediaInputKey, mediaSlotsOf } from '../config/mediaSlots.js';
import { SiteSetting, sequelize } from '../models/index.js';
import { aboutProfileSchema } from '../validators/about.validator.js';
import { settingsSchema } from '../validators/setting.validator.js';

const LANGUAGE_PAIR = /^(.+)(Ar|En)$/;
const COLUMNS = Object.freeze({ Ar: 'valueAr', En: 'valueEn' });

const schemaKeys = (schema) => Object.keys(schema.describe().keys);

// Settings share one key/value table. A pair such as workingHoursNoteAr/workingHoursNoteEn is
// stored as one row with both language columns; other settings use value_ar only.
const createSettingsStore = (inputKeys) => {
  const locate = (inputKey) => {
    const [, key, suffix] = inputKey.match(LANGUAGE_PAIR) ?? [];
    const pairKey = key && `${key}${suffix === 'Ar' ? 'En' : 'Ar'}`;
    return pairKey && inputKeys.includes(pairKey)
      ? { key, column: COLUMNS[suffix] }
      : { key: inputKey, column: COLUMNS.Ar };
  };
  const storedKeys = [...new Set(inputKeys.map((inputKey) => locate(inputKey).key))];

  const get = async () => {
    const rows = new Map((await SiteSetting.findAll({ where: { key: storedKeys } })).map((row) => [row.key, row]));
    return Object.fromEntries(
      inputKeys.map((inputKey) => {
        const { key, column } = locate(inputKey);
        return [inputKey, rows.get(key)?.[column] ?? ''];
      }),
    );
  };

  const write = async (values, transaction) => {
    const current = await SiteSetting.findAll({ where: { key: storedKeys }, transaction });
    const rows = new Map(current.map(({ key, valueAr, valueEn }) => [key, { key, valueAr, valueEn }]));
    for (const [inputKey, value] of Object.entries(values)) {
      const { key, column } = locate(inputKey);
      const row = rows.get(key) ?? { key, valueAr: '', valueEn: null };
      rows.set(key, { ...row, [column]: value ?? '' });
    }
    await SiteSetting.bulkCreate([...rows.values()], {
      updateOnDuplicate: ['valueAr', 'valueEn', 'updatedAt'],
      transaction,
    });
  };

  const update = async (values) => {
    await sequelize.transaction((transaction) => write(values, transaction));
    return get();
  };

  return { storedKeys, get, write, update };
};

export const contactSettings = createSettingsStore(schemaKeys(settingsSchema));

// Image fields of the About profile are stored as media links, not settings.
const SITE_MEDIA_KEYS = mediaSlotsOf('site').map(([slot, options]) => mediaInputKey(slot, options));

export const aboutProfileSettings = createSettingsStore(
  schemaKeys(aboutProfileSchema).filter((key) => !SITE_MEDIA_KEYS.includes(key)),
);
