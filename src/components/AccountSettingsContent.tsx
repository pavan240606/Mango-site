import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Settings, FileSpreadsheet, Trash2, Globe, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { useIntegration } from './IntegrationContext';
import { ColumnSettingsTab } from './ColumnSettingsTab';

export function AccountSettingsContent() {
  const { googleSheetsConnected, setGoogleSheetsConnected } = useIntegration();
  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState(false);
  const [activeSection, setActiveSection] = useState<'columns' | 'connectors'>('columns');

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header with badge */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-gray-700" />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">Account Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Settings that apply to you across all portals</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Account-wide</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex gap-1 px-6 pt-4">
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              activeSection === 'columns'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveSection('columns')}
          >
            <Settings className="h-4 w-4" />
            Column Preferences
          </Button>
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              activeSection === 'connectors'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveSection('connectors')}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Account Connectors
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {activeSection === 'columns' && (
          <div className="px-[1px] py-6">
            <div className="mb-6 px-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-md border border-blue-200">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Your Column Preferences</p>
                  <p className="text-sm text-blue-800">
                    These column settings apply to all your portals. Customize which columns you see when viewing content across all HubSpot portals.
                  </p>
                </div>
              </div>
            </div>
            <ColumnSettingsTab />
          </div>
        )}

        {activeSection === 'connectors' && (
          <div className="px-6 py-6 space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-md border border-blue-200">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-blue-900 mb-1">Account-Level Connectors</p>
                <p className="text-sm text-blue-800">
                  These connectors work across all your HubSpot portals. Connect once and use everywhere.
                </p>
              </div>
            </div>

            {/* Google Sheets Connector Card */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <FileSpreadsheet className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">Google Sheets</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {googleSheetsConnected ? 'Connected • pavan@smuves.com' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded text-xs font-medium text-blue-900">
                    <Globe className="h-3 w-3" />
                    Account-wide
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Connect Google Sheets to import and export content across all your HubSpot portals. Your connection works everywhere.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!googleSheetsConnected ? (
                    <Button
                      onClick={() => setShowGoogleSheetsModal(true)}
                      className="bg-green-600 text-white hover:bg-green-700"
                      data-coach-google-sheets
                    >
                      Connect Google Sheets
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="border-gray-300"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Import from Google Sheets
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export to Google Sheets
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setGoogleSheetsConnected(false);
                          toast.success('Google Sheets disconnected successfully!');
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Disconnect
                      </Button>
                    </>
                  )}
                </div>

                {/* Info Banner */}
                {googleSheetsConnected && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-md border border-green-200">
                    <Info className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-green-900">
                        <strong>Connected and ready!</strong> You can now import from and export to Google Sheets from any portal. Your Google Sheets connector is available everywhere.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Google Sheets Connection Modal */}
      <Dialog open={showGoogleSheetsModal} onOpenChange={setShowGoogleSheetsModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">Connect Google Sheets</DialogTitle>
            <DialogDescription className="text-gray-600">
              Connect your Google account to import and export content across all portals
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-md border border-blue-200">
              <Globe className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-blue-900 mb-1">One Connection, All Portals</p>
                <p className="text-sm text-blue-800">
                  This is an account-level connector. Once connected, you can use Google Sheets across all your HubSpot portals without reconnecting.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">What you can do:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Import content from Google Sheets to any HubSpot portal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Export content from any portal to Google Sheets for bulk editing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Sync changes back to HubSpot after editing in Google Sheets</span>
                </li>
              </ul>
            </div>

            <Button
              className="w-full h-12 bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
              onClick={() => {
                toast.info('Redirecting to Google for authorization...');
                setTimeout(() => {
                  toast.success('Google Sheets connected successfully!');
                  setShowGoogleSheetsModal(false);
                  setGoogleSheetsConnected(true);
                }, 1500);
              }}
            >
              <FileSpreadsheet className="h-5 w-5" />
              Authorize Google Sheets Access
            </Button>
            <p className="text-xs text-gray-500 text-center">
              You'll be redirected to Google to authorize access to your Google Sheets
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
