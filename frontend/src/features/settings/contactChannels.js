import { doctor } from '../../config/content.js';
import { EXTERNAL_LINK_PROPS, telLink, whatsappLink } from '../../utils/links.js';

const WHATSAPP_GREETING = `السلام عليكم، أود الاستفسار عن حجز موعد مع ${doctor.name}`;

export const SOCIAL_CHANNELS = Object.freeze([
  { key: 'facebookUrl', icon: 'facebook', label: 'فيسبوك' },
  { key: 'instagramUrl', icon: 'instagram', label: 'إنستجرام' },
  { key: 'youtubeUrl', icon: 'youtube', label: 'يوتيوب' },
  { key: 'tiktokUrl', icon: 'tiktok', label: 'تيك توك' },
]);

export const getWhatsappUrl = (settings) =>
  settings.whatsappNumber ? whatsappLink(settings.whatsappNumber, WHATSAPP_GREETING) : null;

export const getContactChannels = (settings) =>
  [
    settings.doctorPhone && {
      key: 'phone',
      icon: 'phone',
      label: 'اتصل بنا',
      value: settings.doctorPhone,
      linkProps: { href: telLink(settings.doctorPhone) },
    },
    settings.whatsappNumber && {
      key: 'whatsapp',
      icon: 'whatsapp',
      label: 'واتساب',
      value: settings.whatsappNumber,
      linkProps: { href: getWhatsappUrl(settings), ...EXTERNAL_LINK_PROPS },
    },
    settings.email && {
      key: 'email',
      icon: 'mail',
      label: 'البريد الإلكتروني',
      value: settings.email,
      linkProps: { href: `mailto:${settings.email}` },
    },
  ].filter(Boolean);

export const getSocialLinks = (settings) =>
  SOCIAL_CHANNELS.filter(({ key }) => settings[key]).map((channel) => ({ ...channel, href: settings[channel.key] }));
