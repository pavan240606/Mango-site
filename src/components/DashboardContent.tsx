import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RefreshCw, Link2, AlertCircle, Info } from 'lucide-react';
import { useIntegration } from './IntegrationContext';
import { useBypass } from './BypassContext';

interface ContentCount {
  contentType: string;
  published: number | null;
  draft: number | null;
  total: number;
  isLink?: boolean;
}

const contentCountsData: ContentCount[] = [
  { contentType: 'Authors', published: null, draft: null, total: 1, isLink: true },
  { contentType: 'Blog Posts', published: 6, draft: 2, total: 8, isLink: true },
  { contentType: 'Blogs', published: null, draft: null, total: 2, isLink: true },
  { contentType: 'HubDB Tables', published: null, draft: null, total: 0, isLink: true },
];

export function DashboardContent({ onShowProfile }: { onShowProfile?: (defaultTab: 'profile' | 'connection') => void }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { hubSpotConnected, setHubSpotConnected, googleSheetsConnected } = useIntegration();
  const { isBypassEnabled } = useBypass();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const formatTimestamp = () => {
    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex-1 bg-gray-50 px-8 py-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Not Connected Banner */}
      {!hubSpotConnected && !isBypassEnabled && (
        <Card className="bg-white shadow-sm border border-orange-200 mb-4">
          <div className="p-6 flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-orange-500 mt-1 shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">HubSpot Not Connected</h3>
              <p className="text-gray-600 mb-4">
                You need to connect your HubSpot account to view your content dashboard and start managing your content.
              </p>
              <Button
                onClick={() => onShowProfile?.('connection')}
                className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
              >
                <Link2 className="h-4 w-4" />
                Manage Integration
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Google Sheets Not Connected Info Banner - Only show when HubSpot is connected */}
      {(hubSpotConnected || isBypassEnabled) && !googleSheetsConnected && (
        <Card className="bg-white shadow-sm border border-blue-200 mb-4">
          <div className="p-6 flex items-start gap-4">
            <Info className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Sheets Not Connected</h3>
              <p className="text-gray-600 mb-4">
                Connect Google Sheets to enable bulk editing of your HubSpot content and unlock additional features.
              </p>
              <Button
                onClick={() => onShowProfile?.('connection')}
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
              >
                <Link2 className="h-4 w-4" />
                Connect Google Sheets
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Last Updated */}
      {(hubSpotConnected || isBypassEnabled) && (
        <div className="flex justify-end mb-4">
          <p className="text-gray-500 text-sm">Last Updated: {formatTimestamp()}</p>
        </div>
      )}

      {/* Content Counts Section - Only show when connected */}
      {(hubSpotConnected || isBypassEnabled) && (
        <Card className="bg-white shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Content Counts</h2>
                <p className="text-gray-600 text-sm">An overview of your non-archived content assets.</p>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>

            {/* Content Counts Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Content Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Published</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Draft</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {contentCountsData.map((row, index) => (
                    <tr 
                      key={row.contentType} 
                      className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="py-3 px-4">
                        {row.isLink ? (
                          <a href="#" className="text-blue-600 hover:underline text-sm">
                            {row.contentType}
                          </a>
                        ) : (
                          <span className="text-gray-900 text-sm">{row.contentType}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900 text-sm">
                        {row.published !== null ? row.published : '—'}
                      </td>
                      <td className="py-3 px-4 text-gray-900 text-sm">
                        {row.draft !== null ? row.draft : '—'}
                      </td>
                      <td className="py-3 px-4 text-gray-900 text-sm">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
