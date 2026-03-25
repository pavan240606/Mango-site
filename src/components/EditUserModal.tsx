import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { Badge } from './ui/badge';
import { User, Mail, Building, MapPin, Globe, Bell, Shield, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    username: string;
    email: string;
    avatar: string;
    status: string;
    package: string;
    name: string;
    joinedDate: Date;
    lastPaidOn: Date;
  };
  onSave: (updatedUser: any) => void;
}

export function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ')[1] || '',
    email: user.email,
    company: 'Acme Corporation',
    companyDomain: 'acmecorp.com',
    package: user.package,
    status: user.status,
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      package: formData.package,
      status: formData.status
    };

    onSave(updatedUser);
    toast.success('User information updated successfully', {
      description: `${formData.firstName} ${formData.lastName}'s profile has been updated.`
    });
  };

  const handleAvatarUpload = () => {
    toast.info('Avatar upload functionality', {
      description: 'This would open a file picker to upload a new avatar.'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit User: {user.name}
          </DialogTitle>
          <DialogDescription>
            Update user information, account settings, and administrative details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="modal-scrollable px-6">
          <div className="space-y-6 py-4">
            {/* User Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* User Initials */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{formData.firstName} {formData.lastName}</h3>
                    <p className="text-sm text-muted-foreground">User Profile</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyDomain">Company Domain</Label>
                    <Input
                      id="companyDomain"
                      value={formData.companyDomain || 'acmecorp.com'}
                      onChange={(e) => handleInputChange('companyDomain', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}