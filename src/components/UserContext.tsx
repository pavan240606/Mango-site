import { createContext, useContext, useState, ReactNode } from 'react';

type UserAccessStatus = 'active' | 'pending' | 'suspended';

interface UserProfile {
  firstName: string;
  lastName: string;
  companyName: string;
  companyDomain: string;
}

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  getUserInitials: () => string;
  accessStatus: UserAccessStatus;
  setAccessStatus: (status: UserAccessStatus) => void;
  hasPassword: boolean;
  setHasPassword: (hasPassword: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    firstName: 'Pavan',
    lastName: 'Test',
    companyName: 'Acme Corporation',
    companyDomain: 'acmecorp.com'
  });
  
  // For demo purposes: 'active' | 'pending' | 'suspended'
  // Change this to test different access screens
  const [accessStatus, setAccessStatus] = useState<UserAccessStatus>('active');
  
  // Track if user has set a password for coach mark completion
  const [hasPassword, setHasPassword] = useState(false);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...profile
    }));
  };

  const getUserInitials = () => {
    const firstInitial = userProfile.firstName.charAt(0).toUpperCase();
    const lastInitial = userProfile.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const value = {
    userProfile,
    updateUserProfile,
    getUserInitials,
    accessStatus,
    setAccessStatus,
    hasPassword,
    setHasPassword
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}