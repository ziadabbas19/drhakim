import { ABOUT_ITEM_TYPES } from '../config/constants.js';
import { AboutItem } from '../models/index.js';
import { seedTranslated } from './seedHelpers.js';

const TANTA_MEDICINE = { subtitleAr: 'كلية الطب – جامعة طنطا', subtitleEn: 'Faculty of Medicine, Tanta University' };
const ENT_CONSULTANT = { titleAr: 'استشاري جراحة الأنف والأذن والحنجرة', titleEn: 'ENT consultant surgeon' };

// Sample content to review with the doctor before launch. Surgeries start without images,
// so the site shows placeholders until real, consented photos are added from the dashboard.
const ITEMS_BY_TYPE = {
  [ABOUT_ITEM_TYPES.QUALIFICATION]: [
    { titleAr: 'بكالوريوس الطب والجراحة', titleEn: 'Bachelor of Medicine and Surgery (MBBCh)', ...TANTA_MEDICINE },
    {
      titleAr: 'ماجستير جراحة الأنف والأذن والحنجرة',
      titleEn: 'Master’s degree in Otorhinolaryngology',
      ...TANTA_MEDICINE,
    },
    {
      titleAr: 'دكتوراه جراحة الأنف والأذن والحنجرة',
      titleEn: 'Doctorate (MD) in Otorhinolaryngology',
      ...TANTA_MEDICINE,
    },
    {
      titleAr: 'دبلومة جراحات الجيوب الأنفية بالمنظار',
      titleEn: 'Diploma in Endoscopic Sinus Surgery',
      subtitleAr: 'الجمعية المصرية لجراحات الأنف والجيوب الأنفية',
      subtitleEn: 'Egyptian Rhinology Society',
    },
  ],
  [ABOUT_ITEM_TYPES.TIMELINE]: [
    {
      titleAr: 'طبيب مقيم أنف وأذن وحنجرة',
      titleEn: 'ENT resident',
      subtitleAr: '2008 – 2011',
      subtitleEn: '2008 – 2011',
      bodyAr: 'مستشفيات جامعة طنطا',
      bodyEn: 'Tanta University Hospitals',
    },
    {
      titleAr: 'أخصائي جراحة الأنف والأذن والحنجرة',
      titleEn: 'ENT specialist',
      subtitleAr: '2011 – 2016',
      subtitleEn: '2011 – 2016',
      bodyAr: 'مستشفى السنطة المركزي',
      bodyEn: 'El-Santa Central Hospital',
    },
    {
      ...ENT_CONSULTANT,
      subtitleAr: '2016 – 2020',
      subtitleEn: '2016 – 2020',
      bodyAr: 'مستشفيات مديرية الصحة بالغربية',
      bodyEn: 'Gharbia Health Directorate hospitals',
    },
    {
      ...ENT_CONSULTANT,
      subtitleAr: '2020 – الآن',
      subtitleEn: '2020 – present',
      bodyAr: 'عيادتا السنطة والقاهرة ومستشفيات خاصة',
      bodyEn: 'El-Santa and Cairo clinics and private hospitals',
    },
  ],
  [ABOUT_ITEM_TYPES.MEMBERSHIP]: [
    { titleAr: 'نقابة أطباء مصر', titleEn: 'Egyptian Medical Syndicate' },
    { titleAr: 'الجمعية المصرية لجراحة الأنف والأذن والحنجرة', titleEn: 'Egyptian Society of Otorhinolaryngology' },
    { titleAr: 'الجمعية المصرية لجراحات الأنف والجيوب الأنفية', titleEn: 'Egyptian Rhinology Society' },
    {
      titleAr: 'الأكاديمية الأمريكية لجراحة الأنف والأذن والحنجرة – عضو دولي',
      titleEn: 'American Academy of Otolaryngology–Head and Neck Surgery, international member',
    },
  ],
  [ABOUT_ITEM_TYPES.STAT]: [
    { value: '+18', titleAr: 'عامًا من الخبرة', titleEn: 'years of experience' },
    { value: '+6,000', titleAr: 'عملية جراحية', titleEn: 'surgeries performed' },
    { value: '+30,000', titleAr: 'مريض تمت متابعته', titleEn: 'patients cared for' },
  ],
  [ABOUT_ITEM_TYPES.SURGERY]: [
    {
      titleAr: 'استئصال اللوزتين بالتردد الحراري',
      titleEn: 'Coblation tonsillectomy',
      bodyAr: 'إزالة اللوزتين بتقنية تقلل الألم والنزيف وتسرّع التعافي.',
      bodyEn: 'Tonsil removal with a technique that reduces pain and bleeding and speeds up recovery.',
      category: 'throat',
    },
    {
      titleAr: 'تعديل الحاجز الأنفي',
      titleEn: 'Septoplasty',
      bodyAr: 'تصحيح انحراف الحاجز من داخل الأنف دون جروح خارجية.',
      bodyEn: 'Straightening a deviated septum from inside the nose, with no external incisions.',
      category: 'nose',
    },
    {
      titleAr: 'جراحة الجيوب الأنفية بالمنظار',
      titleEn: 'Endoscopic sinus surgery',
      bodyAr: 'فتح الجيوب المسدودة وإزالة اللحميات الأنفية بالمنظار.',
      bodyEn: 'Opening blocked sinuses and removing nasal polyps endoscopically.',
      category: 'nose',
    },
    {
      titleAr: 'تركيب أنابيب تهوية الأذن',
      titleEn: 'Ear tube placement',
      bodyAr: 'علاج تجمع السوائل خلف طبلة الأذن عند الأطفال.',
      bodyEn: 'Treating fluid behind the eardrum in children.',
      category: 'ear',
    },
    {
      titleAr: 'ترقيع طبلة الأذن',
      titleEn: 'Tympanoplasty',
      bodyAr: 'إصلاح ثقب الطبلة لتحسين السمع ومنع الالتهابات المتكررة.',
      bodyEn: 'Repairing a perforated eardrum to improve hearing and prevent repeated infections.',
      category: 'ear',
    },
    {
      titleAr: 'جراحة الأحبال الصوتية بالمنظار',
      titleEn: 'Microlaryngeal surgery',
      bodyAr: 'إزالة زوائد الأحبال الصوتية لاستعادة وضوح الصوت.',
      bodyEn: 'Removing vocal cord lesions to restore a clear voice.',
      category: 'throat',
    },
  ],
};

const items = Object.entries(ITEMS_BY_TYPE).flatMap(([type, rows]) =>
  rows.map((row, index) => ({ type, ...row, sortOrder: index + 1 })),
);

export const seedAbout = () => seedTranslated(AboutItem, items, ['type', 'titleAr']);
