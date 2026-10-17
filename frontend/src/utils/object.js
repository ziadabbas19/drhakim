export const pickValues = (source, defaults) =>
  Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, source?.[key] ?? fallback]));
