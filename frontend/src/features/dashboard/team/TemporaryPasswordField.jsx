import { Button } from '../../../components/Button.jsx';
import { FormField } from '../../../components/FormField.jsx';

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789@#';
const RANDOM_PASSWORD_LENGTH = 10;

const randomPassword = () =>
  Array.from(
    crypto.getRandomValues(new Uint32Array(RANDOM_PASSWORD_LENGTH)),
    (value) => ALPHABET[value % ALPHABET.length],
  ).join('');

export const TemporaryPasswordField = ({ form }) => (
  <div className="flex items-start gap-2">
    <FormField
      label="كلمة المرور المؤقتة"
      dir="ltr"
      autoComplete="off"
      spellCheck={false}
      hint="أرسلها للعضو، وسيُطلب منه تغييرها عند أول تسجيل دخول"
      className="flex-1"
      required
      {...form.register('password')}
    />
    <Button variant="secondary" icon="key" className="mt-7" onClick={() => form.setValue('password', randomPassword())}>
      كلمة عشوائية
    </Button>
  </div>
);
