import { Card } from '../../components/Card.jsx';
import { IconTile } from '../../components/IconTile.jsx';
import { Section } from '../../components/Section.jsx';
import { whyChooseUs } from '../../config/content.js';

export const WhyChooseUs = () => (
  <Section eyebrow="لماذا تختارنا" title="رعاية تبدأ بالتشخيص الصحيح" centered>
    <div className="grid gap-5 md:grid-cols-3">
      {whyChooseUs.map(({ icon, title, text }) => (
        <Card key={title} className="space-y-3 text-center">
          <IconTile name={icon} size="lg" className="mx-auto" />
          <h3 className="text-lg font-extrabold text-brand-950">{title}</h3>
          <p className="text-sm leading-relaxed text-slate-600">{text}</p>
        </Card>
      ))}
    </div>
  </Section>
);
