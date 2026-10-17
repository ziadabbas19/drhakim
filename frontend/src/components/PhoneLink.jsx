import { cn } from '../utils/cn.js';
import { telLink } from '../utils/links.js';

export const PhoneLink = ({ phone, className }) => (
  <a href={telLink(phone)} dir="ltr" className={cn('font-bold text-primary-ink hover:underline', className)}>
    {phone}
  </a>
);
