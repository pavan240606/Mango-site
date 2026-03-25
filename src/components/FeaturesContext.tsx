import { createContext, useContext, useState, ReactNode } from 'react';

export interface Feature {
  name: string;
  isConnected: boolean;
}

interface FeaturesContextType {
  masterFeatures: Feature[];
  addFeature: (featureName: string, isConnected: boolean) => void;
  removeFeature: (featureName: string) => void;
  updateFeature: (oldFeatureName: string, newFeatureName: string, isConnected: boolean) => void;
  toggleFeatureConnection: (featureName: string) => void;
}

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

// Initial master features list - now with connection status
const initialFeatures: Feature[] = [
  { name: 'Advanced Analytics Dashboard', isConnected: true },
  { name: 'Custom Export Templates', isConnected: true },
  { name: 'Bulk Content Operations', isConnected: true },
  { name: 'API Access (Basic)', isConnected: true },
  { name: 'API Access (Premium)', isConnected: true },
  { name: 'Priority Customer Support', isConnected: true },
  { name: '24/7 Phone Support', isConnected: false },
  { name: 'White-label Solutions', isConnected: true },
  { name: 'Advanced Security Features', isConnected: true },
  { name: 'Custom Integrations', isConnected: false },
  { name: 'Automated Workflows', isConnected: true },
  { name: 'Advanced Reporting', isConnected: true },
  { name: 'Team Collaboration Tools', isConnected: true },
  { name: 'Content Versioning', isConnected: true },
  { name: 'Advanced Permissions', isConnected: true },
  { name: 'Custom Branding', isConnected: true },
  { name: 'Multi-language Support', isConnected: false },
  { name: 'Advanced Search & Filter', isConnected: true },
  { name: 'Custom Field Management', isConnected: true },
  { name: 'Data Export Scheduling', isConnected: true },
  { name: 'Advanced Data Validation', isConnected: true },
  { name: 'Custom Notifications', isConnected: true },
  { name: 'Advanced User Management', isConnected: true },
  { name: 'Backup & Recovery', isConnected: true },
  { name: 'Performance Monitoring', isConnected: false },
  { name: 'Custom Dashboard Widgets', isConnected: true },
  { name: 'Advanced Content Templates', isConnected: true },
  { name: 'Bulk Import/Export', isConnected: true },
  { name: 'Advanced Automation Rules', isConnected: false },
  { name: 'Custom Integration APIs', isConnected: true },
  { name: '5 Content Types', isConnected: true },
  { name: '1,000 Exports/month', isConnected: true },
  { name: 'Basic Support', isConnected: true },
  { name: 'All Content Types', isConnected: true },
  { name: '10,000 Exports/month', isConnected: true },
  { name: 'Unlimited Everything', isConnected: true },
  { name: 'SLA', isConnected: false }
];

export function FeaturesProvider({ children }: { children: ReactNode }) {
  const [masterFeatures, setMasterFeatures] = useState<Feature[]>(initialFeatures);

  const addFeature = (featureName: string, isConnected: boolean = false) => {
    if (!masterFeatures.find(f => f.name === featureName)) {
      setMasterFeatures([...masterFeatures, { name: featureName, isConnected }]);
    }
  };

  const removeFeature = (featureName: string) => {
    setMasterFeatures(masterFeatures.filter(f => f.name !== featureName));
  };

  const updateFeature = (oldFeatureName: string, newFeatureName: string, isConnected: boolean) => {
    setMasterFeatures(masterFeatures.map(f => 
      f.name === oldFeatureName 
        ? { name: newFeatureName, isConnected } 
        : f
    ));
  };

  const toggleFeatureConnection = (featureName: string) => {
    setMasterFeatures(masterFeatures.map(f => 
      f.name === featureName 
        ? { ...f, isConnected: !f.isConnected } 
        : f
    ));
  };

  return (
    <FeaturesContext.Provider value={{ 
      masterFeatures, 
      addFeature, 
      removeFeature, 
      updateFeature,
      toggleFeatureConnection 
    }}>
      {children}
    </FeaturesContext.Provider>
  );
}

export function useFeatures() {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeaturesProvider');
  }
  return context;
}
