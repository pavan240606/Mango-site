import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UpdateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateAccountModal({ isOpen, onClose }: UpdateAccountModalProps) {
  const [email, setEmail] = useState('pavan@smuves.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLinkEmail = () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    toast.success('Email account linked successfully');
    console.log('Linking email:', email, 'Password:', password);
    onClose();
  };

  const handleCancel = () => {
    setEmail('pavan@smuves.com');
    setPassword('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Update Account</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="mt-2">
            Update your email/password or link a new email account.
            <br />
            Leave fields blank to keep them unchanged.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-black"
            />
            <p className="text-sm text-muted-foreground">
              Enter a new email to link it to your account
            </p>
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleLinkEmail}
            className="bg-black text-white hover:bg-gray-800"
          >
            Link Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}