import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

export function useUrlFilters<T extends Record<string, string | string[]>>(defaultFilters: T, prefix = '') {
  const [searchParams, setSearchParams] = useSearchParams();

  // Internal state for debounced search
  const [searchInputValue, setSearchInputValue] = useState(searchParams.get(`${prefix}search`) || '');

  const getFilter = useCallback((key: keyof T): any => {
    const val = searchParams.get(`${prefix}${key as string}`);
    if (key === 'date' || key === 'search' || key === 'sortBy' || key === 'sortDir' || key === 'dateStart' || key === 'dateEnd') {
      return val || defaultFilters[key];
    }
    // If the default filter is an array, we should parse it as an array (comma-separated)
    if (Array.isArray(defaultFilters[key])) {
      return val ? val.split(',').filter(Boolean) : defaultFilters[key];
    }
    return val || defaultFilters[key];
  }, [searchParams, defaultFilters]);

  const setFilter = useCallback((key: keyof T, value: string | string[]) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      const paramKey = `${prefix}${key as string}`;
      
      if (value === undefined || value === null || (Array.isArray(value) && value.length === 0) || value === '') {
        newParams.delete(paramKey);
      } else if (Array.isArray(value)) {
        newParams.set(paramKey, value.join(','));
      } else {
        newParams.set(paramKey, value as string);
      }
      return newParams;
    });
  }, [setSearchParams, prefix]);

  const setAllFilters = useCallback((filters: T) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        const paramKey = `${prefix}${key}`;
        if (key === 'date' || key === 'search' || key === 'sortBy' || key === 'sortDir' || key === 'dateStart' || key === 'dateEnd') {
          if (value && value !== defaultFilters[key]) {
            newParams.set(paramKey, value as string);
          } else {
            newParams.delete(paramKey);
          }
        } else if (Array.isArray(value)) {
          if (value.length === 0) {
            newParams.delete(paramKey);
          } else {
            newParams.set(paramKey, value.join(','));
          }
        } else if (value === undefined || value === null || value === '') {
          newParams.delete(paramKey);
        } else {
          newParams.set(paramKey, value as string);
        }
      });
      return newParams;
    });
  }, [setSearchParams, prefix]);

  const clearFilters = useCallback(() => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      // Remove only keys with this prefix
      const keysToDelete: string[] = [];
      newParams.forEach((_, key) => {
        if (key.startsWith(prefix)) keysToDelete.push(key);
      });
      keysToDelete.forEach(k => newParams.delete(k));
      return newParams;
    });
    setSearchInputValue('');
  }, [setSearchParams, prefix]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter('search' as keyof T, searchInputValue);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchInputValue, setFilter]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchInputValue(value);
  }, []);

  return { getFilter, setFilter, setAllFilters, clearFilters, searchInputValue, handleSearchChange };
}
