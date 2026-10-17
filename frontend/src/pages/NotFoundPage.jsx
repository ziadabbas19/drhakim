import { Link } from 'react-router';
import { BookingButton } from '../components/BookingButton.jsx';
import { Button } from '../components/Button.jsx';
import { Container } from '../components/Container.jsx';
import { Seo } from '../components/Seo.jsx';
import { PATHS } from '../config/navigation.js';
import { useI18n } from '../hooks/useI18n.js';
import { Stagger } from '../motion/Stagger.jsx';

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <Container className="py-16">
      <Seo title={t('notFound.pageTitle')} noIndex />
      <Stagger className="flex min-h-[50dvh] flex-col items-center justify-center gap-5 text-center">
        <p className="text-6xl font-extrabold text-primary">404</p>
        <h1 className="text-2xl font-extrabold text-ink-strong">{t('notFound.title')}</h1>
        <p className="text-ink-muted">{t('notFound.description')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button as={Link} to={PATHS.home}>
            {t('notFound.home')}
          </Button>
          <BookingButton variant="secondary" />
        </div>
      </Stagger>
    </Container>
  );
}
