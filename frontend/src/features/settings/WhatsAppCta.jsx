import { Button } from '../../components/Button.jsx';
import { useWhatsappUrl } from './useWhatsappUrl.js';

export const WhatsAppCta = ({ children = 'تواصل عبر واتساب', ...buttonProps }) => {
  const href = useWhatsappUrl();
  if (!href) return null;

  return (
    <Button href={href} external variant="whatsapp" icon="whatsapp" {...buttonProps}>
      {children}
    </Button>
  );
};
