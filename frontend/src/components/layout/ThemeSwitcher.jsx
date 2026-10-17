import { THEMES } from '../../config/preferences.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useTheme } from '../../hooks/useTheme.js';
import { SegmentedControl } from '../SegmentedControl.jsx';

const THEME_ICONS = Object.freeze({ light: 'sun', dark: 'moon', system: 'monitor' });

export const ThemeSwitcher = ({ className }) => {
  const { t } = useI18n();
  const { preference, setPreference } = useTheme();
  const options = THEMES.map((theme) => ({
    value: theme,
    icon: THEME_ICONS[theme],
    label: t(`preferences.themes.${theme}`),
  }));

  return (
    <SegmentedControl
      label={t('preferences.theme')}
      options={options}
      value={preference}
      onChange={setPreference}
      iconOnly
      className={className}
    />
  );
};
