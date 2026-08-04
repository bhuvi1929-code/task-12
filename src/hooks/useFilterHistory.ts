import { useState, useCallback, useEffect } from 'react';

export function useFilterHistory<T>(currentFilters: T, setAllFilters: (filters: T) => void) {
  const [history, setHistory] = useState<T[]>([currentFilters]);

  // Keep history up to date as filters change
  useEffect(() => {
    setHistory((prev) => {
      // If the current filters are different from the last history item, push to history
      const last = prev[prev.length - 1];
      if (JSON.stringify(last) !== JSON.stringify(currentFilters)) {
        return [...prev, currentFilters].slice(-10); // Keep last 10
      }
      return prev;
    });
  }, [currentFilters]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length > 1) {
        const newHistory = prev.slice(0, -1);
        const previousFilters = newHistory[newHistory.length - 1];
        setAllFilters(previousFilters);
        return newHistory;
      }
      return prev;
    });
  }, [setAllFilters]);

  const canUndo = history.length > 1;

  return { undo, canUndo };
}
