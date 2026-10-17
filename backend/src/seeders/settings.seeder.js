import { SiteSetting } from '../models/index.js';
import { aboutProfileSettings, contactSettings } from '../services/setting.service.js';
import { createMissing, fillMissingTranslations } from './seedHelpers.js';

const paragraphs = (...texts) => texts.map((text) => `<p>${text}</p>`).join('');

const SAMPLE_VALUES = {
  doctorPhone: { valueAr: '01001234567' },
  whatsappNumber: { valueAr: '01001234567' },
  workingHoursNote: {
    valueAr: 'يُفضّل الحجز المسبق لضمان الموعد، وفي الحالات الطارئة يرجى الاتصال بالعيادة مباشرة.',
    valueEn:
      'Booking in advance is recommended to secure your appointment. For emergencies, please call the clinic directly.',
  },
  headline: {
    valueAr: 'تشخيص دقيق أولًا، ثم علاج آمن ومدروس',
    valueEn: 'Accurate diagnosis first, then safe and considered treatment',
  },
  intro: {
    valueAr:
      'أكثر من ثمانية عشر عامًا في تشخيص وعلاج أمراض الأنف والأذن والحنجرة، مع اهتمام خاص بجراحات المناظير وعلاج الأطفال.',
    valueEn:
      'More than eighteen years of diagnosing and treating ear, nose, and throat conditions, with a special focus on endoscopic surgery and children’s care.',
  },
  bio: {
    valueAr: paragraphs(
      'بدأ د. عبد الحكيم عبد السلام مسيرته في قسم الأنف والأذن والحنجرة بمستشفيات جامعة طنطا، وتدرّج في العمل حتى أصبح استشاريًا للتخصص، وأجرى خلال هذه السنوات آلاف العمليات الجراحية للكبار والأطفال.',
      'يؤمن الدكتور بأن الخطوة الأولى في العلاج هي التشخيص الصحيح، لذلك يعتمد على الفحص بالمنظار واختبارات السمع والاتزان داخل العيادة، ويشرح للمريض حالته وخيارات العلاج المتاحة بوضوح قبل اتخاذ أي قرار.',
      'يستقبل الدكتور مرضاه في عيادتين بالسنطة والقاهرة، ويحرص على أن يحصل كل مريض على وقت كافٍ للفحص والمناقشة، مع متابعة مستمرة بعد العمليات حتى التعافي الكامل.',
    ),
    valueEn: paragraphs(
      'Dr. Abdelhakim Abdelsalam began his career in the ENT department of Tanta University Hospitals and rose through the ranks to become a consultant in the specialty, performing thousands of operations on adults and children along the way.',
      'He believes the first step in any treatment is the right diagnosis, so he relies on endoscopic examination and hearing and balance tests in the clinic, and explains each patient’s condition and treatment options clearly before any decision is made.',
      'He sees patients at two clinics, in El-Santa and Cairo, and makes sure every patient has enough time for examination and discussion, with close follow-up after surgery until full recovery.',
    ),
  },
};

export const seedSettings = async () => {
  const rows = [...contactSettings.storedKeys, ...aboutProfileSettings.storedKeys].map((key) => ({
    key,
    valueAr: '',
    valueEn: null,
    ...SAMPLE_VALUES[key],
  }));
  const created = await createMissing(SiteSetting, rows, 'key');
  const translated = await fillMissingTranslations(SiteSetting, rows, ['key', 'valueAr']);
  return `site_settings: ${created} keys created, English added to ${translated}`;
};
