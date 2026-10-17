export const CardHeader = ({ title, description }) => (
  <div className="space-y-1">
    <h2 className="text-lg font-extrabold text-brand-950">{title}</h2>
    {description && <p className="text-sm leading-relaxed text-slate-600">{description}</p>}
  </div>
);
