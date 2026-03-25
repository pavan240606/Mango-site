import { createContext, useContext, useState, ReactNode } from 'react';

type Approach = 'approach1' | 'approach2';

interface ApproachContextType {
  currentApproach: Approach;
  setCurrentApproach: (approach: Approach) => void;
}

const ApproachContext = createContext<ApproachContextType | undefined>(undefined);

export function ApproachProvider({ children }: { children: ReactNode }) {
  const [currentApproach, setCurrentApproach] = useState<Approach>('approach2');

  return (
    <ApproachContext.Provider value={{ currentApproach, setCurrentApproach }}>
      {children}
    </ApproachContext.Provider>
  );
}

export function useApproach() {
  const context = useContext(ApproachContext);
  if (!context) {
    throw new Error('useApproach must be used within an ApproachProvider');
  }
  return context;
}
