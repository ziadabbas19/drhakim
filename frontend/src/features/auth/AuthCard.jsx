import { Card } from '../../components/Card.jsx';
import { Container } from '../../components/Container.jsx';
import { IconTile } from '../../components/IconTile.jsx';

export const AuthCard = ({ title, description, children }) => (
  <Container className="flex min-h-[70dvh] items-center justify-center py-12">
    <Card className="w-full max-w-md space-y-6 p-6 sm:p-8">
      <div className="space-y-2 text-center">
        <IconTile name="key" size="lg" className="mx-auto" />
        <h1 className="text-2xl font-extrabold text-brand-950">{title}</h1>
        {description && <p className="text-sm leading-relaxed text-slate-600">{description}</p>}
      </div>
      {children}
    </Card>
  </Container>
);
