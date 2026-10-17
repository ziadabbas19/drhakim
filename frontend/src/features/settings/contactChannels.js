import { useContent } from '../../hooks/useContent.js';
import { useI18n } from '../../hooks/useI18n.js';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { EXTERNAL_LINK_PROPS, telLink, whatsappLink } from '../../utils/links.js';

// Labels are translation keys.
export const SOCIAL_CHANNELS = Object.freeze([
  { key: 'facebookUrl', icon: 'facebook', label: 'contact.social.facebook' },
  { key: 'instagramUrl', icon: 'instagram', label: 'contact.social.instagram' },
  { key: 'youtubeUrl', icon: 'youtube', label: 'contact.social.youtube' },
  { key: 'tiktokUrl', icon: 'tiktok', label: 'contact.social.tiktok' },
]);

export const useWhatsappUrl = () => {
  const { settings } = useSiteSettings();
  const { t } = useI18n();
  const { doctor } = useContent();
  return settings.whatsappNumber
    ? whatsappLink(settings.whatsappNumber, t('contact.whatsappGreeting', { name: doctor.name }))
    : null;
};

export const useContactChannels = () => {
  const { settings } = useSiteSettings();
  const { t } = useI18n();
  const whatsappUrl = useWhatsappUrl();

  return [
    settings.doctorPhone && {
      key: 'phone',
      icon: 'phone',
      label: t('contact.call'),
      value: settings.doctorPhone,
      linkProps: { href: telLink(settings.doctorPhone) },
    },
    whatsappUrl && {
      key: 'whatsapp',
      icon: 'whatsapp',
      label: t('contact.whatsapp'),
      value: settings.whatsappNumber,
      linkProps: { href: whatsappUrl, ...EXTERNAL_LINK_PROPS },
    },
    settings.email && {
      key: 'email',
      icon: 'mail',
      label: t('contact.email'),
      value: settings.email,
      linkProps: { href: `mailto:${settings.email}` },
    },
  ].filter(Boolean);
};

export const useSocialLinks = () => {
  const { settings } = useSiteSettings();
  const { t } = useI18n();
  return SOCIAL_CHANNELS.filter(({ key }) => settings[key]).map((channel) => ({
    ...channel,
    label: t(channel.label),
    href: settings[channel.key],
  }));
};
