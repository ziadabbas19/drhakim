import { OPTION_GROUPS, OPTION_TONES } from '../config/constants.js';
import { useI18n } from './useI18n.js';

// Select options for one of OPTION_GROUPS, labelled in the current language.
export const useOptions = (group) => {
  const { t } = useI18n();
  return OPTION_GROUPS[group].map((value) => ({
    value,
    label: t(`options.${group}.${value}`),
    tone: OPTION_TONES[group]?.[value],
  }));
};

export const useOptionLabel = () => {
  const { t } = useI18n();
  return (group, value) => t(`options.${group}.${value}`);
};
