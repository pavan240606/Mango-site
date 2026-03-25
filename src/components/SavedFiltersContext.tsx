import { createContext, useContext, useState, ReactNode } from 'react';

export interface SavedFilter {
  id: string;
  name: string;
  contentType: string;
  filters: {
    searchQuery?: string;
    authorName?: string[];
    campaign?: string[];
    domain?: string[];
    htmlTitle?: string[];
    language?: string[];
    name?: string[];
    slug?: string[];
    state?: string[];
    publishDate?: Date | null;
    [key: string]: any;
  };
  createdAt: Date;
}

interface SavedFiltersContextType {
  savedFilters: SavedFilter[];
  addSavedFilter: (filter: Omit<SavedFilter, 'id' | 'createdAt'>) => void;
  removeSavedFilter: (id: string) => void;
  updateSavedFilter: (id: string, updates: Partial<SavedFilter>) => void;
  getSavedFiltersByContentType: (contentType: string) => SavedFilter[];
}

const SavedFiltersContext = createContext<SavedFiltersContextType | undefined>(undefined);

export function SavedFiltersProvider({ children }: { children: ReactNode }) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    // Some example saved filters
    {
      id: '1',
      name: 'Published Landing Pages',
      contentType: 'landing-page',
      filters: {
        state: ['Published'],
      },
      createdAt: new Date('2024-12-01')
    },
    {
      id: '2',
      name: 'Recent Blog Posts',
      contentType: 'blog-post',
      filters: {
        state: ['Published'],
        publishDate: new Date('2024-11-01')
      },
      createdAt: new Date('2024-12-02')
    }
  ]);

  const addSavedFilter = (filter: Omit<SavedFilter, 'id' | 'createdAt'>) => {
    const newFilter: SavedFilter = {
      ...filter,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setSavedFilters(prev => [...prev, newFilter]);
  };

  const removeSavedFilter = (id: string) => {
    setSavedFilters(prev => prev.filter(filter => filter.id !== id));
  };

  const updateSavedFilter = (id: string, updates: Partial<SavedFilter>) => {
    setSavedFilters(prev => prev.map(filter =>
      filter.id === id ? { ...filter, ...updates } : filter
    ));
  };

  const getSavedFiltersByContentType = (contentType: string) => {
    return savedFilters.filter(filter => filter.contentType === contentType);
  };

  return (
    <SavedFiltersContext.Provider value={{
      savedFilters,
      addSavedFilter,
      removeSavedFilter,
      updateSavedFilter,
      getSavedFiltersByContentType
    }}>
      {children}
    </SavedFiltersContext.Provider>
  );
}

export function useSavedFilters() {
  const context = useContext(SavedFiltersContext);
  if (context === undefined) {
    throw new Error('useSavedFilters must be used within a SavedFiltersProvider');
  }
  return context;
}
