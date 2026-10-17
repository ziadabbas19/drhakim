import { LANGUAGES, otherLanguage } from '../../config/languages.js';
import { useI18n } from '../../hooks/useI18n.js';
import { Button } from '../Button.jsx';

// Shows the other language in its own script ("English" / "العربية").
export const LanguageSwitcher = ({ className }) => {
  const { lang, t, setLanguage } = useI18n();
  const target = otherLanguage(lang);

  return (
    <Button variant="ghost" size="sm" icon="languages" className={className} onClick={() => setLanguage(target)}>
      <span className="sr-only">{t('preferences.switchLanguage')}: </span>
      <span lang={target}>{LANGUAGES[target].nativeName}</span>
    </Button>
  );
};
