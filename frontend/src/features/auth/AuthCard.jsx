import { Card } from '../../components/Card.jsx';
import { Container } from '../../components/Container.jsx';
import { IconTile } from '../../components/IconTile.jsx';
import { Reveal } from '../../motion/Reveal.jsx';

export const AuthCard = ({ title, description, children }) => (
  <Container className="flex min-h-[70dvh] items-center justify-center py-12">
    <Reveal as={Card} variant="scale" className="w-full max-w-md space-y-6 p-6 sm:p-8">
      <div className="space-y-2 text-center">
        <IconTile name="key" size="lg" className="mx-auto" />
        <h1 className="text-2xl font-extrabold text-ink-strong">{title}</h1>
        {description && <p className="text-sm leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {children}
    </Reveal>
  </Container>
);
