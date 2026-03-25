import { createContext, useContext, useState, ReactNode } from 'react';

export interface Portal {
  id: string;
  name: string;
  hubspotId: string;
}

interface PortalContextType {
  currentPortal: Portal;
  portals: Portal[];
  setCurrentPortal: (portal: Portal) => void;
  addPortal: (portal: Portal) => void;
  removePortal: (portalId: string) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

// Mock portal data - replace with actual API data
const mockPortals: Portal[] = [
  { id: '1', name: 'Acme Corp', hubspotId: '12345678' },
  { id: '2', name: 'TechStart Inc', hubspotId: '87654321' },
  { id: '3', name: 'Global Dynamics', hubspotId: '45678901' },
  { id: '4', name: 'Innovate Ltd', hubspotId: '23456789' },
];

export function PortalProvider({ children }: { children: ReactNode }) {
  const [portals, setPortals] = useState<Portal[]>(mockPortals);
  const [currentPortal, setCurrentPortal] = useState<Portal>(portals[0]);

  const addPortal = (portal: Portal) => {
    setPortals([...portals, portal]);
  };

  const removePortal = (portalId: string) => {
    const newPortals = portals.filter((portal) => portal.id !== portalId);
    setPortals(newPortals);
    // If the removed portal was the current one, switch to the first available portal
    if (currentPortal.id === portalId && newPortals.length > 0) {
      setCurrentPortal(newPortals[0]);
    }
  };

  return (
    <PortalContext.Provider value={{ currentPortal, portals, setCurrentPortal, addPortal, removePortal }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
}