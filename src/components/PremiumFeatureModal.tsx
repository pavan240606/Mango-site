import { Crown, Lock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface PremiumFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBypassDemo: () => void;
  featureName: string;
}

export function PremiumFeatureModal({
  isOpen,
  onClose,
  onBypassDemo,
  featureName
}: PremiumFeatureModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Premium Feature
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            <strong>{featureName}</strong> is a premium feature available to Pro users.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                <Sparkles className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Advanced Capabilities</h4>
                <p className="text-sm text-gray-600">
                  Access powerful bulk editing and find & replace tools to manage your content efficiently.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                <Lock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Exclusive Access</h4>
                <p className="text-sm text-gray-600">
                  Upgrade to Pro to unlock this feature and boost your productivity.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={onBypassDemo}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            <Crown className="h-4 w-4 mr-2" />
            Bypass Demo Mode
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
