import { useWhatsappUrl } from '../../features/settings/contactChannels.js';
import { useI18n } from '../../hooks/useI18n.js';
import { EXTERNAL_LINK_PROPS } from '../../utils/links.js';
import { Icon } from '../Icon.jsx';

export const WhatsAppButton = () => {
  const { t } = useI18n();
  const href = useWhatsappUrl();
  if (!href) return null;

  return (
    <a
      href={href}
      {...EXTERNAL_LINK_PROPS}
      aria-label={t('a11y.whatsapp')}
      className="lift fixed bottom-5 inset-e-5 z-30 grid size-14 place-items-center rounded-full bg-whatsapp text-on-whatsapp shadow-soft ring-4 ring-canvas hover:bg-whatsapp-hover"
    >
      <Icon name="whatsapp" className="size-7" />
    </a>
  );
};
