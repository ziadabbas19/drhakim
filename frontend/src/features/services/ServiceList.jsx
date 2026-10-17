import { publicApi } from '../../api/public.js';
import { AsyncContent } from '../../components/AsyncContent.jsx';
import { useFetch } from '../../hooks/useFetch.js';
import { useI18n } from '../../hooks/useI18n.js';
import { Stagger } from '../../motion/Stagger.jsx';
import { ServiceCard } from './ServiceCard.jsx';

export const ServiceList = ({ featuredOnly = false, headingLevel }) => {
  const { t } = useI18n();
  const services = useFetch(publicApi.services.list, []);
  const visible =
    services.data && (featuredOnly ? services.data.filter((service) => service.isFeatured) : services.data);

  return (
    <AsyncContent
      {...services}
      data={visible}
      onRetry={services.reload}
      emptyMessage={t('services.empty')}
      reserveSpace
    >
      {(items) => (
        <Stagger
          as="ul"
          itemAs="li"
          className="flex flex-wrap justify-center gap-5"
          itemClassName="w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
        >
          {items.map((service) => (
            <ServiceCard key={service.id} service={service} headingLevel={headingLevel} />
          ))}
        </Stagger>
      )}
    </AsyncContent>
  );
};
