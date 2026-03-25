import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    username: string;
    email: string;
    package: string;
    name: string;
  };
  onSave: (updatedUser: any) => void;
}

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99/month',
    features: ['5 Projects', '10GB Storage', 'Email Support', 'Basic Analytics']
  },
  {
    id: 'professional',
    name: 'Professional', 
    price: '$19.99/month',
    features: ['25 Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics', 'Team Collaboration']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49.99/month',
    features: ['Unlimited Projects', '1TB Storage', '24/7 Support', 'Custom Analytics', 'Full Team Management', 'API Access']
  }
];

export function ChangePlanModal({ isOpen, onClose, user, onSave }: ChangePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(user.package.toLowerCase());

  const handleSave = () => {
    const newPlan = plans.find(plan => plan.id === selectedPlan);
    if (!newPlan) return;

    // Update the user with the new plan
    const updatedUser = {
      ...user,
      package: newPlan.name
    };

    onSave(updatedUser);
    toast.success(`Plan changed successfully! ${user.name} is now on the ${newPlan.name} plan.`);
    onClose();
  };

  const currentPlan = plans.find(plan => plan.id === user.package.toLowerCase());
  const newPlan = plans.find(plan => plan.id === selectedPlan);
  const hasChanges = selectedPlan !== user.package.toLowerCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Change Plan for {user.name}
          </DialogTitle>
          <DialogDescription>
            Select a new subscription plan for {user.username}. Changes will take effect immediately.
          </DialogDescription>
        </DialogHeader>
        
        <div className="modal-scrollable px-6">
          <div className="space-y-6 py-4">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Current Plan
                  <Badge variant="outline" className="font-medium">
                    {user.package}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {user.name} is currently subscribed to the {user.package} plan.
                </div>
              </CardContent>
            </Card>

            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select New Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="planSelect">Choose Plan</Label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} - {plan.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Plan Change Summary */}
            {hasChanges && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900">Plan Change Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{currentPlan?.name}</Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="default">{newPlan?.name}</Badge>
                    </div>
                    <div className="text-blue-700 font-medium">
                      New rate: {newPlan?.price}
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    The new plan will take effect immediately. Billing will be prorated accordingly.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            {hasChanges ? 'Update Plan' : 'No Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}