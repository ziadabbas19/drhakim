import { Fragment } from 'react';
import { Container } from '../../components/Container.jsx';
import { Stagger } from '../../motion/Stagger.jsx';

export const StatsBar = ({ stats }) => {
  if (!stats?.length) return null;

  return (
    <Container className="relative z-10 mt-6">
      <Stagger
        as="dl"
        className="grid gap-5 rounded-3xl border border-line bg-surface p-6 shadow-soft sm:auto-cols-fr sm:grid-flow-col sm:gap-0"
        itemClassName="flex flex-col-reverse items-center gap-1 border-line text-center sm:border-s sm:first:border-s-0"
      >
        {stats.map(({ id, value, title }) => (
          <Fragment key={id}>
            <dt className="text-sm font-semibold text-ink-subtle">{title}</dt>
            <dd dir="ltr" className="text-3xl font-extrabold text-primary-ink">
              {value}
            </dd>
          </Fragment>
        ))}
      </Stagger>
    </Container>
  );
};
