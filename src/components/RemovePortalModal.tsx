import { X, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Portal } from './PortalContext';

interface RemovePortalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portal: Portal | null;
  onConfirm: () => void;
}

export function RemovePortalModal({ open, onOpenChange, portal, onConfirm }: RemovePortalModalProps) {
  if (!portal) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[90vw] p-0 overflow-hidden">
        <DialogTitle className="sr-only">Remove Portal</DialogTitle>
        <DialogDescription className="sr-only">
          Confirm removal of {portal.name} portal from your account
        </DialogDescription>
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Remove Portal</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2">
                  Are you sure you want to remove this portal?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You are about to remove the following portal from your account:
                </p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Portal Name:</span>
                      <p className="font-medium text-gray-900">{portal.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Portal ID:</span>
                      <p className="font-medium text-gray-900">{portal.hubspotId}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-900">
                    <strong>Warning:</strong> This action cannot be undone. You will need to re-add the portal if you want to access it again.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Remove Portal
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}