import { useState } from 'react';
import { Clock, FileCode, Box, Database, Globe, RefreshCw, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { formatGlobalDateTime } from '../utils/dateFormat';
import { toast } from 'sonner@2.0.3';

interface AuditStats {
  modules: number;
  templates: number;
  properties: number;
  languages: number;
  hubdbConnectedModules: number;
  lastCrawled: string | null;
}

interface HubSpotAuditOverviewProps {
  onRunNewCrawl?: () => void;
}

export function HubSpotAuditOverview({ onRunNewCrawl }: HubSpotAuditOverviewProps) {
  const [stats, setStats] = useState<AuditStats>({
    modules: 128,
    templates: 24,
    properties: 4298,
    languages: 0,
    hubdbConnectedModules: 4,
    lastCrawled: 'February 27, 2026 06:32:00'
  });

  const handleRunCrawl = () => {
    if (onRunNewCrawl) {
      onRunNewCrawl();
    }
  };

  const handleExportAllCSV = () => {
    toast.success('All data exported successfully', {
      description: 'Complete audit data has been downloaded.'
    });
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
          
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">HubSpot Scan</h1>
              <p className="text-sm text-gray-600">Scan your HubSpot portal before migration. Analyze modules, templates, properties, and languages.</p>
            </div>
            {stats.lastCrawled && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Last crawled: {stats.lastCrawled}</span>
              </div>
            )}
          </div>

          {/* Main Content Card */}
          <Card className="p-6 bg-white border-gray-200">
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <Button 
                  onClick={handleExportAllCSV}
                  variant="outline"
                  className="h-10 px-4 rounded-lg font-medium gap-2 border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <Download className="h-4 w-4" />
                  Export All CSV
                </Button>
                <Button 
                  onClick={handleRunCrawl}
                  className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-4 rounded-lg font-medium gap-2 shadow-sm transition-all active:scale-95"
                >
                  <RefreshCw className="h-4 w-4" />
                  Run New Scan
                </Button>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Modules Card */}
                <Card className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-teal-100">
                      <Box className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Modules</div>
                      <div className="text-3xl font-bold text-gray-900">{stats.modules}</div>
                    </div>
                  </div>
                </Card>

                {/* Templates Card */}
                <Card className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <FileCode className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Templates</div>
                      <div className="text-3xl font-bold text-gray-900">{stats.templates}</div>
                    </div>
                  </div>
                </Card>

                {/* Properties Card */}
                <Card className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-100">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Properties</div>
                      <div className="text-3xl font-bold text-gray-900">{stats.properties.toLocaleString()}</div>
                    </div>
                  </div>
                </Card>

                {/* Languages Card */}
                <Card className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-orange-100">
                      <Globe className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Languages</div>
                      <div className="text-3xl font-bold text-gray-900">{stats.languages}</div>
                    </div>
                  </div>
                </Card>

                {/* HubDB Connected Card */}
                <Card className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-teal-100">
                      <Database className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">HubDB Connected</div>
                      <div className="text-3xl font-bold text-gray-900">{stats.hubdbConnectedModules}</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}