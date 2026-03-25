import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BypassContextType {
  isBypassEnabled: boolean;
  setBypassEnabled: (enabled: boolean) => void;
}

const BypassContext = createContext<BypassContextType | undefined>(undefined);

export function BypassProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage, default to true if not set
  const [isBypassEnabled, setIsBypassEnabled] = useState(() => {
    const stored = localStorage.getItem('smuves_bypass_mode');
    // If never set before, default to true (ON by default)
    if (stored === null) {
      localStorage.setItem('smuves_bypass_mode', 'true');
      return true;
    }
    return stored === 'true';
  });

  const setBypassEnabled = (enabled: boolean) => {
    setIsBypassEnabled(enabled);
    // Store in localStorage for persistence
    if (enabled) {
      localStorage.setItem('smuves_bypass_mode', 'true');
    } else {
      localStorage.removeItem('smuves_bypass_mode');
    }
  };

  return (
    <BypassContext.Provider value={{ isBypassEnabled, setBypassEnabled }}>
      {children}
    </BypassContext.Provider>
  );
}

export function useBypass() {
  const context = useContext(BypassContext);
  if (context === undefined) {
    throw new Error('useBypass must be used within a BypassProvider');
  }
  return context;
}