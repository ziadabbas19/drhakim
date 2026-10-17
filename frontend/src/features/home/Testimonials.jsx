import { Card } from '../../components/Card.jsx';
import { Icon } from '../../components/Icon.jsx';
import { Section } from '../../components/Section.jsx';
import { testimonials } from '../../config/content.js';

export const Testimonials = () => (
  <Section tone="brand" eyebrow="آراء المرضى" title="ثقة نعتز بها" centered>
    <div className="grid gap-5 md:grid-cols-3">
      {testimonials.map(({ name, location, text }) => (
        <Card as="figure" key={name} className="flex flex-col gap-4">
          <Icon name="quote" className="size-8 text-brand-300" />
          <blockquote className="flex-1 leading-relaxed text-slate-700">{text}</blockquote>
          <figcaption className="border-t border-slate-100 pt-4 text-sm">
            <span className="block font-extrabold text-brand-950">{name}</span>
            <span className="text-slate-500">{location}</span>
          </figcaption>
        </Card>
      ))}
    </div>
  </Section>
);
