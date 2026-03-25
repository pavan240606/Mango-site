import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building2, Link2, Trash2, Info, AlertTriangle, Zap, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { useIntegration } from './IntegrationContext';

export function PortalSettingsContent() {
  const { hubSpotConnected, setHubSpotConnected } = useIntegration();
  const [showHubSpotModal, setShowHubSpotModal] = useState(false);
  const [hubSpotToken, setHubSpotToken] = useState('');

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header with badge */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-gray-700" />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">Portal Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Settings specific to this HubSpot portal</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-md">
            <Building2 className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Portal-specific</span>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-md border border-purple-200">
          <Info className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-purple-900 mb-1">Portal-Specific Settings</p>
            <p className="text-sm text-purple-800">
              These settings apply only to the currently selected HubSpot portal. Each portal has its own independent configuration.
            </p>
          </div>
        </div>

        {/* HubSpot Connection Card */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="#ff7a59">
                    <path d="M18.5 2h-13C4.7 2 4 2.7 4 3.5v17c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-17c0-.8-.7-1.5-1.5-1.5zm-7 17c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm5.5-4h-11V4h11v11z"/>
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">HubSpot Portal Connection</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {hubSpotConnected ? 'Connected • Production Portal' : 'Not connected'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded text-xs font-medium text-purple-900">
                <Building2 className="h-3 w-3" />
                This portal only
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              {hubSpotConnected 
                ? 'Your HubSpot portal is connected and ready to use. You can import and export content, manage pages, and more.'
                : 'Connect this HubSpot portal to start managing your content. Each portal requires its own connection.'}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!hubSpotConnected ? (
                <Button
                  onClick={() => setShowHubSpotModal(true)}
                  className="bg-orange-600 text-white hover:bg-orange-700"
                  data-coach-hubspot
                >
                  <Link2 className="h-4 w-4 mr-2" />
                  Connect HubSpot Portal
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-gray-300"
                    onClick={() => setShowHubSpotModal(true)}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Reconnect Portal
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm('Are you sure you want to disconnect this portal? All portal data will be removed.')) {
                        setHubSpotConnected(false);
                        toast.success('HubSpot portal disconnected successfully!');
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Disconnect Portal
                  </Button>
                </>
              )}
            </div>

            {/* Warning Banner */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-md border border-amber-300">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-2">Important Information</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Multiple Portals</p>
                        <p className="text-gray-700 mt-1">
                          You can connect multiple HubSpot portals. Each portal operates independently with its own content and settings.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-red-900">Portal Removal Warning</p>
                        <p className="text-gray-800 mt-1">
                          <strong>Disconnecting a portal permanently deletes all associated data</strong> including content, exports, and logs. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portal Information Card */}
        {hubSpotConnected && (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-gray-900">Portal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Portal ID</p>
                  <p className="font-medium text-gray-900">12345678</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Portal Type</p>
                  <p className="font-medium text-gray-900">Production</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Connected Since</p>
                  <p className="font-medium text-gray-900">January 15, 2026</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* HubSpot Connection Modal */}
      <Dialog open={showHubSpotModal} onOpenChange={setShowHubSpotModal}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-gray-900">Connect HubSpot Portal</DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                Connect using a Private App Token or OAuth
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHubSpotModal(false)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-md border border-purple-200">
              <Building2 className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-purple-900 mb-1">Portal-Specific Connection</p>
                <p className="text-sm text-purple-800">
                  This connection is specific to one HubSpot portal. You can connect multiple portals by repeating this process for each one.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-start">
              {/* Private App Token Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Private App Token (Recommended)</h4>
                <Input
                  placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={hubSpotToken}
                  onChange={(e) => setHubSpotToken(e.target.value)}
                  className="bg-white border-2 border-gray-300 h-12"
                />
                <p className="text-sm text-gray-600">
                  Create a private app in your HubSpot portal settings and paste the token here.
                </p>
              </div>

              {/* OR Divider */}
              <div className="flex items-center justify-center pt-12">
                <span className="text-gray-500 font-medium text-lg">OR</span>
              </div>

              {/* OAuth Section */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">OAuth Connection</h4>
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2"
                  onClick={() => {
                    toast.info('Redirecting to HubSpot OAuth...');
                  }}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.5 2h-13C4.7 2 4 2.7 4 3.5v17c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-17c0-.8-.7-1.5-1.5-1.5zm-7 17c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm5.5-4h-11V4h11v11z"/>
                  </svg>
                  Connect with HubSpot OAuth
                </Button>
                <p className="text-sm text-gray-600">
                  Securely connect using your HubSpot account credentials.
                </p>
              </div>
            </div>

            {/* Test & Save Button */}
            <Button
              className="w-full h-12 bg-orange-600 text-white hover:bg-orange-700"
              onClick={() => {
                toast.success('Testing portal connection...');
                setTimeout(() => {
                  toast.success('HubSpot portal connected successfully!');
                  setShowHubSpotModal(false);
                  setHubSpotConnected(true);
                  setHubSpotToken('');
                }, 1500);
              }}
              disabled={!hubSpotToken}
            >
              Test & Save Portal Connection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
