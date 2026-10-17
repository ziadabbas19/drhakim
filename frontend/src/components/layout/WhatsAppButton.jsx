import { useWhatsappUrl } from '../../features/settings/useWhatsappUrl.js';
import { EXTERNAL_LINK_PROPS } from '../../utils/links.js';
import { Icon } from '../Icon.jsx';

export const WhatsAppButton = () => {
  const href = useWhatsappUrl();
  if (!href) return null;

  return (
    <a
      href={href}
      {...EXTERNAL_LINK_PROPS}
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-5 inset-e-5 z-30 grid size-14 place-items-center rounded-full bg-emerald-600 text-white shadow-soft ring-4 ring-white transition-transform hover:scale-105 hover:bg-emerald-700"
    >
      <Icon name="whatsapp" className="size-7" />
    </a>
  );
};
