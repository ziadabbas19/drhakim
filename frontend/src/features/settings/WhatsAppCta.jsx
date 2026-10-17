import { Button } from '../../components/Button.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { useWhatsappUrl } from './contactChannels.js';

export const WhatsAppCta = ({ children, ...buttonProps }) => {
  const { t } = useI18n();
  const href = useWhatsappUrl();
  if (!href) return null;

  return (
    <Button href={href} external variant="whatsapp" icon="whatsapp" {...buttonProps}>
      {children ?? t('contact.whatsappCta')}
    </Button>
  );
};
