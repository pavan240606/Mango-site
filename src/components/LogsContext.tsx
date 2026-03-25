import { createContext, useContext, useState, ReactNode } from 'react';

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'activity' | 'hubspot' | 'bulk-edit';
  action: string;
  resource: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  user?: string;
  metadata?: Record<string, any>;
}

interface LogsContextType {
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  getLogsByType: (type: LogEntry['type']) => LogEntry[];
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

const generateSampleLogs = (): LogEntry[] => {
  const baseTime = new Date();
  
  return [
    // Export Records - 4 total
    {
      id: '1',
      timestamp: new Date(baseTime.getTime() - 5 * 60000), // 5 minutes ago
      type: 'activity',
      action: 'export',
      resource: 'landing-pages',
      status: 'success',
      message: 'Successfully exported 25 Landing Pages to CSV',
      metadata: { count: 25, format: 'csv' }
    },
    {
      id: '2',
      timestamp: new Date(baseTime.getTime() - 12 * 60000), // 12 minutes ago
      type: 'activity',
      action: 'export',
      resource: 'website-pages',
      status: 'success',
      message: 'Successfully exported 42 Website Pages to Excel',
      metadata: { count: 42, format: 'xlsx' }
    },
    {
      id: '3',
      timestamp: new Date(baseTime.getTime() - 18 * 60000), // 18 minutes ago
      type: 'activity',
      action: 'export',
      resource: 'blog-posts',
      status: 'success',
      message: 'Successfully exported 15 Blog Posts to CSV',
      metadata: { count: 15, format: 'csv' }
    },
    {
      id: '4',
      timestamp: new Date(baseTime.getTime() - 22 * 60000), // 22 minutes ago
      type: 'activity',
      action: 'export',
      resource: 'authors',
      status: 'error',
      message: 'Failed to export Authors - Permission denied',
      details: 'Export failed due to insufficient permissions. Please contact your administrator.',
      metadata: { errorCode: 'PERMISSION_DENIED' }
    },

    // Import Records - 4 total
    {
      id: '5',
      timestamp: new Date(baseTime.getTime() - 8 * 60000), // 8 minutes ago
      type: 'activity',
      action: 'import',
      resource: 'blog-posts',
      status: 'error',
      message: 'Failed to import blog posts - Invalid CSV format',
      details: 'Row 15: Missing required field "title". Row 23: Invalid date format for "publish_date".',
      metadata: { errorCount: 2, totalRows: 50 }
    },
    {
      id: '6',
      timestamp: new Date(baseTime.getTime() - 15 * 60000), // 15 minutes ago
      type: 'activity',
      action: 'import',
      resource: 'website-pages',
      status: 'success',
      message: 'Successfully imported 18 Website Pages from CSV',
      metadata: { count: 18, format: 'csv', duplicatesSkipped: 2 }
    },
    {
      id: '7',
      timestamp: new Date(baseTime.getTime() - 26 * 60000), // 26 minutes ago
      type: 'activity',
      action: 'import',
      resource: 'landing-pages',
      status: 'success',
      message: 'Successfully imported 12 Landing Pages from CSV',
      metadata: { count: 12, format: 'xlsx' }
    },
    {
      id: '8',
      timestamp: new Date(baseTime.getTime() - 33 * 60000), // 33 minutes ago
      type: 'activity',
      action: 'import',
      resource: 'authors',
      status: 'success',
      message: 'Successfully imported 5 Authors from CSV',
      metadata: { count: 5, format: 'csv' }
    },

    // Update Records - 4 total
    {
      id: '9',
      timestamp: new Date(baseTime.getTime() - 30 * 60000), // 30 minutes ago
      type: 'activity',
      action: 'update',
      resource: 'website-pages',
      status: 'success',
      message: 'Updated website page "About Us"',
      metadata: { pageId: 'page_12345', url: '/about-us' }
    },
    {
      id: '10',
      timestamp: new Date(baseTime.getTime() - 35 * 60000), // 35 minutes ago
      type: 'bulk-edit',
      action: 'update',
      resource: 'landing-pages',
      status: 'success',
      message: 'Bulk updated 12 Landing Pages - Meta description changed',
      metadata: { 
        field: 'metaDescription', 
        value: 'New meta description for SEO optimization',
        affectedPages: 12 
      }
    },
    {
      id: '11',
      timestamp: new Date(baseTime.getTime() - 40 * 60000), // 40 minutes ago
      type: 'bulk-edit',
      action: 'update',
      resource: 'blog-posts',
      status: 'error',
      message: 'Bulk edit failed - Invalid tag IDs provided',
      details: 'Invalid tag IDs: [999, 1001, 1003]. These tags do not exist in the system.',
      metadata: { 
        field: 'tagIds', 
        invalidTags: [999, 1001, 1003],
        selectedCount: 8 
      }
    },
    {
      id: '12',
      timestamp: new Date(baseTime.getTime() - 45 * 60000), // 45 minutes ago
      type: 'activity',
      action: 'update',
      resource: 'hubdb-tables',
      status: 'success',
      message: 'Successfully updated HubDB table',
      details: 'All fields updated successfully with proper data type conversion.',
      metadata: { tableId: 'table_67890', updatedFields: 5 }
    }
  ];
};

export function LogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>(generateSampleLogs);

  const addLog = (logData: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newLog: LogEntry = {
      ...logData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogsByType = (type: LogEntry['type']) => {
    return logs.filter(log => log.type === type);
  };

  return (
    <LogsContext.Provider value={{ logs, addLog, clearLogs, getLogsByType }}>
      {children}
    </LogsContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogsContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
}
