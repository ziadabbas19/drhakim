import { Badge } from '../../components/Badge.jsx';
import { OPTION_TONES } from '../../config/constants.js';
import { useOptionLabel } from '../../hooks/useOptions.js';

export const RoleBadge = ({ role }) => {
  const optionLabel = useOptionLabel();
  return <Badge tone={OPTION_TONES.role[role]}>{optionLabel('role', role)}</Badge>;
};
