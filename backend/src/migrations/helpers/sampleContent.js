// The sample content that earlier versions of `npm run seed` created, kept only so the
// replace-sample-content migration can recognise rows nobody has edited. None of it is real:
// it must never be shown on the site again. The Arabic text was the same in every version;
// databases seeded before English existed may have empty English columns.
import { mapSearchUrl } from '../../utils/maps.js';

const weekly = (days, ranges) =>
  days.flatMap((dayOfWeek) => ranges.map(([startTime, endTime]) => ({ dayOfWeek, startTime, endTime })));

const DAYS = Object.freeze({ SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3, THURSDAY: 4, SATURDAY: 6 });

export const SAMPLE_CLINICS = Object.freeze([
  {
    nameAr: 'عيادة السنطة',
    nameEn: 'El-Santa Clinic',
    cityAr: 'السنطة - الغربية',
    cityEn: 'El-Santa, Gharbia',
    addressAr: 'شارع المحطة، أعلى صيدلية الشفاء، الدور الأول، السنطة',
    addressEn: 'El-Mahatta Street, above El-Shefaa Pharmacy, first floor, El-Santa',
    phone: '0403461275',
    mapUrl: mapSearchUrl('السنطة، الغربية، مصر'),
    slotDurationMinutes: 20,
    schedules: weekly([DAYS.SATURDAY, DAYS.MONDAY, DAYS.WEDNESDAY], [['16:00', '21:00']]),
  },
  {
    nameAr: 'عيادة القاهرة',
    nameEn: 'Cairo Clinic',
    cityAr: 'القاهرة',
    cityEn: 'Cairo',
    addressAr: '24 شارع مكرم عبيد، مدينة نصر، الدور الثالث، القاهرة',
    addressEn: '24 Makram Ebeid Street, Nasr City, third floor, Cairo',
    phone: '0224017733',
    mapUrl: mapSearchUrl('شارع مكرم عبيد، مدينة نصر، القاهرة'),
    slotDurationMinutes: 30,
    schedules: [
      ...weekly(
        [DAYS.SUNDAY, DAYS.TUESDAY],
        [
          ['12:00', '15:00'],
          ['18:00', '22:00'],
        ],
      ),
      ...weekly([DAYS.THURSDAY], [['13:00', '18:00']]),
    ],
  },
]);

