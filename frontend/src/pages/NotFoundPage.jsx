import { Link } from 'react-router';
import { BookingButton } from '../components/BookingButton.jsx';
import { Button } from '../components/Button.jsx';
import { Container } from '../components/Container.jsx';
import { Seo } from '../components/Seo.jsx';
import { PATHS } from '../config/navigation.js';

export default function NotFoundPage() {
  return (
    <Container className="flex min-h-[60dvh] flex-col items-center justify-center gap-5 py-16 text-center">
      <Seo title="الصفحة غير موجودة" noIndex />
      <p className="text-6xl font-extrabold text-brand-200">404</p>
      <h1 className="text-2xl font-extrabold text-brand-950">الصفحة التي تبحث عنها غير موجودة</h1>
      <p className="text-slate-600">ربما تم نقلها أو أن الرابط غير صحيح.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button as={Link} to={PATHS.home}>
          الصفحة الرئيسية
        </Button>
        <BookingButton variant="secondary" />
      </div>
    </Container>
  );
}
