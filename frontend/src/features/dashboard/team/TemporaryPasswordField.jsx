import { Button } from '../../../components/Button.jsx';
import { FormField } from '../../../components/FormField.jsx';
import { useI18n } from '../../../hooks/useI18n.js';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#';
const RANDOM_PASSWORD_LENGTH = 10;

const randomPassword = () =>
  Array.from(
    crypto.getRandomValues(new Uint32Array(RANDOM_PASSWORD_LENGTH)),
    (value) => ALPHABET[value % ALPHABET.length],
  ).join('');

export const TemporaryPasswordField = ({ form }) => {
  const { t } = useI18n();

  return (
    <div className="flex items-start gap-2">
      <FormField
        label={t('dashboard.team.password.label')}
        dir="ltr"
        autoComplete="off"
        spellCheck={false}
        hint={t('dashboard.team.password.hint')}
        className="flex-1"
        required
        {...form.register('password')}
      />
      <Button
        variant="secondary"
        icon="key"
        className="mt-7"
        onClick={() => form.setValue('password', randomPassword())}
      >
        {t('dashboard.team.password.generate')}
      </Button>
    </div>
  );
};
