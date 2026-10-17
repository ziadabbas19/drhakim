import { Link } from 'react-router';
import { Badge } from '../../components/Badge.jsx';
import { Button } from '../../components/Button.jsx';
import { Card } from '../../components/Card.jsx';
import { Icon } from '../../components/Icon.jsx';
import { IconTile } from '../../components/IconTile.jsx';
import { InfoRow } from '../../components/InfoRow.jsx';
import { PhoneLink } from '../../components/PhoneLink.jsx';
import { bookingPathFor } from '../../config/navigation.js';
import { formatNumber } from '../../utils/number.js';
import { WeeklySchedule } from './WeeklySchedule.jsx';

export const ClinicCard = ({ clinic, showSchedule = true }) => (
  <Card as="article" className="flex h-full flex-col gap-5">
    <header className="flex items-start justify-between gap-3">
      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-brand-950">{clinic.name}</h3>
        <Badge tone="brand">
          <Icon name="mapPin" className="size-3.5" />
          {clinic.city}
        </Badge>
      </div>
      <IconTile name="building" size="sm" />
    </header>

    <ul className="space-y-2.5 text-sm text-slate-600">
      <InfoRow icon="mapPin">{clinic.address}</InfoRow>
      <InfoRow icon="phone">
        <PhoneLink phone={clinic.phone} />
      </InfoRow>
      <InfoRow icon="clock">مدة الكشف حوالي {formatNumber(clinic.slotDurationMinutes)} دقيقة</InfoRow>
    </ul>

    {showSchedule && (
      <div className="space-y-2">
        <h4 className="text-sm font-extrabold text-slate-700">مواعيد العمل</h4>
        <WeeklySchedule schedules={clinic.schedules} />
      </div>
    )}

    <div className="mt-auto flex flex-wrap gap-2 pt-1">
      <Button as={Link} to={bookingPathFor(clinic.id)} icon="calendar">
        احجز في هذه العيادة
      </Button>
      {clinic.mapUrl && (
        <Button href={clinic.mapUrl} external variant="secondary" icon="external">
          الموقع على الخريطة
        </Button>
      )}
    </div>
  </Card>
);
