import { cn } from '../utils/cn.js';
import { Container } from './Container.jsx';
import { Eyebrow } from './Eyebrow.jsx';

const TONES = {
  white: 'bg-white',
  muted: 'bg-slate-50',
  brand: 'bg-brand-50/70',
};

export const Section = ({ eyebrow, title, description, action, tone = 'white', centered = false, children }) => (
  <section className={cn('py-14 sm:py-20', TONES[tone])}>
    <Container>
      {title && (
        <header
          className={cn(
            'mb-10 flex flex-col gap-4',
            centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
          )}
        >
          <div className={cn('max-w-2xl space-y-3', centered && 'mx-auto')}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 className="text-2xl font-extrabold text-brand-950 sm:text-3xl">{title}</h2>
            {description && <p className="leading-relaxed text-slate-600">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </Container>
  </section>
);
