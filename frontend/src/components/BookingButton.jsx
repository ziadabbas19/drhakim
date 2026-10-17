import { Link } from 'react-router';
import { PATHS } from '../config/navigation.js';
import { useI18n } from '../hooks/useI18n.js';
import { Button } from './Button.jsx';

export const BookingButton = ({ children, ...buttonProps }) => {
  const { t } = useI18n();

  return (
    <Button as={Link} to={PATHS.booking} icon="calendar" {...buttonProps}>
      {children ?? t('nav.book')}
    </Button>
  );
};
