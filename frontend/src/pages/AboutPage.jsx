import { CallToAction } from '../components/CallToAction.jsx';
import { Card } from '../components/Card.jsx';
import { Icon } from '../components/Icon.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Section } from '../components/Section.jsx';
import { Seo } from '../components/Seo.jsx';
import { about, doctor } from '../config/content.js';

const CardHeading = ({ icon, children }) => (
  <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-brand-950">
    <Icon name={icon} className="size-6 text-brand-600" />
    {children}
  </h2>
);

export default function AboutPage() {
  return (
    <>
      <Seo title="عن الدكتور" />
      <PageHeader eyebrow={doctor.title} title={`عن ${doctor.name}`} description={about.intro} />

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5 text-lg leading-loose text-slate-700">
            {about.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
          <Card>
            <CardHeading icon="graduation">المؤهلات العلمية</CardHeading>
            <ul className="space-y-4">
              {about.qualifications.map(({ title, institution }) => (
                <li key={title} className="flex gap-3">
                  <Icon name="award" className="mt-1 size-5 shrink-0 text-brand-500" />
                  <span>
                    <span className="block font-bold text-slate-800">{title}</span>
                    <span className="text-sm text-slate-500">{institution}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section tone="muted" title="مسيرة مهنية" eyebrow="الخبرات">
        <ol className="relative space-y-6 border-s-2 border-brand-200 ps-6">
          {about.timeline.map(({ period, title, place }) => (
            <li key={period} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -inset-s-[2.05rem] size-4 rounded-full border-4 border-white bg-brand-500 shadow"
              />
              <Card className="space-y-1">
                <p className="text-sm font-bold text-brand-600">{period}</p>
                <h3 className="text-lg font-extrabold text-brand-950">{title}</h3>
                <p className="text-slate-600">{place}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="العضويات المهنية" eyebrow="عضويات">
        <ul className="grid gap-4 sm:grid-cols-2">
          {about.memberships.map((membership) => (
            <li key={membership}>
              <Card className="flex h-full items-center gap-3">
                <Icon name="badge" className="size-6 shrink-0 text-brand-600" />
                <span className="font-bold text-slate-700">{membership}</span>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <CallToAction />
    </>
  );
}
