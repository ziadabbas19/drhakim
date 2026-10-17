import { Service } from '../models/index.js';
import { seedTranslated } from './seedHelpers.js';

const services = [
  {
    titleAr: 'استئصال اللوزتين',
    titleEn: 'Tonsillectomy',
    descriptionAr:
      'جراحة لإزالة اللوزتين في حالات الالتهاب المتكرر أو التضخم الذي يسبب صعوبة البلع والشخير وانقطاع النفس أثناء النوم، بتقنيات حديثة تقلل الألم وتسرّع العودة للأكل الطبيعي.',
    descriptionEn:
      'Removal of the tonsils for recurrent infections or enlargement that causes difficulty swallowing, snoring, or sleep apnea, using modern techniques that reduce pain and speed up the return to normal eating.',
    icon: 'throat',
    isFeatured: true,
  },
  {
    titleAr: 'استئصال اللحمية',
    titleEn: 'Adenoidectomy',
    descriptionAr:
      'علاج تضخم اللحمية عند الأطفال المسبب لانسداد الأنف والتنفس من الفم والشخير والتهابات الأذن المتكررة، في عملية قصيرة يعود بعدها الطفل إلى المنزل في نفس اليوم.',
    descriptionEn:
      'Treatment of enlarged adenoids in children that block the nose and cause mouth breathing, snoring, and repeated ear infections, in a short procedure after which the child goes home the same day.',
    icon: 'child',
    isFeatured: false,
  },
  {
    titleAr: 'جراحة الجيوب الأنفية بالمنظار',
    titleEn: 'Endoscopic sinus surgery',
    descriptionAr:
      'علاج التهاب الجيوب الأنفية المزمن واللحميات الأنفية بالمنظار دون أي جروح خارجية، لاستعادة التنفس الطبيعي والتخلص من الصداع والإفرازات المستمرة.',
    descriptionEn:
      'Endoscopic treatment of chronic sinusitis and nasal polyps with no external incisions, to restore normal breathing and relieve headaches and constant discharge.',
    icon: 'sinus',
    isFeatured: true,
  },
  {
    titleAr: 'تعديل الحاجز الأنفي',
    titleEn: 'Septoplasty',
    descriptionAr:
      'تصحيح انحراف الحاجز الأنفي الذي يسبب انسداد الأنف وصعوبة التنفس والشخير، مع إمكانية علاج تضخم القرنيات الأنفية في نفس الجلسة.',
    descriptionEn:
      'Correction of a deviated nasal septum that causes nasal blockage, difficulty breathing, and snoring, with the option of treating enlarged turbinates in the same session.',
    icon: 'nose',
    isFeatured: true,
  },
  {
    titleAr: 'تركيب أنابيب تهوية الأذن',
    titleEn: 'Ear ventilation tubes',
    descriptionAr:
      'تركيب أنابيب دقيقة في طبلة الأذن لعلاج تجمع السوائل خلف الطبلة والالتهابات المتكررة خاصة عند الأطفال، لتحسين السمع ومنع تأخر الكلام.',
    descriptionEn:
      'Placement of tiny tubes in the eardrum to treat fluid behind the eardrum and repeated infections, especially in children, to improve hearing and prevent speech delay.',
    icon: 'ear',
    isFeatured: false,
  },
  {
    titleAr: 'تقييم السمع والاتزان',
    titleEn: 'Hearing and balance assessment',
    descriptionAr:
      'فحص شامل يشمل قياس السمع ورسم الأذن وتقييم حالات الدوخة والدوار وطنين الأذن، لتحديد السبب بدقة ووضع خطة العلاج المناسبة لكل حالة.',
    descriptionEn:
      'A complete assessment including hearing tests, tympanometry, and evaluation of dizziness, vertigo, and tinnitus, to find the exact cause and plan the right treatment for each case.',
    icon: 'hearing',
    isFeatured: true,
  },
  {
    titleAr: 'علاج اضطرابات الصوت والحلق',
    titleEn: 'Voice and throat disorders',
    descriptionAr:
      'تشخيص وعلاج بحة الصوت وزوائد الأحبال الصوتية وارتجاع المريء الحنجري بالمنظار، مع متابعة خاصة للمعلمين والمطربين وأصحاب المهن التي تعتمد على الصوت.',
    descriptionEn:
      'Endoscopic diagnosis and treatment of hoarseness, vocal cord lesions, and laryngopharyngeal reflux, with special follow-up for teachers, singers, and other professional voice users.',
    icon: 'voice',
    isFeatured: false,
  },
].map((service, index) => ({ ...service, sortOrder: index + 1 }));

export const seedServices = () => seedTranslated(Service, services, ['titleAr']);
