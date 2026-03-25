import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { AdminPanelContent } from './components/AdminPanelContent';
import { ExportsContent } from './components/ExportsContent';
import { ImportsContent } from './components/ImportsContent';
import { RestoreContent } from './components/RestoreContent';
import { ProfileContent } from './components/ProfileContent';
import { LogsPage } from './components/LogsPage';
import { ReportsContent } from './components/ReportsContent';
import { DashboardContent } from './components/DashboardContent';
import { MigrationOverview } from './components/MigrationOverview';
import { MigrationHistory } from './components/MigrationHistory';
import { MigrationStartPage } from './components/MigrationStartPage';
import { OnboardingModal } from './components/OnboardingModal';
import { HubSpotAuditContent } from './components/HubSpotAuditContent';
import { HubSpotAuditOverview } from './components/HubSpotAuditOverview';
import { AuditSetup } from './components/AuditSetup';
import { LogsProvider } from './components/LogsContext';
import { BackupProvider } from './components/BackupContext';
import { UserProvider, useUser } from './components/UserContext';
import { ColumnPreferencesProvider } from './components/ColumnPreferencesContext';
import { NotificationProvider, Notification } from './components/NotificationContext';
import { FetchingStatusProvider } from './components/FetchingStatusContext';
import { PortalProvider } from './components/PortalContext';
import { FeaturesProvider } from './components/FeaturesContext';
import { PackagesProvider } from './components/PackagesContext';
import { SavedFiltersProvider } from './components/SavedFiltersContext';
import { IntegrationProvider } from './components/IntegrationContext';
import { BypassProvider } from './components/BypassContext';
import { DataPullResultsModal } from './components/DataPullResultsModal';
import { PendingAccessScreen } from './components/PendingAccessScreen';
import { SuspendedUserScreen } from './components/SuspendedUserScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GlobalFetchingIndicator } from './components/GlobalFetchingIndicator';

type AppState = 'adminPanel' | 'dashboard' | 'exports' | 'imports' | 'backupRestore' | 'logs' | 'profile' | 'reports' | 'migrationOverview' | 'migrationHistory' | 'migrationStart' | 'hubSpotAudit' | 'hubSpotAuditSetup' | 'hubSpotAuditReports';

