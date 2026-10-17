export const CardHeader = ({ title, description }) => (
  <div className="space-y-1">
    <h2 className="text-lg font-extrabold text-ink-strong">{title}</h2>
    {description && <p className="text-sm leading-relaxed text-ink-muted">{description}</p>}
  </div>
);
