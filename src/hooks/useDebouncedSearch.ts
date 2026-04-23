import { useState, useEffect } from 'react';

interface UseDebouncedSearchProps {
  debounceMs?: number;
  initialValue?: string;
}

export default function useDebouncedSearch({
  debounceMs = 400,
  initialValue = '',
}: UseDebouncedSearchProps = {}) {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [searchQuery, debounceMs]);

  const resetSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    resetSearch,
  };
}
