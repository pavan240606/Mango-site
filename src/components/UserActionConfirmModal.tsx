import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { UserCheck, Ban, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UserActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    status: string;
  };
  action: 'activate' | 'suspend' | 'delete';
  onConfirm: (action: 'activate' | 'suspend' | 'delete', reason?: string) => void;
}

export function UserActionConfirmModal({ isOpen, onClose, user, action, onConfirm }: UserActionConfirmModalProps) {
  const [reason, setReason] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const actionConfig = {
    activate: {
      title: 'Activate User',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: `Are you sure you want to activate ${user.name}?`,
      confirmText: 'This will restore full access to their account and all features.',
      buttonText: 'Activate User',
      buttonVariant: 'default' as const,
      requiresReason: false,
      requiresConfirmation: false
    },
    suspend: {
      title: 'Suspend User',
      icon: Ban,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: `Are you sure you want to suspend ${user.name}?`,
      confirmText: 'This will temporarily disable their account access while preserving their data.',
      buttonText: 'Suspend User',
      buttonVariant: 'destructive' as const,
      requiresReason: true,
      requiresConfirmation: false
    },
    delete: {
      title: 'Delete User',
      icon: Trash2,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: `Are you sure you want to permanently delete ${user.name}?`,
      confirmText: 'This action cannot be undone. All user data, billing history, and account information will be permanently removed.',
      buttonText: 'Delete User',
      buttonVariant: 'destructive' as const,
      requiresReason: true,
      requiresConfirmation: true
    }
  };

  const config = actionConfig[action];
  const IconComponent = config.icon;

  const handleConfirm = async () => {
    // Validation
    if (config.requiresReason && !reason.trim()) {
      toast.error('Reason is required', {
        description: 'Please provide a reason for this action.'
      });
      return;
    }

    if (config.requiresConfirmation && confirmationText !== user.username) {
      toast.error('Confirmation text does not match', {
        description: `Please type "${user.username}" to confirm.`
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onConfirm(action, reason.trim() || undefined);
    setIsLoading(false);

    // Show success message based on action
    const successMessages = {
      activate: {
        title: `User ${user.name} activated`,
        description: 'Account has been successfully activated and user can now access all features.'
      },
      suspend: {
        title: `User ${user.name} unsubscribed`,
        description: 'Account has been unsubscribed and user access has been disabled.'
      },
      delete: {
        title: `User ${user.name} deleted`,
        description: 'User account and all associated data have been permanently removed.'
      }
    };

    toast.success(successMessages[action].title, {
      description: successMessages[action].description
    });
  };

  const isConfirmDisabled = () => {
    if (config.requiresReason && !reason.trim()) return true;
    if (config.requiresConfirmation && confirmationText !== user.username) return true;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${config.color}`}>
            <IconComponent className="h-5 w-5" />
            {config.title}
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Warning Alert */}
          <Alert className={`${config.bgColor} ${config.borderColor}`}>
            <AlertTriangle className={`h-4 w-4 ${config.color}`} />
            <AlertDescription className={config.color}>
              {config.confirmText}
            </AlertDescription>
          </Alert>

          {/* User Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Username:</span>
                <span className="text-sm">{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Current Status:</span>
                <span className="text-sm capitalize">{user.status}</span>
              </div>
            </div>
          </div>

          {/* Reason Input (for suspend and delete) */}
          {config.requiresReason && (
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for {action} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Please provide a reason for ${action}ing this user...`}
                className="min-h-[80px]"
              />
            </div>
          )}

          {/* Confirmation Input (for delete only) */}
          {config.requiresConfirmation && (
            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Type <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{user.username}</code> to confirm <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={user.username}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={isConfirmDisabled() || isLoading}
          >
            {isLoading ? 'Processing...' : config.buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}