import { DEFAULT_LANGUAGE } from './languages.js';

// Static site content in both languages, limited to details the doctor has confirmed. The
// biography, career, and photos are managed from the dashboard (About page), and patient reviews
// are submitted from the site.
const CONTENT = Object.freeze({
  ar: {
    doctor: {
      name: 'د. عبد الحكيم عبد السلام',
      knownAs: 'د. حكيم',
      title: 'أخصائي وجراح الأنف والأذن والحنجرة',
      tagline:
        'تشخيص وعلاج أمراض الأنف والأذن والحنجرة وجراحاتها للكبار والأطفال، ومناظير الحنجرة والأذن والجيوب الأنفية، والسمعيات واضطرابات السمع والاتزان.',
    },
    seo: {
      description:
        'د. عبد الحكيم عبد السلام (د. حكيم)، أخصائي وجراح الأنف والأذن والحنجرة، ماجستير الأنف والأذن والحنجرة من جامعة الأزهر. عيادتان في السنطة والقاهرة (السيدة زينب).',
    },
    heroHighlights: [
      'ماجستير الأنف والأذن والحنجرة – جامعة الأزهر',
      'مناظير الحنجرة والأذن والجيوب الأنفية',
      'للكبار والأطفال',
    ],
    whyChooseUs: [
      {
        icon: 'graduation',
        title: 'ماجستير جامعة الأزهر',
        text: 'ماجستير الأنف والأذن والحنجرة من جامعة الأزهر، ودراسات عليا في طب وجراحة الأنف والأذن والحنجرة.',
      },
      {
        icon: 'badge',
        title: 'عضويات متخصصة',
        text: 'عضو الجمعيتين العربية والأوروبية لأمراض الأنف والجيوب الأنفية، والجمعية العربية لأمراض الأنف (PARS)، والزمالة المصرية والبورد المصري لجراحة الأنف والأذن والحنجرة والرأس والعنق.',
      },
      {
        icon: 'microscope',
        title: 'مناظير وسمعيات',
        text: 'مناظير الحنجرة والأذن والجيوب الأنفية، والسمعيات واضطرابات السمع والاتزان، للكبار والأطفال.',
      },
    ],
    // Not a clinic patients book through the site, so it is shown for information only.
    hospitalClinic: {
      name: 'مستشفى الشيخ زايد التخصصي',
      schedule: 'العيادة المسائية: الاثنين من 3 إلى 5 مساءً',
      note: 'الحجز في هذه العيادة لا يتم من خلال الموقع.',
    },
    bookingNotes: [
      'أحضر معك أي أشعة أو تحاليل أو روشتات سابقة إن وُجدت.',
      'ستتواصل العيادة معك لتأكيد الحجز، ويمكنك الإلغاء بالاتصال بالعيادة.',
    ],
  },
  en: {
    doctor: {
      name: 'Dr. Abdelhakim Abdelsalam',
      knownAs: 'Dr. Hakim',
      title: 'ENT Specialist and Surgeon',
      tagline:
        'Diagnosis, treatment, and surgery of ear, nose, and throat conditions for adults and children, endoscopy of the larynx, ear, and sinuses, and audiology for hearing and balance disorders.',
    },
    seo: {
      description:
        'Dr. Abdelhakim Abdelsalam (Dr. Hakim), ENT specialist and surgeon with a Master’s degree in ENT from Al-Azhar University. Clinics in El-Santa and Cairo (El-Sayeda Zeinab).',
    },
    heroHighlights: [
      'Master’s in ENT, Al-Azhar University',
      'Endoscopy of the larynx, ear, and sinuses',
      'Adults and children',
    ],
    whyChooseUs: [
      {
        icon: 'graduation',
        title: 'Al-Azhar University Master’s',
        text: 'A Master’s degree in ENT from Al-Azhar University, and postgraduate studies in ENT medicine and surgery.',
      },
      {
        icon: 'badge',
        title: 'Specialist memberships',
        text: 'Member of the Arab and European societies for nose and sinus diseases, the Pan Arab Rhinology Society (PARS), and the Egyptian Fellowship and Egyptian Board of ENT and Head and Neck Surgery.',
      },
      {
        icon: 'microscope',
        title: 'Endoscopy and audiology',
        text: 'Endoscopy of the larynx, ear, and sinuses, and audiology for hearing and balance disorders, for adults and children.',
      },
    ],
    hospitalClinic: {
      name: 'Sheikh Zayed Specialized Hospital',
      schedule: 'Evening clinic: Mondays, 3 to 5 PM',
      note: 'Visits at this clinic are not booked through this site.',
    },
    bookingNotes: [
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
