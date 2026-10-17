import { cn } from '../utils/cn.js';

// Shows formatted text from the dashboard editor. The API sanitises it on save and only allows
// paragraphs, emphasis, lists, and https/mail/phone links.
export const RichText = ({ html, className }) => (
  <div className={cn('rich-text', className)} dangerouslySetInnerHTML={{ __html: html }} />
);
