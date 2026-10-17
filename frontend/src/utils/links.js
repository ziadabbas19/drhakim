const EGYPT_COUNTRY_CODE = '20';

export const EXTERNAL_LINK_PROPS = Object.freeze({ target: '_blank', rel: 'noopener noreferrer' });

export const telLink = (phone) => `tel:${phone}`;

export const whatsappLink = (localNumber, message = '') => {
  const international = `${EGYPT_COUNTRY_CODE}${localNumber.replace(/^0/, '')}`;
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${international}${query}`;
};
