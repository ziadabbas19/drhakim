export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');

const upsertHeadElement = (tag, matchAttribute, matchValue) => {
  const selector = `${tag}[${matchAttribute}="${matchValue}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(tag);
    element.setAttribute(matchAttribute, matchValue);
    document.head.append(element);
  }
  return element;
};

// Updates the tags index.html ships with (in Arabic), and removes a tag when its value is null.
export const setMetaTag = (attribute, name, content) => {
  if (content === null) {
    document.head.querySelector(`meta[${attribute}="${name}"]`)?.remove();
    return;
  }
  upsertHeadElement('meta', attribute, name).setAttribute('content', content);
};

export const setCanonicalUrl = (href) => upsertHeadElement('link', 'rel', 'canonical').setAttribute('href', href);

const ESCAPED_LESS_THAN = String.raw`<`;

// JSON-LD for search engines; returns a function that removes it again.
export const setStructuredData = (id, data) => {
  const script = upsertHeadElement('script', 'id', `structured-data-${id}`);
  script.type = 'application/ld+json';
  // Escaping < keeps visitor-written text from closing the script element.
  script.textContent = JSON.stringify(data).replaceAll('<', ESCAPED_LESS_THAN);
  return () => script.remove();
};
