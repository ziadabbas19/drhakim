import { Link } from 'react-router';
import { Badge } from '../../components/Badge.jsx';
import { BookingButton } from '../../components/BookingButton.jsx';
import { Button } from '../../components/Button.jsx';
import { Container } from '../../components/Container.jsx';
import { GlowBlob } from '../../components/GlowBlob.jsx';
import { Icon } from '../../components/Icon.jsx';
import { doctor, heroHighlights, stats } from '../../config/content.js';
import { PATHS } from '../../config/navigation.js';

const [headlineStat] = stats;

const HeroVisual = () => (
  <div aria-hidden="true" className="relative mx-auto w-full max-w-72 sm:max-w-sm lg:max-w-md">
    <div className="relative aspect-square rounded-[2.5rem] bg-linear-to-br from-brand-500 via-brand-700 to-brand-950 shadow-soft">
      <div className="absolute inset-8 rounded-full border border-white/15" />
      <div className="absolute inset-16 rounded-full border border-white/20" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-32 place-items-center rounded-full bg-white/10 text-white backdrop-blur-sm sm:size-40">
          <Icon name="ear" className="size-16 sm:size-20" strokeWidth={1.5} />
        </span>
      </div>
    </div>
    <div className="absolute -bottom-5 -inset-s-3 flex items-center gap-3 rounded-2xl bg-white p-3 pe-5 shadow-soft sm:-inset-s-8">
      <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
        <Icon name="calendarCheck" />
      </span>
      <span className="text-sm leading-tight">
        <span className="block font-extrabold text-brand-950">احجز أونلاين</span>
        <span className="text-slate-500">في أقل من دقيقة</span>
      </span>
    </div>
    <div className="absolute -top-4 -inset-e-2 rounded-2xl bg-white px-4 py-3 text-center shadow-soft sm:-inset-e-6">
      <span dir="ltr" className="block text-2xl font-extrabold text-brand-700">
        {headlineStat.value}
      </span>
      <span className="text-xs font-semibold text-slate-500">{headlineStat.label}</span>
    </div>
  </div>
);

export const Hero = () => (
  <section className="relative overflow-hidden bg-linear-to-b from-brand-50 via-white to-white">
    <GlowBlob className="-top-32 -inset-e-32 size-96" />
    <Container className="relative grid items-center gap-14 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-6">
        <Badge tone="brand" className="px-3 py-1 text-sm">
          <Icon name="badge" className="size-4" />
          {doctor.title}
        </Badge>
        <h1 className="text-4xl leading-tight font-extrabold text-brand-950 sm:text-5xl">{doctor.name}</h1>
        <p className="max-w-xl text-lg leading-relaxed text-slate-600">{doctor.tagline}</p>
        <div className="flex flex-wrap gap-3">
          <BookingButton size="lg" />
          <Button as={Link} to={PATHS.clinics} size="lg" variant="secondary" icon="mapPin">
            مواعيد العيادات
          </Button>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-slate-600">
          {heroHighlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-1.5">
              <Icon name="check" className="size-4.5 text-emerald-600" />
              {highlight}
            </li>
          ))}
        </ul>
      </div>
      <HeroVisual />
    </Container>
  </section>
);
