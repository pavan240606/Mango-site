import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useNotifications } from './NotificationContext';

export interface FetchingProgress {
  id: string;
  contentType: string;
  fetched: number;
  total: number;
  isComplete: boolean;
  isFetching: boolean;
  startTime: number;
}

interface FetchingStatusContextType {
  fetchingProgresses: FetchingProgress[];
  setFetchingProgresses: (progresses: FetchingProgress[]) => void;
  clearFetchingProgress: (id: string) => void;
  clearAllFetchingProgress: () => void;
  startFetch: (contentType: string) => void;
}

const FetchingStatusContext = createContext<FetchingStatusContextType | undefined>(undefined);

const STORAGE_KEY = 'fetching_progress_data';
const FETCH_DURATION = 15000; // 15 seconds in milliseconds
const TOTAL_RECORDS = 2000;

// Helper function to generate mock pull results
const generateMockPullResults = (contentType: string, totalRecords: number) => {
  const successful: Array<{ id: string; name: string; status: 'success' | 'failure'; timestamp: string }> = [];
  const failed: Array<{ id: string; name: string; status: 'success' | 'failure'; errorMessage?: string; timestamp: string }> = [];
  
  // 95% success rate
  const successCount = Math.floor(totalRecords * 0.95);
  const failCount = totalRecords - successCount;
  
  // Generate successful records
  for (let i = 0; i < successCount; i++) {
    successful.push({
      id: `${contentType.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      name: `${contentType} ${i + 1}`,
      status: 'success',
      timestamp: new Date().toISOString()
    });
  }
  
  // Generate failed records
  const errorMessages = [
    'Connection timeout',
    'Invalid data format',
    'Missing required field',
    'Permission denied',
    'Rate limit exceeded'
  ];
  
  for (let i = 0; i < failCount; i++) {
    failed.push({
      id: `${contentType.toLowerCase().replace(/\s+/g, '-')}-${successCount + i + 1}`,
      name: `${contentType} ${successCount + i + 1}`,
      status: 'failure',
      errorMessage: errorMessages[Math.floor(Math.random() * errorMessages.length)],
      timestamp: new Date().toISOString()
    });
  }
  
  return { successful, failed };
};

export function FetchingStatusProvider({ children }: { children: ReactNode }) {
  const [fetchingProgresses, setFetchingProgressesState] = useState<FetchingProgress[]>([]);
  const intervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const notificationAddedRef = useRef<Set<string>>(new Set());
  
  // Get addNotification from the context (we'll need a wrapper to access it)
  const { addNotification } = useNotifications();

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as FetchingProgress[];
        const validProgresses: FetchingProgress[] = [];

        parsed.forEach((progress) => {
          if (!progress.isComplete) {
            const elapsed = Date.now() - progress.startTime;
            if (elapsed < FETCH_DURATION) {
              // Resume the fetch
              validProgresses.push(progress);
              resumeFetch(progress, elapsed);
            } else {
              // Complete it if time has passed
              const completed = { ...progress, isComplete: true, isFetching: false, fetched: TOTAL_RECORDS };
              validProgresses.push(completed);
              
              // Schedule cleanup
              setTimeout(() => {
                removeProgress(progress.id);
              }, 5000);
            }
          } else {
            validProgresses.push(progress);
            // Schedule cleanup for completed ones
            setTimeout(() => {
              removeProgress(progress.id);
            }, 5000);
          }
        });

        if (validProgresses.length > 0) {
          setFetchingProgressesState(validProgresses);
        }
      } catch (error) {
        console.error('Error loading fetching progress:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save to localStorage whenever progresses change
  useEffect(() => {
    if (fetchingProgresses.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchingProgresses));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [fetchingProgresses]);

  const removeProgress = (id: string) => {
    setFetchingProgressesState((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      return updated;
    });

    // Clear interval if it exists
    const interval = intervalsRef.current.get(id);
    if (interval) {
      clearInterval(interval);
      intervalsRef.current.delete(id);
    }
    
    // Clean up notification tracking
    notificationAddedRef.current.delete(id);
  };

  const resumeFetch = (progress: FetchingProgress, elapsed: number) => {
    const updateInterval = 1000; // Update every second
    const recordsPerSecond = TOTAL_RECORDS / (FETCH_DURATION / 1000);
    
    let currentFetched = progress.fetched;

    const interval = setInterval(() => {
      currentFetched += recordsPerSecond;
      
      if (currentFetched >= TOTAL_RECORDS) {
        currentFetched = TOTAL_RECORDS;
        
        setFetchingProgressesState((prev) =>
          prev.map((p) =>
            p.id === progress.id
              ? { ...p, fetched: currentFetched, isComplete: true, isFetching: false }
              : p
          )
        );
        
        const intervalToClean = intervalsRef.current.get(progress.id);
        if (intervalToClean) {
          clearInterval(intervalToClean);
          intervalsRef.current.delete(progress.id);
        }
        
        // Add notification if not already added
        if (!notificationAddedRef.current.has(progress.id)) {
          const pullResults = generateMockPullResults(progress.contentType, TOTAL_RECORDS);
          addNotification({
            type: pullResults.failed.length > 0 ? 'warning' : 'success',
            title: 'Data Fetch Complete',
            message: `${progress.contentType}: ${pullResults.successful.length.toLocaleString()} successful, ${pullResults.failed.length.toLocaleString()} failed`,
            data: {
              pullResults,
              contentType: progress.contentType,
              totalRecords: TOTAL_RECORDS
            }
          });
          notificationAddedRef.current.add(progress.id);
        }
        
        // Clear after 5 seconds
        setTimeout(() => {
          removeProgress(progress.id);
        }, 5000);
      } else {
        setFetchingProgressesState((prev) =>
          prev.map((p) =>
            p.id === progress.id ? { ...p, fetched: Math.floor(currentFetched) } : p
          )
        );
      }
    }, updateInterval);

    intervalsRef.current.set(progress.id, interval);
  };

  const startFetch = (contentType: string) => {
    const startTime = Date.now();
    const id = `${contentType}-${startTime}`;

    const initialProgress: FetchingProgress = {
      id,
      contentType,
      fetched: 0,
      total: TOTAL_RECORDS,
      isComplete: false,
      isFetching: true,
      startTime
    };

    setFetchingProgressesState((prev) => [...prev, initialProgress]);

    // Start the simulation
    const updateInterval = 1000; // Update every second
    const recordsPerSecond = TOTAL_RECORDS / (FETCH_DURATION / 1000);
    let currentFetched = 0;

    const interval = setInterval(() => {
      currentFetched += recordsPerSecond;
      
      if (currentFetched >= TOTAL_RECORDS) {
        currentFetched = TOTAL_RECORDS;
        
        setFetchingProgressesState((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, fetched: currentFetched, isComplete: true, isFetching: false }
              : p
          )
        );
        
        const intervalToClean = intervalsRef.current.get(id);
        if (intervalToClean) {
          clearInterval(intervalToClean);
          intervalsRef.current.delete(id);
        }
        
        // Add notification if not already added
        if (!notificationAddedRef.current.has(id)) {
          const pullResults = generateMockPullResults(contentType, TOTAL_RECORDS);
          addNotification({
            type: pullResults.failed.length > 0 ? 'warning' : 'success',
            title: 'Data Fetch Complete',
            message: `${contentType}: ${pullResults.successful.length.toLocaleString()} successful, ${pullResults.failed.length.toLocaleString()} failed`,
            data: {
              pullResults,
              contentType,
              totalRecords: TOTAL_RECORDS
            }
          });
          notificationAddedRef.current.add(id);
        }
        
        // Clear after 5 seconds
        setTimeout(() => {
          removeProgress(id);
        }, 5000);
      } else {
        setFetchingProgressesState((prev) =>
          prev.map((p) => (p.id === id ? { ...p, fetched: Math.floor(currentFetched) } : p))
        );
      }
    }, updateInterval);

    intervalsRef.current.set(id, interval);
  };

  const setFetchingProgresses = (progresses: FetchingProgress[]) => {
    setFetchingProgressesState(progresses);
  };

  const clearFetchingProgress = (id: string) => {
    removeProgress(id);
  };

  const clearAllFetchingProgress = () => {
    // Clear all intervals
    intervalsRef.current.forEach((interval) => {
      clearInterval(interval);
    });
    intervalsRef.current.clear();
    
    // Clear all notification tracking
    notificationAddedRef.current.clear();
    
    setFetchingProgressesState([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => {
        clearInterval(interval);
      });
      intervalsRef.current.clear();
    };
  }, []);

  return (
    <FetchingStatusContext.Provider
      value={{
        fetchingProgresses,
        setFetchingProgresses,
        clearFetchingProgress,
        clearAllFetchingProgress,
        startFetch,
      }}
    >
      {children}
    </FetchingStatusContext.Provider>
  );
}

export function useFetchingStatus() {
  const context = useContext(FetchingStatusContext);
  if (context === undefined) {
    throw new Error('useFetchingStatus must be used within a FetchingStatusProvider');
  }
  return context;
}