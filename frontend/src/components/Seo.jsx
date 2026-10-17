import { useLocation } from 'react-router';
import { doctor, siteTitle } from '../config/content.js';

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

export const Seo = ({ title, noIndex = false }) => {
  const { pathname } = useLocation();

  return (
    <>
      <title>{title ? `${title} | ${doctor.name}` : siteTitle}</title>
      <link rel="canonical" href={`${SITE_URL}${pathname}`} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
};
