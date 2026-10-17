import { Badge } from '../../components/Badge.jsx';
import { Button } from '../../components/Button.jsx';

export const ActiveBadge = ({ isActive, activeLabel = 'مفعّل', inactiveLabel = 'متوقف' }) => (
  <Badge tone={isActive ? 'success' : 'neutral'}>{isActive ? activeLabel : inactiveLabel}</Badge>
);

export const ActiveToggleButton = ({ isActive, onClick }) => (
  <Button variant={isActive ? 'ghostDanger' : 'ghostSuccess'} size="sm" icon="power" onClick={onClick}>
    {isActive ? 'إيقاف' : 'تفعيل'}
  </Button>
);
