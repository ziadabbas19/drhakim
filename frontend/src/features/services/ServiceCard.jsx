import { Card } from '../../components/Card.jsx';
import { IconTile } from '../../components/IconTile.jsx';

export const ServiceCard = ({ service }) => (
  <Card as="article" className="group h-full transition-shadow hover:shadow-soft">
    <IconTile
      name={service.icon}
      className="mb-4 transition-colors group-hover:bg-brand-600 group-hover:text-white"
    />
    <h3 className="mb-2 text-lg font-extrabold text-brand-950">{service.title}</h3>
    <p className="text-sm leading-relaxed text-slate-600">{service.description}</p>
  </Card>
);
