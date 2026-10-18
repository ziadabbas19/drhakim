import { Card } from '../../components/Card.jsx';
import { IconTile } from '../../components/IconTile.jsx';
import { useContent } from '../../hooks/useContent.js';
import { useI18n } from '../../hooks/useI18n.js';

// The doctor's evening clinic at a hospital: shown for information, not booked through the site.
export const HospitalClinicCard = ({ headingLevel = 2, className }) => {
  const { t } = useI18n();
  const { hospitalClinic } = useContent();
  const Heading = `h${headingLevel}`;

  return (
    <Card as="aside" className={className}>
      <div className="flex items-start gap-4">
        <IconTile name="hospital" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-primary-ink">{t('clinics.hospital')}</p>
          <Heading className="text-lg font-extrabold text-ink-strong">{hospitalClinic.name}</Heading>
          <p className="font-semibold text-ink">{hospitalClinic.schedule}</p>
          <p className="text-sm text-ink-muted">{hospitalClinic.note}</p>
        </div>
      </div>
    </Card>
  );
};
