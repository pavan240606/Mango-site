import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Shield, 
  Key, 
  Database, 
  RefreshCw, 
  Unlink2, 
  CheckCircle2, 
  AlertCircle,
  X,
  ExternalLink
} from 'lucide-react';

interface ConnectionConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: {
    id: string;
    name: string;
    icon: string;
    connected: boolean;
  } | null;
  onConnect: (platformId: string, apiKey: string) => void;
  onDisconnect: (platformId: string) => void;
}

export function ConnectionConfigModal({ 
  isOpen, 
  onClose, 
  platform, 
  onConnect, 
  onDisconnect 
}: ConnectionConfigModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  if (!platform) return null;

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate API call
    setTimeout(() => {
      onConnect(platform.id, apiKey);
      setIsConnecting(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="modal-override w-[90vw] h-[90vh] max-w-[800px] max-h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 border-b flex-row items-center justify-between space-y-0 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
              {platform.icon}
            </div>
            <div>
              <DialogTitle className="text-xl">{platform.name} Connection</DialogTitle>
              <DialogDescription>
                Configure and manage your {platform.name} credentials.
              </DialogDescription>
            </div>
          </div>
          <Badge variant={platform.connected ? "default" : "outline"} className={platform.connected ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
            {platform.connected ? "Connected" : "Disconnected"}
          </Badge>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-8">
          {platform.connected ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Account ID</Label>
                  <div className="p-3 bg-gray-50 rounded-lg border font-mono text-sm">
                    {platform.id === 'hubspot' ? 'HS-9283-X1' : 'CF-PROD-992'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Environment</Label>
                  <div className="p-3 bg-gray-50 rounded-lg border text-sm">
                    Production
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Last Synced</Label>
                  <div className="p-3 bg-gray-50 rounded-lg border text-sm">
                    January 30, 2026 09:15:22
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">API Version</Label>
                  <div className="p-3 bg-gray-50 rounded-lg border text-sm">
                    v3 (Stable)
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900">Security Warning</p>
                  <p className="text-blue-700">Figma Make is not meant for collecting PII or securing sensitive data. Ensure your API keys have minimal permissions.</p>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t">
                <div>
                  <h4 className="font-semibold text-gray-900">Active Connection</h4>
                  <p className="text-sm text-gray-500">This account is currently being used for data sync.</p>
                </div>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => onDisconnect(platform.id)}
                >
                  <Unlink2 className="h-4 w-4 mr-2" />
                  Disconnect Account
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto space-y-6 py-4">
              <div className="text-center space-y-2">
                <Key className="h-12 w-12 text-teal-500 mx-auto" />
                <h3 className="text-lg font-bold">Connect to {platform.name}</h3>
                <p className="text-sm text-gray-500">Provide your API credentials to allow Smuves to access your content types and records.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key / Access Token</Label>
                  <Input 
                    id="api-key" 
                    type="password" 
                    placeholder="xoxp-xxxx-xxxx-xxxx"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-[10px] text-gray-400">
                    Find this in your {platform.name} developer settings under <strong>Auth & Tokens</strong>.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint">Base URL / Endpoint</Label>
                  <Input 
                    id="endpoint" 
                    placeholder={platform.id === 'hubspot' ? 'https://api.hubapi.com' : 'https://api.contentful.com'} 
                    defaultValue={platform.id === 'hubspot' ? 'https://api.hubapi.com' : ''}
                  />
                </div>

                <Button 
                  className="w-full bg-teal-600 hover:bg-teal-700 h-12" 
                  disabled={!apiKey || isConnecting}
                  onClick={handleConnect}
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Connect Account
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <a href="#" className="text-xs text-teal-600 hover:underline flex items-center justify-center gap-1">
                    Need help finding your keys? <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t bg-gray-50 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
