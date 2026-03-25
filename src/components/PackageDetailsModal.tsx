import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Users, DollarSign, Check } from 'lucide-react';
import { Button } from './ui/button';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    id: number;
    name: string;
    price: string;
    users: number;
    revenue: string;
    features: string[];
  };
  onEdit: () => void;
}

export function PackageDetailsModal({ isOpen, onClose, packageData, onEdit }: PackageDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Package Details</DialogTitle>
          <DialogDescription>
            View complete details and features for this package
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Package Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold">{packageData.name}</h3>
              <p className="text-3xl font-bold text-primary mt-2">{packageData.price}</p>
            </div>
            <Badge variant={packageData.price === 'Free' ? 'secondary' : 'default'} className="text-sm">
              {packageData.price === 'Free' ? 'Free Plan' : 'Premium Plan'}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
                <Users className="h-4 w-4" />
                <span className="font-medium">Active Users</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">{packageData.users}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-sm text-green-700 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">Monthly Revenue</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{packageData.revenue}</div>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h4 className="font-semibold mb-3">Package Features</h4>
            <div className="space-y-2">
              {packageData.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className="mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onEdit}>
              Edit Package
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}