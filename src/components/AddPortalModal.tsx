import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { usePortal } from './PortalContext';

interface AddPortalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPortalModal({ open, onOpenChange }: AddPortalModalProps) {
  const { addPortal } = usePortal();
  const [privateAppToken, setPrivateAppToken] = useState('');
  const [isOAuthSelected, setIsOAuthSelected] = useState(false);

  const handleClose = () => {
    setPrivateAppToken('');
    setIsOAuthSelected(false);
    onOpenChange(false);
  };

  const handleTestAndSave = () => {
    // In a real implementation, this would validate the token or complete OAuth
    const newPortal = {
      id: Date.now().toString(),
      name: 'New HubSpot Portal',
      hubspotId: isOAuthSelected ? '99887766' : '12345678',
    };
    addPortal(newPortal);
    handleClose();
  };

  const handleOAuthClick = () => {
    setIsOAuthSelected(true);
    // In a real implementation, this would redirect to HubSpot OAuth
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[90vw] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Connect Your HubSpot Account</DialogTitle>
        <DialogDescription className="sr-only">
          Connect your HubSpot account using a Private App Token or OAuth
        </DialogDescription>
        
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Connect Your HubSpot Account
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* HubSpot Integration Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">HubSpot Integration</h3>
              </div>
              <p className="text-sm text-gray-600">
                Connect your HubSpot account using a Private App Token or OAuth.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-start mb-8">
              {/* Left Column - Private App Token */}
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-900 mb-3">
                    HubSpot Private App Token (Recommended)
                  </label>
                  <Input
                    value={privateAppToken}
                    onChange={(e) => {
                      setPrivateAppToken(e.target.value);
                      setIsOAuthSelected(false);
                    }}
                    placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center pt-8">
                <div className="text-sm font-medium text-gray-400 px-3">OR</div>
              </div>

              {/* Right Column - OAuth */}
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-gray-900 mb-3">
                    Sign in with HubSpot (OAuth)
                  </label>
                  <Button
                    onClick={handleOAuthClick}
                    variant="outline"
                    className="w-full border-gray-300 hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="#FF7A59">
                      <path d="M12 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                    Continue with HubSpot
                  </Button>
                </div>
              </div>
            </div>

            {/* Test & Save Button */}
            <Button
              onClick={handleTestAndSave}
              disabled={!privateAppToken && !isOAuthSelected}
              className="w-full bg-black hover:bg-gray-800 text-white h-12"
            >
              Test & Save CMS Connection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
