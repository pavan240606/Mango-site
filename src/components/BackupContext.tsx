import { createContext, useContext, useState, ReactNode } from 'react';

// Backup interface
export interface Backup {
  id: number;
  date: string;
  name?: string;
  version?: string;
  contentTypes: string[];
  status: 'successful' | 'failed' | 'in-progress';
  fileSize: string;
  googleSheetUrl: string;
  initiatedBy: string;
  duration: string;
  type: 'manual' | 'scheduled';
  error?: string;
  changes?: {
    edited: number;
    added: number;
    deleted: number;
  };
  description?: string;
}

interface BackupContextType {
  backups: Backup[];
  addBackup: (backup: Omit<Backup, 'id'>) => void;
  getBackupById: (id: number) => Backup | undefined;
}

const BackupContext = createContext<BackupContextType | undefined>(undefined);

// Initial mock data
const initialBackups: Backup[] = [
  {
    id: 1,
    date: '2024-12-20 15:59:27',
    name: 'Pre-Launch Website Backup',
    version: 'v1.2.4',
    contentTypes: ['Website Pages', 'Blog Posts', 'Authors'],
    status: 'successful',
    fileSize: '2.4 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/abc123',
    initiatedBy: 'John Doe',
    duration: '45s',
    type: 'manual',
    changes: {
      edited: 5,
      added: 2,
      deleted: 1
    },
    description: 'Weekly automated backup - content updates and new blog posts'
  },
  {
    id: 2,
    date: '2024-12-19 12:30:15',
    name: 'Landing Page Campaign Backup',
    version: 'v1.2.3',
    contentTypes: ['Landing Pages', 'URL Redirects'],
    status: 'successful',
    fileSize: '1.2 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/def456',
    initiatedBy: 'Jane Smith',
    duration: '23s',
    type: 'manual',
    changes: {
      edited: 3,
      added: 0,
      deleted: 0
    },
    description: 'Landing page optimization and redirect cleanup'
  },
  {
    id: 3,
    date: '2024-12-18 08:15:42',
    name: 'HubDB Tables Backup',
    version: 'v1.2.2',
    contentTypes: ['HubDB Tables', 'Tags'],
    status: 'failed',
    fileSize: '-',
    googleSheetUrl: '-',
    initiatedBy: 'System (Scheduled)',
    duration: '12s',
    error: 'Google Sheets API rate limit exceeded',
    type: 'scheduled',
    changes: {
      edited: 8,
      added: 3,
      deleted: 2
    },
    description: 'Database updates and content restructuring'
  },
  {
    id: 4,
    date: '2024-12-17 23:00:00',
    name: 'Monthly Full Backup',
    version: 'v1.2.1',
    contentTypes: ['Website Pages', 'Landing Pages', 'Blog Posts'],
    status: 'successful',
    fileSize: '5.8 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/ghi789',
    initiatedBy: 'System (Scheduled)',
    duration: '1m 23s',
    type: 'scheduled',
    changes: {
      edited: 12,
      added: 5,
      deleted: 0
    },
    description: 'Major content update - new product launch materials'
  },
  {
    id: 5,
    date: '2024-12-16 14:20:33',
    name: 'Blog Content Backup',
    version: 'v1.2.0',
    contentTypes: ['Blog Posts', 'Authors', 'Tags'],
    status: 'successful',
    fileSize: '3.1 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/jkl012',
    initiatedBy: 'Sarah Johnson',
    duration: '52s',
    type: 'manual',
    changes: {
      edited: 7,
      added: 4,
      deleted: 1
    },
    description: 'New blog posts and author profiles added'
  },
  {
    id: 6,
    date: '2024-12-15 09:45:18',
    name: 'URL Redirects Update',
    version: 'v1.1.9',
    contentTypes: ['URL Redirects'],
    status: 'successful',
    fileSize: '0.8 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/mno345',
    initiatedBy: 'Mike Chen',
    duration: '18s',
    type: 'manual',
    changes: {
      edited: 2,
      added: 6,
      deleted: 3
    },
    description: 'Site restructure - redirect cleanup'
  },
  {
    id: 7,
    date: '2024-12-14 16:30:00',
    name: 'Weekend Backup',
    version: 'v1.1.8',
    contentTypes: ['Website Pages', 'Landing Pages'],
    status: 'successful',
    fileSize: '4.2 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/pqr678',
    initiatedBy: 'System (Scheduled)',
    duration: '1m 5s',
    type: 'scheduled',
    changes: {
      edited: 9,
      added: 3,
      deleted: 0
    },
    description: 'Scheduled weekend backup'
  },
  {
    id: 8,
    date: '2024-12-13 11:15:27',
    name: 'Product Launch Backup',
    version: 'v1.1.7',
    contentTypes: ['Website Pages', 'Landing Pages', 'Blog Posts'],
    status: 'successful',
    fileSize: '6.5 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/stu901',
    initiatedBy: 'Emily Davis',
    duration: '1m 42s',
    type: 'manual',
    changes: {
      edited: 15,
      added: 8,
      deleted: 2
    },
    description: 'Complete backup before product launch'
  },
  {
    id: 9,
    date: '2024-12-12 07:00:00',
    name: 'Daily Automated Backup',
    version: 'v1.1.6',
    contentTypes: ['Website Pages', 'Blog Posts'],
    status: 'successful',
    fileSize: '2.9 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/vwx234',
    initiatedBy: 'System (Scheduled)',
    duration: '38s',
    type: 'scheduled',
    changes: {
      edited: 4,
      added: 1,
      deleted: 0
    },
    description: 'Daily scheduled backup'
  },
  {
    id: 11,
    date: '2024-12-10 18:20:15',
    name: 'Evening Snapshot',
    version: 'v1.1.4',
    contentTypes: ['Website Pages', 'Landing Pages'],
    status: 'successful',
    fileSize: '3.6 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/bcd890',
    initiatedBy: 'Lisa Wang',
    duration: '48s',
    type: 'manual',
    changes: {
      edited: 6,
      added: 2,
      deleted: 1
    },
    description: 'Evening content snapshot'
  },
  {
    id: 12,
    date: '2024-12-09 10:00:00',
    name: 'Weekly Full System Backup',
    version: 'v1.1.3',
    contentTypes: ['Website Pages', 'Landing Pages', 'Blog Posts', 'HubDB Tables'],
    status: 'successful',
    fileSize: '7.3 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/efg123',
    initiatedBy: 'System (Scheduled)',
    duration: '2m 15s',
    type: 'scheduled',
    changes: {
      edited: 18,
      added: 9,
      deleted: 3
    },
    description: 'Comprehensive weekly backup'
  },
  {
    id: 13,
    date: '2024-12-08 15:30:44',
    name: 'Campaign Assets Backup',
    version: 'v1.1.2',
    contentTypes: ['Landing Pages', 'Blog Posts'],
    status: 'successful',
    fileSize: '2.1 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/hij456',
    initiatedBy: 'Tom Anderson',
    duration: '32s',
    type: 'manual',
    changes: {
      edited: 5,
      added: 3,
      deleted: 0
    },
    description: 'Marketing campaign backup'
  },
  {
    id: 14,
    date: '2024-12-07 08:45:21',
    name: 'Morning Sync Backup',
    version: 'v1.1.1',
    contentTypes: ['Website Pages', 'Authors', 'Tags'],
    status: 'successful',
    fileSize: '3.4 MB',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/klm789',
    initiatedBy: 'Rachel Green',
    duration: '55s',
    type: 'manual',
    changes: {
      edited: 8,
      added: 4,
      deleted: 2
    },
    description: 'Morning content synchronization'
  }
];

export function BackupProvider({ children }: { children: ReactNode }) {
  const [backups, setBackups] = useState<Backup[]>(initialBackups);

  const addBackup = (newBackup: Omit<Backup, 'id'>) => {
    const id = Math.max(...backups.map(b => b.id), 0) + 1;
    const backup: Backup = {
      ...newBackup,
      id
    };
    setBackups(prev => [backup, ...prev]);
  };

  const getBackupById = (id: number) => {
    return backups.find(backup => backup.id === id);
  };

  return (
    <BackupContext.Provider value={{ backups, addBackup, getBackupById }}>
      {children}
    </BackupContext.Provider>
  );
}

export function useBackups() {
  const context = useContext(BackupContext);
  if (context === undefined) {
    throw new Error('useBackups must be used within a BackupProvider');
  }
  return context;
}