import { Card } from '../../components/Card.jsx';
import { IconTile } from '../../components/IconTile.jsx';
import { Section } from '../../components/Section.jsx';
import { useContent } from '../../hooks/useContent.js';
import { useI18n } from '../../hooks/useI18n.js';
import { Stagger } from '../../motion/Stagger.jsx';

export const WhyChooseUs = () => {
  const { t } = useI18n();
  const { whyChooseUs } = useContent();

  return (
    <Section eyebrow={t('home.why.eyebrow')} title={t('home.why.title')} centered>
      <Stagger className="grid gap-5 md:grid-cols-3">
        {whyChooseUs.map(({ icon, title, text }) => (
          <Card key={title} className="lift relative h-full space-y-3 text-center">
            <IconTile name={icon} size="lg" className="mx-auto" />
            <h3 className="text-lg font-extrabold text-ink-strong">{title}</h3>
            <p className="text-sm leading-relaxed text-ink-muted">{text}</p>
          </Card>
        ))}
      </Stagger>
    </Section>
  );
};
