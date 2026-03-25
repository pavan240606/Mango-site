import { createContext, useContext, useState, ReactNode } from 'react';

export interface Package {
  id: number;
  name: string;
  price: string;
  users: number;
  features: string[];
  active: boolean;
  revenue: string;
}

interface PackagesContextType {
  packages: Package[];
  addPackage: (pkg: Omit<Package, 'id' | 'users' | 'active' | 'revenue'>) => void;
  updatePackage: (id: number, updates: Partial<Package>) => void;
  removePackage: (id: number) => void;
  updatePackageFeatures: (packageId: number, features: string[]) => void;
}

const PackagesContext = createContext<PackagesContextType | undefined>(undefined);

const initialPackages: Package[] = [
  {
    id: 1,
    name: 'Basic',
    price: '$29/month',
    users: 15,
    features: ['5 Content Types', '1,000 Exports/month', 'Basic Support'],
    active: true,
    revenue: '$435'
  },
  {
    id: 2,
    name: 'Professional',
    price: '$99/month',
    users: 8,
    features: ['All Content Types', '10,000 Exports/month', 'Priority Customer Support', 'API Access (Basic)'],
    active: true,
    revenue: '$792'
  },
  {
    id: 3,
    name: 'Enterprise',
    price: '$299/month',
    users: 3,
    features: ['Unlimited Everything', 'Custom Integrations', '24/7 Phone Support', 'SLA', 'API Access (Premium)'],
    active: true,
    revenue: '$897'
  }
];

export function PackagesProvider({ children }: { children: ReactNode }) {
  const [packages, setPackages] = useState<Package[]>(initialPackages);

  const addPackage = (pkg: Omit<Package, 'id' | 'users' | 'active' | 'revenue'>) => {
    const newPackage: Package = {
      ...pkg,
      id: Math.max(...packages.map(p => p.id), 0) + 1,
      users: 0,
      active: true,
      revenue: '$0'
    };
    setPackages([...packages, newPackage]);
  };

  const updatePackage = (id: number, updates: Partial<Package>) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, ...updates } : pkg
    ));
  };

  const removePackage = (id: number) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const updatePackageFeatures = (packageId: number, features: string[]) => {
    setPackages(prevPackages => prevPackages.map(pkg =>
      pkg.id === packageId ? { ...pkg, features } : pkg
    ));
  };

  return (
    <PackagesContext.Provider value={{ 
      packages, 
      addPackage, 
      updatePackage, 
      removePackage,
      updatePackageFeatures
    }}>
      {children}
    </PackagesContext.Provider>
  );
}

export function usePackages() {
  const context = useContext(PackagesContext);
  if (context === undefined) {
    throw new Error('usePackages must be used within a PackagesProvider');
  }
  return context;
}