import { Link } from 'react-router';
import { PATHS } from '../config/navigation.js';
import { Button } from './Button.jsx';

export const BookingButton = ({ children = 'احجز كشف', ...buttonProps }) => (
  <Button as={Link} to={PATHS.booking} icon="calendar" {...buttonProps}>
    {children}
  </Button>
);
