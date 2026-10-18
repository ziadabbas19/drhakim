import { ABOUT_ITEM_TYPES } from '../config/constants.js';
import { mapSearchUrl } from '../utils/maps.js';

// The doctor's confirmed details, used by the seeders and by the migration that replaced the
// earlier sample content. Nothing here may be added without the doctor confirming it: anything
// unknown (clinic hours, statistics, dates) is left empty and filled in from the dashboard.

export const DOCTOR_PHONE = '01050066077';

const paragraphs = (...texts) => texts.map((text) => `<p>${text}</p>`).join('');

// Clinic working days and hours are not known yet, so clinics start without a schedule and the
// booking page asks patients to call until one is added from the dashboard.
export const CLINICS = Object.freeze([
  {
    nameAr: 'عيادة السنطة',
    nameEn: 'El-Santa Clinic',
    cityAr: 'السنطة',
    cityEn: 'El-Santa',
    addressAr: 'شارع الجمهورية، بجوار صيدلية الكرم، السنطة',
    addressEn: 'Al-Gomhoria Street, next to Al-Karam Pharmacy, El-Santa',
    phone: DOCTOR_PHONE,
    mapUrl: mapSearchUrl('صيدلية الكرم، شارع الجمهورية، السنطة'),
    sortOrder: 1,
  },
  {
    nameAr: 'عيادة القاهرة',
    nameEn: 'Cairo Clinic',
    cityAr: 'القاهرة',
    cityEn: 'Cairo',
    addressAr:
      '105 شارع بورسعيد، الدور الأول، شقة 1، ميدان أبو الريش، السيدة زينب، أمام محطة مترو السيدة زينب، القاهرة',
    addressEn:
      '105 Port Said Street, first floor, apartment 1, Abu El-Reesh Square, El-Sayeda Zeinab, opposite El-Sayeda Zeinab metro station, Cairo',
    phone: DOCTOR_PHONE,
    mapUrl: mapSearchUrl('105 شارع بورسعيد، السيدة زينب، القاهرة'),
    sortOrder: 2,
  },
]);

// General categories matching the doctor's focus areas, with no claims about techniques or results.
export const SERVICES = Object.freeze(
  [
    {
      titleAr: 'مناظير الأنف والجيوب الأنفية',
      titleEn: 'Nose and sinus endoscopy',
      descriptionAr: 'فحص الأنف والجيوب الأنفية باستخدام المنظار.',
      descriptionEn: 'Examination of the nose and sinuses with an endoscope.',
      icon: 'sinus',
      isFeatured: true,
    },
    {
      titleAr: 'مناظير الأذن والحلق والحنجرة',
      titleEn: 'Ear, throat and larynx endoscopy',
      descriptionAr: 'فحص الأذن والحلق والحنجرة باستخدام المنظار.',
      descriptionEn: 'Examination of the ear, throat and larynx with an endoscope.',
      icon: 'ear',
      isFeatured: false,
    },
    {
      titleAr: 'أنف وأذن وحنجرة الأطفال',
      titleEn: 'Pediatric ENT',
      descriptionAr: 'تشخيص وعلاج أمراض الأنف والأذن والحنجرة عند الأطفال.',
      descriptionEn: 'Diagnosis and treatment of ear, nose and throat conditions in children.',
      icon: 'child',
      isFeatured: false,
    },
    {
      titleAr: 'السمعيات والاتزان',
      titleEn: 'Audiology and balance',
      descriptionAr: 'تشخيص وعلاج اضطرابات السمع والاتزان.',
      descriptionEn: 'Diagnosis and treatment of hearing and balance disorders.',
      icon: 'hearing',
      isFeatured: true,
    },
    {
      titleAr: 'جراحات الأنف والأذن والحنجرة',
      titleEn: 'ENT surgery',
      descriptionAr: 'جراحات الأنف والأذن والحنجرة للكبار والأطفال.',
      descriptionEn: 'Ear, nose and throat surgery for adults and children.',
      icon: 'surgery',
      isFeatured: true,
    },
  ].map((service, index) => ({ ...service, sortOrder: index + 1 })),
);

