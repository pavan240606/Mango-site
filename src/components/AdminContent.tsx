import { Users, AlertTriangle, Clock } from 'lucide-react';
import { UserManagementTab } from './UserManagementTab';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatGlobalDateTime } from '../utils/dateFormat';
import { AccessStatusDemoControl } from './AccessStatusDemoControl';

// Mock data for system stats

const mockSystemStats = {
  totalUsers: 11, // Updated to match our comprehensive user list
  activeUsers: 8,  // 8 active users in our list
  pendingUsers: 0, // No pending users in our current list
  suspendedUsers: 1, // 1 unsubscribed user
  overdue: 2, // 2 overdue users
  totalRevenue: '$2,124',
  monthlyGrowth: '+12%',
  systemUptime: '99.9%',
  apiCalls: '45,234'
};

export function AdminContent({ onShowLogs }: { onShowLogs: () => void }) {

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Last updated: {formatGlobalDateTime(new Date())}
          </div>
        </div>

        {/* Demo Control Panel - Remove this in production */}
        <AccessStatusDemoControl />

        {/* Stats Overview */}
        

        {/* User Management Content */}
        <UserManagementTab />
      </div>
    </div>
  );
}