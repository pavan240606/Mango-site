import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Zap } from 'lucide-react';

interface GoogleSheetsConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleSheetsConnectionModal({ isOpen, onClose }: GoogleSheetsConnectionModalProps) {
  const handleDisconnect = () => {
    // Disconnect logic would go here
    console.log('Disconnecting Google Sheets...');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[800px] max-w-[800px] p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">Manage Google Sheets Connection</DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Zap className="h-5 w-5 text-gray-700" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Sheets Connected</h3>
              <p className="text-gray-600 text-sm mb-4">
                Export your HubSpot content to Google Sheets for bulk editing and much more
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-gray-900 font-medium text-sm">Google Sheets Connected</span>
                  <Badge variant="secondary" className="bg-black text-white px-2 py-1 rounded text-xs">
                    OAuth
                  </Badge>
                </div>
                
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}