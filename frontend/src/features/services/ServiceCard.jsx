import { Card } from '../../components/Card.jsx';
import { IconTile } from '../../components/IconTile.jsx';
import { ResponsiveImage } from '../../components/ResponsiveImage.jsx';

const SERVICE_IMAGE_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';

// headingLevel follows the page: 2 directly under the page title, 3 inside a titled section.
export const ServiceCard = ({ service, headingLevel = 3 }) => {
  const Heading = `h${headingLevel}`;
  return (
    <Card as="article" className="lift relative h-full p-0 sm:p-0">
      {service.image && (
        <ResponsiveImage
          media={service.image}
          alt={service.title}
          sizes={SERVICE_IMAGE_SIZES}
          className="aspect-video rounded-t-2xl"
        />
      )}
      <div className="p-5 sm:p-6">
        <IconTile name={service.icon} className="mb-4" />
        <Heading className="mb-2 text-lg font-extrabold text-ink-strong">{service.title}</Heading>
        <p className="text-sm leading-relaxed text-ink-muted">{service.description}</p>
      </div>
    </Card>
  );
};
