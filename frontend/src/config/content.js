import { DEFAULT_LANGUAGE } from './languages.js';

// Static site content in both languages. The biography, career, statistics, and galleries are
// managed from the dashboard (About page), and patient reviews are submitted from the site.
const CONTENT = Object.freeze({
  ar: {
    doctor: {
      name: 'د. عبد الحكيم عبد السلام',
      title: 'استشاري جراحة الأنف والأذن والحنجرة',
      tagline:
        'تشخيص دقيق وعلاج آمن لمشكلات الأنف والأذن والحنجرة للكبار والأطفال، بأحدث تقنيات المناظير والجراحات الدقيقة.',
    },
    seo: {
      description:
        'د. عبد الحكيم عبد السلام، استشاري جراحة الأنف والأذن والحنجرة بعيادتي السنطة والقاهرة. احجز كشفك أونلاين لعلاج اللوزتين واللحمية والجيوب الأنفية والحاجز الأنفي ومشكلات السمع والاتزان.',
    },
    heroHighlights: ['جراحات المناظير الحديثة', 'رعاية خاصة للأطفال', 'متابعة دقيقة بعد العمليات'],
    whyChooseUs: [
      {
        icon: 'microscope',
        title: 'تشخيص بالمنظار',
        text: 'فحص الأنف والحنجرة بالمنظار داخل العيادة لتحديد سبب المشكلة بدقة من أول زيارة.',
      },
      {
        icon: 'shield',
        title: 'قرار علاجي مدروس',
        text: 'خطة علاج واضحة تبدأ بالعلاج الدوائي، واللجوء للجراحة فقط عندما تكون هي الحل الأفضل.',
      },
      {
        icon: 'heartHandshake',
        title: 'متابعة بعد العملية',
        text: 'زيارات متابعة منتظمة وتواصل مباشر مع العيادة للاطمئنان على التعافي خطوة بخطوة.',
      },
    ],
    bookingNotes: [
      'يُرجى الحضور قبل موعدك بعشر دقائق.',
      'أحضر معك أي أشعة أو تحاليل أو روشتات سابقة إن وُجدت.',
      'ستتواصل العيادة معك لتأكيد الحجز، ويمكنك الإلغاء بالاتصال بالعيادة.',
    ],
  },
  en: {
    doctor: {
      name: 'Dr. Abdelhakim Abdelsalam',
      title: 'Consultant ENT Surgeon',
      tagline:
        'Accurate diagnosis and safe treatment of ear, nose, and throat conditions for adults and children, with the latest endoscopic and microsurgical techniques.',
    },
    seo: {
      description:
        'Dr. Abdelhakim Abdelsalam, consultant ENT surgeon at clinics in El-Santa and Cairo. Book your visit online for tonsils, adenoids, sinuses, a deviated septum, and hearing or balance problems.',
    },
    heroHighlights: ['Modern endoscopic surgery', 'Dedicated care for children', 'Close follow-up after surgery'],
    whyChooseUs: [
      {
        icon: 'microscope',
        title: 'Endoscopic diagnosis',
        text: 'Endoscopic examination of the nose and throat in the clinic to find the exact cause from the first visit.',
      },
      {
        icon: 'shield',
        title: 'A considered treatment plan',
        text: 'A clear plan that starts with medication, turning to surgery only when it is the best option.',
      },
      {
        icon: 'heartHandshake',
        title: 'Follow-up after surgery',
        text: 'Regular follow-up visits and direct contact with the clinic to check on your recovery step by step.',
      },
    ],
    bookingNotes: [
      'Please arrive ten minutes before your appointment.',
      'Bring any previous scans, test results, or prescriptions you have.',
      'The clinic will contact you to confirm the booking. To cancel, call the clinic.',
    ],
  },
});

export const contentFor = (lang) => CONTENT[lang] ?? CONTENT[DEFAULT_LANGUAGE];

export const siteTitleFor = (lang) => {
  const { doctor } = contentFor(lang);
  return `${doctor.name} | ${doctor.title}`;
};
