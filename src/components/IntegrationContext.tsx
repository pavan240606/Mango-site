import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBypass } from './BypassContext';

interface IntegrationContextType {
  hubSpotConnected: boolean;
  setHubSpotConnected: (connected: boolean) => void;
  googleSheetsConnected: boolean;
  setGoogleSheetsConnected: (connected: boolean) => void;
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

export function IntegrationProvider({ children }: { children: ReactNode }) {
  const { isBypassEnabled } = useBypass();
  const [hubSpotConnected, setHubSpotConnected] = useState(false);
  const [googleSheetsConnected, setGoogleSheetsConnected] = useState(false);

  // Automatically connect Google Sheets when bypass is enabled
  useEffect(() => {
    if (isBypassEnabled) {
      setGoogleSheetsConnected(true);
    }
  }, [isBypassEnabled]);

  return (
    <IntegrationContext.Provider
      value={{
        hubSpotConnected,
        setHubSpotConnected,
        googleSheetsConnected,
        setGoogleSheetsConnected,
      }}
    >
      {children}
    </IntegrationContext.Provider>
  );
}

export function useIntegration() {
  const context = useContext(IntegrationContext);
  if (context === undefined) {
    throw new Error('useIntegration must be used within an IntegrationProvider');
  }
  return context;
}