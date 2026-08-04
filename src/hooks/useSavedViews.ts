import { useState, useCallback, useEffect } from 'react';

export interface SavedView<T> {
  id: string;
  name: string;
  filters: T;
  isDefault?: boolean;
}

const STORAGE_KEY = 'dashboard_saved_views';

export function useSavedViews<T>() {
  const [views, setViews] = useState<SavedView<T>[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setViews(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load saved views from localStorage', err);
    }
  }, []);

  const saveViews = useCallback((newViews: SavedView<T>[]) => {
    setViews(newViews);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newViews));
  }, []);

  const saveView = useCallback((name: string, filters: T, isDefault = false) => {
    const id = Date.now().toString();
    const newView = { id, name, filters, isDefault };
    let newViews = [...views];
    
    if (isDefault) {
      newViews = newViews.map(v => ({ ...v, isDefault: false }));
    }
    
    newViews.push(newView);
    saveViews(newViews);
  }, [views, saveViews]);

  const deleteView = useCallback((id: string) => {
    saveViews(views.filter(v => v.id !== id));
  }, [views, saveViews]);

  const getDefaultView = useCallback(() => {
    return views.find(v => v.isDefault);
  }, [views]);

  return { views, saveView, deleteView, getDefaultView };
}
