import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ContentType = 'Website Page' | 'Landing Page' | 'Blog Post' | 'Blogs' | 'Tags' | 'Authors' | 'URL Redirects' | 'HubDB Tables';

export interface ColumnPreferences {
  [key: string]: string[]; // contentType -> array of column names
}

interface ColumnPreferencesContextType {
  columnPreferences: ColumnPreferences;
  updateColumnPreferences: (contentType: ContentType, columns: string[]) => void;
  getColumnPreferences: (contentType: ContentType) => string[];
  getAvailableColumns: (contentType: ContentType) => string[];
}

const defaultColumns: { [key in ContentType]: string[] } = {
  'Website Page': ['Name', 'Created Date', 'Updated Date', 'Status', 'URL', 'Meta Title', 'Meta Description'],
  'Landing Page': ['Name', 'Created Date', 'Updated Date', 'Status', 'Campaign', 'Lead Generation', 'Conversion Rate'],
  'Blog Post': ['Title', 'Author', 'Published Date', 'Updated Date', 'Status', 'Tags', 'Views', 'Comments'],
  'Blogs': ['Name', 'Description', 'Created Date', 'Posts Count', 'Status'],
  'Tags': ['Name', 'Description', 'Created Date', 'Usage Count', 'Associated Content'],
  'Authors': ['Name', 'Email', 'Bio', 'Created Date', 'Posts Count', 'Social Links'],
  'URL Redirects': ['Source URL', 'Destination URL', 'Type', 'Created Date', 'Status', 'Hit Count'],
  'HubDB Tables': ['Name', 'Description', 'Created Date', 'Updated Date', 'Rows Count', 'Columns Count']
};

const ColumnPreferencesContext = createContext<ColumnPreferencesContextType | undefined>(undefined);

export function ColumnPreferencesProvider({ children }: { children: ReactNode }) {
  const [columnPreferences, setColumnPreferences] = useState<ColumnPreferences>(() => {
    // Initialize with default visible columns (first 4 columns for each content type)
    const initialPreferences: ColumnPreferences = {};
    Object.entries(defaultColumns).forEach(([contentType, columns]) => {
      initialPreferences[contentType] = columns.slice(0, 4);
    });
    return initialPreferences;
  });

  const updateColumnPreferences = (contentType: ContentType, columns: string[]) => {
    setColumnPreferences(prev => ({
      ...prev,
      [contentType]: columns
    }));
  };

  const getColumnPreferences = (contentType: ContentType): string[] => {
    return columnPreferences[contentType] || defaultColumns[contentType].slice(0, 4);
  };

  const getAvailableColumns = (contentType: ContentType): string[] => {
    return defaultColumns[contentType] || [];
  };

  return (
    <ColumnPreferencesContext.Provider value={{
      columnPreferences,
      updateColumnPreferences,
      getColumnPreferences,
      getAvailableColumns
    }}>
      {children}
    </ColumnPreferencesContext.Provider>
  );
}

export function useColumnPreferences() {
  const context = useContext(ColumnPreferencesContext);
  if (context === undefined) {
    throw new Error('useColumnPreferences must be used within a ColumnPreferencesProvider');
  }
  return context;
}