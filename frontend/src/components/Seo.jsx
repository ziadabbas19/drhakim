import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { siteTitleFor } from '../config/content.js';
import { useContent } from '../hooks/useContent.js';
import { useI18n } from '../hooks/useI18n.js';
import { setCanonicalUrl, setMetaTag } from '../utils/documentMeta.js';

const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

// Title, description, and social tags in the selected language.
export const Seo = ({ title, noIndex = false }) => {
  const { pathname } = useLocation();
  const { t, lang, ogLocale } = useI18n();
  const { doctor, seo } = useContent();
  const fullTitle = title ? t('seo.pageTitle', { title, name: doctor.name }) : siteTitleFor(lang);

  useEffect(() => {
    document.title = fullTitle;
    setMetaTag('name', 'description', seo.description);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', seo.description);
    setMetaTag('property', 'og:site_name', doctor.name);
    setMetaTag('property', 'og:locale', ogLocale);
    setMetaTag('property', 'og:url', `${SITE_URL}${pathname}`);
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', seo.description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : null);
    setCanonicalUrl(`${SITE_URL}${pathname}`);
  }, [fullTitle, seo.description, doctor.name, ogLocale, pathname, noIndex]);

  return null;
};
