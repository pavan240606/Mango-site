import { useState } from 'react';
import { Users, Package, List } from 'lucide-react';
import { Button } from './ui/button';
import { AdminContent } from './AdminContent';
import { PackageControlContent } from './PackageControlContent';
import { MasterFeatureListContent } from './MasterFeatureListContent';

export function AdminPanelContent({ onShowLogs }: { onShowLogs: () => void }) {
  const [activeTab, setActiveTab] = useState<'userManagement' | 'packageControl' | 'masterFeatures'>('userManagement');

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Sub-navigation tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex gap-1 px-6 pt-4">
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              activeTab === 'userManagement'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('userManagement')}
          >
            <Users className="h-4 w-4" />
            User Management
          </Button>
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              activeTab === 'packageControl'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('packageControl')}
          >
            <Package className="h-4 w-4" />
            Package Control
          </Button>
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              activeTab === 'masterFeatures'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('Master Feature list')}
          >
            <List className="h-4 w-4" />
            Master Feature List
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'userManagement' ? (
          <AdminContent onShowLogs={onShowLogs} />
        ) : activeTab === 'packageControl' ? (
          <PackageControlContent onShowLogs={onShowLogs} />
        ) : (
          <MasterFeatureListContent />
        )}
      </div>
    </div>
  );
}