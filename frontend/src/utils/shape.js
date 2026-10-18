// Data from the API is read through these, so a missing list or object shows as empty
// instead of breaking the page.
export const listOf = (value) => (Array.isArray(value) ? value : []);

export const objectOf = (value) => (value !== null && typeof value === 'object' && !Array.isArray(value) ? value : {});

// One page of a paginated list: { items, total, ... }.
export const pageOf = (value) => {
  const page = objectOf(value);
  const items = listOf(page.items);
  return { ...page, items, total: Number.isInteger(page.total) ? page.total : items.length };
};
