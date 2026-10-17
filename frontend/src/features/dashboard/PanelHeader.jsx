import { Seo } from '../../components/Seo.jsx';

export const PanelHeader = ({ title, description, actions }) => (
  <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <Seo title={title} noIndex />
    <div className="space-y-1">
      <h1 className="text-2xl font-extrabold text-brand-950">{title}</h1>
      {description && <p className="text-slate-600">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </header>
);
