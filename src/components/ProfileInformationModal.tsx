import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useUser } from './UserContext';

interface ProfileInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowSignInMethods: () => void;
}

export function ProfileInformationModal({ isOpen, onClose, onShowSignInMethods }: ProfileInformationModalProps) {
  const { userProfile, updateUserProfile, getUserInitials } = useUser();

  const handleInputChange = (field: string, value: string) => {
    updateUserProfile({ [field]: value });
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
    console.log('Profile saved:', userProfile);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="modal-scrollable px-6">
          <div className="py-6">
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={userProfile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="bg-input-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={userProfile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="bg-input-background border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={userProfile.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="bg-input-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Domain</Label>
                  <Input
                    value={userProfile.companyDomain}
                    onChange={(e) => handleInputChange('companyDomain', e.target.value)}
                    className="bg-input-background border-border"
                  />
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Save Profile
                </Button>
              </div>

              <div className="ml-8">
                <div 
                  className="w-20 h-20 bg-black rounded-full cursor-pointer flex items-center justify-center" 
                  onClick={onShowSignInMethods}
                >
                  <span className="text-white text-2xl font-medium">
                    {getUserInitials()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}