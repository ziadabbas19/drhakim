import { Link } from 'react-router';
import { Badge } from '../../components/Badge.jsx';
import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';
import { Icon } from '../../components/Icon.jsx';
import { ImageGallery } from '../../components/ImageGallery.jsx';
import { InfoRow } from '../../components/InfoRow.jsx';
import { PhoneLink } from '../../components/PhoneLink.jsx';
import { MediaImage } from '../../components/ResponsiveImage.jsx';
import { bookingPathFor } from '../../config/navigation.js';
import { useI18n } from '../../hooks/useI18n.js';
import { telLink } from '../../utils/links.js';
import { takesOnlineBookings } from './schedule.js';
import { WeeklySchedule } from './WeeklySchedule.jsx';

const CARD_IMAGE_SIZES = '(min-width: 768px) 50vw, 100vw';

// headingLevel follows the page: 2 directly under the page title, 3 inside a titled section.
// Until a clinic's hours are published, patients are asked to call instead of booking online.
export const ClinicCard = ({ clinic, showSchedule = true, showGallery = false, headingLevel = 3 }) => {
  const { t } = useI18n();
  const isBookable = takesOnlineBookings(clinic);
  const Heading = `h${headingLevel}`;
  const Subheading = `h${headingLevel + 1}`;

  return (
    <Card as="article" className="flex h-full flex-col gap-5 overflow-hidden p-0 sm:p-0">
      <MediaImage
        media={clinic.coverImage}
        fallbackIcon="building"
        alt={clinic.name}
        sizes={CARD_IMAGE_SIZES}
        className={clinic.coverImage ? 'aspect-video' : 'aspect-4/1'}
      />
      <div className="flex flex-1 flex-col gap-5 px-5 pb-5 sm:px-6 sm:pb-6">
        <header className="space-y-2">
          <Heading className="text-xl font-extrabold text-ink-strong">{clinic.name}</Heading>
          <Badge tone="brand">
            <Icon name="mapPin" className="size-3.5" />
            {clinic.city}
          </Badge>
        </header>

        <ul className="space-y-2.5 text-sm text-ink-muted">
          <InfoRow icon="mapPin">{clinic.address}</InfoRow>
          <InfoRow icon="phone">
            <PhoneLink phone={clinic.phone} />
          </InfoRow>
          {isBookable && (
            <InfoRow icon="clock">
              {t('clinics.visitLength', { duration: t('common.minutes', { count: clinic.slotDurationMinutes }) })}
            </InfoRow>
          )}
        </ul>

        {showSchedule && (
          <div className="space-y-2">
            <Subheading className="text-sm font-extrabold text-ink">{t('clinics.workingHours')}</Subheading>
            <WeeklySchedule schedules={clinic.schedules} />
          </div>
        )}

        {showGallery && clinic.gallery?.length > 0 && (
          <div className="space-y-2">
            <Subheading className="text-sm font-extrabold text-ink">
              {t('clinics.photos', { name: clinic.name })}
            </Subheading>
            <ImageGallery images={clinic.gallery} alt={clinic.name} sizes="(min-width: 768px) 16vw, 33vw" />
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {isBookable ? (
            <Button as={Link} to={bookingPathFor(clinic.id)} icon="calendar">
              {t('clinics.bookHere')}
            </Button>
          ) : (
            <Button href={telLink(clinic.phone)} icon="phone">
              {t('clinics.callToBook')}
            </Button>
          )}
          {clinic.mapUrl && (
            <Button href={clinic.mapUrl} external variant="secondary" icon="external">
              {t('clinics.map')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
