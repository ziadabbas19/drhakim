import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';
import { CardHeader } from '../../components/CardHeader.jsx';
import { Ltr } from '../../components/Ltr.jsx';
import { useI18n } from '../../hooks/useI18n.js';
import { useSiteSettings } from '../../hooks/useSiteSettings.js';
import { telLink } from '../../utils/links.js';
import { WhatsAppCta } from '../settings/WhatsAppCta.jsx';

// Shown instead of the booking steps while no clinic has published its hours.
export const BookByPhone = () => {
  const { t } = useI18n();
  const { settings } = useSiteSettings();

  return (
    <Card data-booking="by-phone" className="space-y-5 self-start">
      <CardHeader title={t('booking.byPhone.title')} description={t('booking.byPhone.text')} />
      <div className="flex flex-wrap gap-3">
        {settings.doctorPhone && (
          <Button href={telLink(settings.doctorPhone)} icon="phone" size="lg">
            {t('contact.call')} <Ltr>{settings.doctorPhone}</Ltr>
          </Button>
        )}
        <WhatsAppCta size="lg" />
      </div>
    </Card>
  );
};
