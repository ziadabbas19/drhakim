const setCacheControl = (value) => (_req, res, next) => {
  res.set('Cache-Control', value);
  next();
};

// Browsers revalidate every time (a cheap 304 through the ETag), so edits show up immediately,
// while shared caches such as a CDN may keep a copy for a minute.
export const cachePublic = setCacheControl('public, max-age=0, must-revalidate, s-maxage=60');

export const noStore = setCacheControl('no-store');
