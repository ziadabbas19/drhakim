import { Reveal } from '../motion/Reveal.jsx';
import { cn } from '../utils/cn.js';
import { Container } from './Container.jsx';
import { Eyebrow } from './Eyebrow.jsx';

const TONES = {
  white: 'bg-canvas',
  muted: 'bg-surface-muted',
  brand: 'bg-surface-tint',
};

export const Section = ({ id, eyebrow, title, description, action, tone = 'white', centered = false, children }) => (
  <section id={id} className={cn('py-14 sm:py-20', TONES[tone])}>
    <Container>
      {title && (
        <Reveal
          as="header"
          className={cn(
            'mb-10 flex flex-col gap-4',
            centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
          )}
        >
          <div className={cn('max-w-2xl space-y-3', centered && 'mx-auto')}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 className="text-2xl font-extrabold text-ink-strong sm:text-3xl">{title}</h2>
            {description && <p className="leading-relaxed text-ink-muted">{description}</p>}
          </div>
          {action}
        </Reveal>
      )}
      {children}
    </Container>
  </section>
);
