import { Badge } from '../../components/Badge.jsx';
import { Button } from '../../components/Button.jsx';
import { useI18n } from '../../hooks/useI18n.js';

export const ActiveBadge = ({ isActive, activeLabel, inactiveLabel }) => {
  const { t } = useI18n();
  return (
    <Badge tone={isActive ? 'success' : 'neutral'}>
      {isActive ? (activeLabel ?? t('common.active')) : (inactiveLabel ?? t('common.inactive'))}
    </Badge>
  );
};

export const ActiveToggleButton = ({ isActive, onClick, activeLabel, inactiveLabel }) => {
  const { t } = useI18n();
  return (
    <Button variant={isActive ? 'ghostDanger' : 'ghostSuccess'} size="sm" icon="power" onClick={onClick}>
      {isActive ? (activeLabel ?? t('common.deactivate')) : (inactiveLabel ?? t('common.activate'))}
    </Button>
  );
};
