import { Container } from '../../components/Container.jsx';
import { stats } from '../../config/content.js';

export const StatsBar = () => (
  <Container className="relative z-10 mt-6">
    <dl className="grid gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft sm:grid-cols-3 sm:gap-0">
      {stats.map(({ value, label }) => (
        <div
          key={label}
          className="flex flex-col-reverse items-center gap-1 border-slate-100 text-center sm:border-s sm:first:border-s-0"
        >
          <dt className="text-sm font-semibold text-slate-500">{label}</dt>
          <dd dir="ltr" className="text-3xl font-extrabold text-brand-700">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  </Container>
);
