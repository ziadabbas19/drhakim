import { Badge } from '../../components/Badge.jsx';
import { ROLE_OPTIONS, findOption } from '../../config/constants.js';

export const RoleBadge = ({ role }) => {
  const { tone, label } = findOption(ROLE_OPTIONS, role);
  return <Badge tone={tone}>{label}</Badge>;
};