// Site settings by key. Settings not listed start empty (email, social links, the hours note).
export const SETTING_VALUES = Object.freeze({
  doctorPhone: { valueAr: DOCTOR_PHONE },
  whatsappNumber: { valueAr: DOCTOR_PHONE },
  headline: {
    valueAr: 'أخصائي وجراح الأنف والأذن والحنجرة',
    valueEn: 'ENT specialist and surgeon',
  },
  intro: {
    valueAr:
      'ماجستير الأنف والأذن والحنجرة من جامعة الأزهر، ويعمل بمستشفى التأمين الصحي بالمقطم ومستشفى الشيخ زايد التخصصي.',
    valueEn:
      'Master’s degree in ENT from Al-Azhar University, working at Maqattam Health Insurance Hospital and Sheikh Zayed Specialized Hospital.',
  },
  bio: {
    valueAr: paragraphs(
      'د. عبد الحكيم عبد السلام (د. حكيم) أخصائي وجراح الأنف والأذن والحنجرة، حاصل على ماجستير الأنف والأذن والحنجرة من جامعة الأزهر، وله دراسات عليا في طب وجراحة الأنف والأذن والحنجرة. عضو الجمعيتين العربية والأوروبية لأمراض الأنف والجيوب الأنفية، والجمعية العربية لأمراض الأنف (PARS)، والزمالة المصرية والبورد المصري لجراحة الأنف والأذن والحنجرة والرأس والعنق. يعمل طبيبًا للأنف والأذن والحنجرة بمستشفى التأمين الصحي بالمقطم، وله عيادة مسائية بمستشفى الشيخ زايد التخصصي يوم الاثنين من 3 إلى 5 مساءً. يهتم بمناظير الحنجرة والأذن والجيوب الأنفية، وأمراض وجراحات الأنف والأذن والحنجرة للكبار والأطفال، والسمعيات واضطرابات السمع والاتزان.',
    ),
    valueEn: paragraphs(
      'Dr. Abdelhakim Abdelsalam, known as Dr. Hakim, is an ENT (ear, nose and throat) specialist and surgeon, with a Master’s degree in ENT from Al-Azhar University and postgraduate studies in ENT medicine and surgery. Dr. Hakim is a member of the Arab and European societies for nose and sinus diseases, the Pan Arab Rhinology Society (PARS), and the Egyptian Fellowship and Egyptian Board of ENT and Head and Neck Surgery, works as an otorhinolaryngologist at Maqattam Health Insurance Hospital, and holds an evening clinic at Sheikh Zayed Specialized Hospital on Mondays from 3 to 5 PM. Focus areas: endoscopy of the larynx, ear and sinuses; adult and pediatric ENT and surgery; audiology; and hearing and balance disorders.',
    ),
  },
});

// About page lists. Statistics, surgeries and before/after photos start empty: the photos are
// added with `npm run import:images` or from the dashboard, and statistics only by the doctor.
const ITEMS_BY_TYPE = {
  [ABOUT_ITEM_TYPES.QUALIFICATION]: [
    {
      titleAr: 'ماجستير الأنف والأذن والحنجرة',
      titleEn: 'Master’s degree in ENT',
      subtitleAr: 'جامعة الأزهر',
      subtitleEn: 'Al-Azhar University',
    },
    {
      titleAr: 'دراسات عليا في طب وجراحة الأنف والأذن والحنجرة',
      titleEn: 'Postgraduate studies in ENT medicine and surgery',
    },
  ],
  [ABOUT_ITEM_TYPES.TIMELINE]: [
    {
      titleAr: 'طبيب أنف وأذن وحنجرة',
      titleEn: 'Otorhinolaryngologist',
      bodyAr: 'مستشفى التأمين الصحي بالمقطم',
      bodyEn: 'Maqattam Health Insurance Hospital',
    },
    {
      titleAr: 'العيادة المسائية',
      titleEn: 'Evening clinic',
      subtitleAr: 'الاثنين من 3 إلى 5 مساءً',
      subtitleEn: 'Mondays, 3 to 5 PM',
      bodyAr: 'مستشفى الشيخ زايد التخصصي',
      bodyEn: 'Sheikh Zayed Specialized Hospital',
    },
  ],
  [ABOUT_ITEM_TYPES.MEMBERSHIP]: [
    {
      titleAr: 'الجمعيتان العربية والأوروبية لأمراض الأنف والجيوب الأنفية',
      titleEn: 'Arab and European societies for nose and sinus diseases',
    },
    { titleAr: 'الجمعية العربية لأمراض الأنف (PARS)', titleEn: 'Pan Arab Rhinology Society (PARS)' },
    {
      titleAr: 'الزمالة المصرية والبورد المصري لجراحة الأنف والأذن والحنجرة والرأس والعنق',
      titleEn: 'Egyptian Fellowship and Egyptian Board of ENT and Head and Neck Surgery',
    },
  ],
};

export const ABOUT_ITEMS = Object.freeze(
  Object.entries(ITEMS_BY_TYPE).flatMap(([type, rows]) =>
    rows.map((row, index) => ({ type, ...row, sortOrder: index + 1 })),
  ),
);
