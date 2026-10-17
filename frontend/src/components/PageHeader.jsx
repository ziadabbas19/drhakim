import { Stagger } from '../motion/Stagger.jsx';
import { Container } from './Container.jsx';
import { Eyebrow } from './Eyebrow.jsx';
import { GlowBlob } from './GlowBlob.jsx';

export const PageHeader = ({ eyebrow, title, description }) => (
  <div className="relative overflow-hidden bg-linear-to-b from-surface-tint to-canvas">
    <GlowBlob className="-top-24 -inset-s-24" />
    <Container className="relative py-12 sm:py-16">
      <Stagger variant="rise" className="space-y-4">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="text-3xl font-extrabold text-ink-strong sm:text-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-lg leading-relaxed text-ink-muted">{description}</p>}
      </Stagger>
    </Container>
  </div>
);
