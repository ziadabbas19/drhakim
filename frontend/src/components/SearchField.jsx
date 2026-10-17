import { useEffect, useState } from 'react';
import { FormField } from './FormField.jsx';

const SEARCH_DELAY_MS = 400;

// A search box that reports onChange(name, term) once typing pauses. Pass a stable onChange,
// such as the setFilter of usePaginatedList.
export const SearchField = ({ label, placeholder, name, value = '', onChange, className }) => {
  const [term, setTerm] = useState(value);

  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed === value) return undefined;
    const timer = setTimeout(() => onChange(name, trimmed), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [term, value, name, onChange]);

  return (
    <FormField
      label={label}
      type="search"
      placeholder={placeholder}
      value={term}
      onChange={(event) => setTerm(event.target.value)}
      className={className}
    />
  );
};