function AppContent() {
  const { accessStatus, setAccessStatus } = useUser();
  const [activePage, setActivePage] = useState<AppState>('dashboard');
  const [profileDefaultTab, setProfileDefaultTab] = useState<'profile' | 'columns' | 'connection'>('profile');
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [currentNotificationData, setCurrentNotificationData] = useState<Notification | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState<'hubspot' | 'password' | 'sheets' | null>(null);
  const [authMethod, setAuthMethod] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.data?.pullResults) {
      setCurrentNotificationData(notification);
      setShowResultsModal(true);
    }
  };

  const handleAuthComplete = (method: string) => {
    setAuthMethod(method);
    setShowOnboardingModal(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboardingModal(false);
    setCurrentOnboardingStep(null);
  };

  // Show access control screens based on user status
  if (accessStatus === 'pending') {
    return <PendingAccessScreen onAuthenticate={() => setAccessStatus('active')} />;
  }

  if (accessStatus === 'suspended') {
    return <SuspendedUserScreen onAuthenticate={() => setAccessStatus('active')} />;
  }

  // User has active access - show normal dashboard
  return (
    <div className="h-screen flex flex-col bg-white">
      <Header 
        onShowProfile={() => {
          setProfileDefaultTab('profile');
          setActivePage('profile');
        }} 
        onNotificationClick={handleNotificationClick}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          onShowLogs={() => setActivePage('logs')} 
          onShowExports={() => setActivePage('exports')}
          onShowImports={() => setActivePage('imports')}
          onShowBackupRestore={() => setActivePage('backupRestore')}
          onShowAdminPanel={() => setActivePage('adminPanel')}
          onShowReports={() => setActivePage('reports')}
          onShowDashboard={() => setActivePage('dashboard')}
          onShowMigrationOverview={() => setActivePage('migrationOverview')}
          onShowMigrationHistory={() => setActivePage('migrationHistory')}
          onShowMigrationStart={() => setActivePage('migrationStart')}
          onShowHubSpotAudit={() => setActivePage('hubSpotAudit')}
          onShowHubSpotAuditSetup={() => setActivePage('hubSpotAuditSetup')}
          onShowHubSpotAuditReports={() => setActivePage('hubSpotAuditReports')}
          activePage={activePage} 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {activePage === 'logs' ? (
            <LogsPage onClose={() => setActivePage('adminPanel')} />
          ) : activePage === 'migrationOverview' ? (
            <MigrationOverview onStartNewMigration={() => setActivePage('migrationStart')} />
          ) : activePage === 'migrationHistory' ? (
            <MigrationHistory />
          ) : activePage === 'migrationStart' ? (
            <MigrationStartPage />
          ) : activePage === 'imports' ? (
            <ImportsContent onShowLogs={() => setActivePage('logs')} />
          ) : activePage === 'backupRestore' ? (
            <RestoreContent onShowLogs={() => setActivePage('logs')} />
          ) : activePage === 'exports' ? (
            <ExportsContent 
              onShowLogs={() => setActivePage('logs')} 
              onShowProfile={(defaultTab = 'profile') => {
                setProfileDefaultTab(defaultTab);
                setActivePage('profile');
              }}
            />
          ) : activePage === 'adminPanel' ? (
            <AdminPanelContent onShowLogs={() => setActivePage('logs')} />
          ) : activePage === 'profile' ? (
            <ProfileContent defaultTab={profileDefaultTab} />
          ) : activePage === 'reports' ? (
            <ReportsContent />
          ) : activePage === 'dashboard' ? (
            <DashboardContent 
              onShowProfile={(defaultTab = 'profile') => {
                setProfileDefaultTab(defaultTab === 'connection' ? 'connection' : 'profile');
                setActivePage('profile');
              }}
            />
          ) : activePage === 'hubSpotAudit' ? (
            <HubSpotAuditOverview onRunNewCrawl={() => setActivePage('hubSpotAuditSetup')} />
          ) : activePage === 'hubSpotAuditSetup' ? (
            <AuditSetup onFinish={() => setActivePage('hubSpotAuditReports')} />
          ) : activePage === 'hubSpotAuditReports' ? (
            <HubSpotAuditContent initialTab="templates" />
          ) : (
            <div className="flex-1 bg-gray-50" />
          )}
        </div>
      </div>
      <Toaster />

      {/* Global Fetching Status Indicator - Visible on All Pages */}
      <GlobalFetchingIndicator />

      {/* Data Pull Results Modal */}
      {currentNotificationData?.data?.pullResults && (
        <DataPullResultsModal
          isOpen={showResultsModal}
          onClose={() => {
            setShowResultsModal(false);
            setCurrentNotificationData(null);
          }}
          results={currentNotificationData.data.pullResults}
          totalRecords={currentNotificationData.data.totalRecords || 0}
          contentType={currentNotificationData.data.contentType || 'Content'}
        />
      )}

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <OnboardingModal
          isOpen={showOnboardingModal}
          onClose={handleOnboardingComplete}
          authMethod={authMethod}
          initialStep={currentOnboardingStep}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <UserProvider>
        <ColumnPreferencesProvider>
          <NotificationProvider>
            <FetchingStatusProvider>
              <LogsProvider>
                <BackupProvider>
                  <FeaturesProvider>
                    <PackagesProvider>
                      <SavedFiltersProvider>
                        <BypassProvider>
                          <IntegrationProvider>
                            <AppContent />
                          </IntegrationProvider>
                        </BypassProvider>
                      </SavedFiltersProvider>
                    </PackagesProvider>
                  </FeaturesProvider>
                </BackupProvider>
              </LogsProvider>
            </FetchingStatusProvider>
          </NotificationProvider>
        </ColumnPreferencesProvider>
      </UserProvider>
    </PortalProvider>
  );
}