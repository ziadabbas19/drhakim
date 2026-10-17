import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { ServiceCard } from './ServiceCard.jsx';

export const ServiceList = ({ featuredOnly = false }) => {
  const services = useFetch(publicApi.services.list, []);
  const visible = services.data && (featuredOnly ? services.data.filter((service) => service.isFeatured) : services.data);

  return (
    <AsyncContent {...services} data={visible} onRetry={services.reload} emptyMessage="لا توجد خدمات معروضة حاليًا">
      {(items) => (
        <ul className="flex flex-wrap justify-center gap-5">
          {items.map((service) => (
            <li key={service.id} className="w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      )}
    </AsyncContent>
  );
};