export const SAMPLE_SERVICES = Object.freeze([
  {
    titleAr: 'استئصال اللوزتين',
    titleEn: 'Tonsillectomy',
    descriptionAr:
      'جراحة لإزالة اللوزتين في حالات الالتهاب المتكرر أو التضخم الذي يسبب صعوبة البلع والشخير وانقطاع النفس أثناء النوم، بتقنيات حديثة تقلل الألم وتسرّع العودة للأكل الطبيعي.',
    descriptionEn:
      'Removal of the tonsils for recurrent infections or enlargement that causes difficulty swallowing, snoring, or sleep apnea, using modern techniques that reduce pain and speed up the return to normal eating.',
    icon: 'throat',
  },
  {
    titleAr: 'استئصال اللحمية',
    titleEn: 'Adenoidectomy',
    descriptionAr:
      'علاج تضخم اللحمية عند الأطفال المسبب لانسداد الأنف والتنفس من الفم والشخير والتهابات الأذن المتكررة، في عملية قصيرة يعود بعدها الطفل إلى المنزل في نفس اليوم.',
    descriptionEn:
      'Treatment of enlarged adenoids in children that block the nose and cause mouth breathing, snoring, and repeated ear infections, in a short procedure after which the child goes home the same day.',
    icon: 'child',
  },
  {
    titleAr: 'جراحة الجيوب الأنفية بالمنظار',
    titleEn: 'Endoscopic sinus surgery',
    descriptionAr:
      'علاج التهاب الجيوب الأنفية المزمن واللحميات الأنفية بالمنظار دون أي جروح خارجية، لاستعادة التنفس الطبيعي والتخلص من الصداع والإفرازات المستمرة.',
    descriptionEn:
      'Endoscopic treatment of chronic sinusitis and nasal polyps with no external incisions, to restore normal breathing and relieve headaches and constant discharge.',
    icon: 'sinus',
  },
  {
    titleAr: 'تعديل الحاجز الأنفي',
    titleEn: 'Septoplasty',
    descriptionAr:
      'تصحيح انحراف الحاجز الأنفي الذي يسبب انسداد الأنف وصعوبة التنفس والشخير، مع إمكانية علاج تضخم القرنيات الأنفية في نفس الجلسة.',
    descriptionEn:
      'Correction of a deviated nasal septum that causes nasal blockage, difficulty breathing, and snoring, with the option of treating enlarged turbinates in the same session.',
    icon: 'nose',
  },
  {
    titleAr: 'تركيب أنابيب تهوية الأذن',
    titleEn: 'Ear ventilation tubes',
    descriptionAr:
      'تركيب أنابيب دقيقة في طبلة الأذن لعلاج تجمع السوائل خلف الطبلة والالتهابات المتكررة خاصة عند الأطفال، لتحسين السمع ومنع تأخر الكلام.',
    descriptionEn:
      'Placement of tiny tubes in the eardrum to treat fluid behind the eardrum and repeated infections, especially in children, to improve hearing and prevent speech delay.',
    icon: 'ear',
  },
  {
    titleAr: 'تقييم السمع والاتزان',
    titleEn: 'Hearing and balance assessment',
    descriptionAr:
      'فحص شامل يشمل قياس السمع ورسم الأذن وتقييم حالات الدوخة والدوار وطنين الأذن، لتحديد السبب بدقة ووضع خطة العلاج المناسبة لكل حالة.',
    descriptionEn:
      'A complete assessment including hearing tests, tympanometry, and evaluation of dizziness, vertigo, and tinnitus, to find the exact cause and plan the right treatment for each case.',
    icon: 'hearing',
  },
  {
    titleAr: 'علاج اضطرابات الصوت والحلق',
    titleEn: 'Voice and throat disorders',
    descriptionAr:
      'تشخيص وعلاج بحة الصوت وزوائد الأحبال الصوتية وارتجاع المريء الحنجري بالمنظار، مع متابعة خاصة للمعلمين والمطربين وأصحاب المهن التي تعتمد على الصوت.',
    descriptionEn:
      'Endoscopic diagnosis and treatment of hoarseness, vocal cord lesions, and laryngopharyngeal reflux, with special follow-up for teachers, singers, and other professional voice users.',
    icon: 'voice',
  },
]);

const paragraphs = (...texts) => texts.map((text) => `<p>${text}</p>`).join('');

export const SAMPLE_SETTINGS = Object.freeze({
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
});

const TANTA_MEDICINE = { subtitleAr: 'كلية الطب – جامعة طنطا', subtitleEn: 'Faculty of Medicine, Tanta University' };
const ENT_CONSULTANT = { titleAr: 'استشاري جراحة الأنف والأذن والحنجرة', titleEn: 'ENT consultant surgeon' };

const SAMPLE_ITEMS_BY_TYPE = {
  qualification: [
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
  timeline: [
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
  membership: [
    { titleAr: 'نقابة أطباء مصر', titleEn: 'Egyptian Medical Syndicate' },
    { titleAr: 'الجمعية المصرية لجراحة الأنف والأذن والحنجرة', titleEn: 'Egyptian Society of Otorhinolaryngology' },
    { titleAr: 'الجمعية المصرية لجراحات الأنف والجيوب الأنفية', titleEn: 'Egyptian Rhinology Society' },
    {
      titleAr: 'الأكاديمية الأمريكية لجراحة الأنف والأذن والحنجرة – عضو دولي',
      titleEn: 'American Academy of Otolaryngology–Head and Neck Surgery, international member',
    },
  ],
  stat: [
    { value: '+18', titleAr: 'عامًا من الخبرة', titleEn: 'years of experience' },
    { value: '+6,000', titleAr: 'عملية جراحية', titleEn: 'surgeries performed' },
    { value: '+30,000', titleAr: 'مريض تمت متابعته', titleEn: 'patients cared for' },
  ],
  surgery: [
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

export const SAMPLE_ABOUT_ITEMS = Object.freeze(
  Object.entries(SAMPLE_ITEMS_BY_TYPE).flatMap(([type, rows]) => rows.map((row) => ({ type, ...row }))),
);
