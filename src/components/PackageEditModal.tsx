import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import { GripVertical, X, Plus, ArrowRight, ArrowLeft } from 'lucide-react';
import { useFeatures } from './FeaturesContext';

interface PackageEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    id: number;
    name: string;
    price: string;
    features: string[];
  };
  onSave: (updatedPackage: { id: number; name: string; price: string; features: string[] }) => void;
}

export function PackageEditModal({ isOpen, onClose, packageData, onSave }: PackageEditModalProps) {
  const { masterFeatures } = useFeatures();
  const [editedPackage, setEditedPackage] = useState(packageData);
  const [draggedFeature, setDraggedFeature] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<'available' | 'package' | null>(null);

  // Get available features (features not in this package)
  const availableFeatures = masterFeatures.filter(
    feature => !editedPackage.features.includes(feature)
  );

  const handleSave = () => {
    onSave(editedPackage);
    onClose();
  };

  const handleDragStart = (e: React.DragEvent, feature: string, source: 'available' | 'package') => {
    setDraggedFeature(feature);
    setDragSource(source);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToPackage = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedFeature && dragSource === 'available') {
      setEditedPackage({
        ...editedPackage,
        features: [...editedPackage.features, draggedFeature]
      });
    }
    setDraggedFeature(null);
    setDragSource(null);
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedFeature && dragSource === 'package') {
      setEditedPackage({
        ...editedPackage,
        features: editedPackage.features.filter(f => f !== draggedFeature)
      });
    }
    setDraggedFeature(null);
    setDragSource(null);
  };

  const handleDragEnd = () => {
    setDraggedFeature(null);
    setDragSource(null);
  };

  const moveFeatureToPackage = (feature: string) => {
    setEditedPackage({
      ...editedPackage,
      features: [...editedPackage.features, feature]
    });
  };

  const removeFeatureFromPackage = (feature: string) => {
    setEditedPackage({
      ...editedPackage,
      features: editedPackage.features.filter(f => f !== feature)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Edit Package: {packageData.name}</DialogTitle>
          <DialogDescription>
            Modify package details, features, and pricing information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="modal-scrollable px-6">
          <div className="space-y-6 py-4">
            {/* Package Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="package-name">Package Name</Label>
                <Input
                  id="package-name"
                  value={editedPackage.name}
                  onChange={(e) => setEditedPackage({ ...editedPackage, name: e.target.value })}
                  placeholder="Enter package name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="package-price">Package Price</Label>
                <Input
                  id="package-price"
                  value={editedPackage.price}
                  onChange={(e) => setEditedPackage({ ...editedPackage, price: e.target.value })}
                  placeholder="e.g., $99/month"
                />
              </div>
            </div>

            {/* Features Management - Side by Side */}
            <div className="space-y-4">
              <div className="text-center">
                <Label className="text-lg">Feature Management</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag features between columns or use the arrow buttons
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Available Features */}
                <Card className="h-96">
                  <CardHeader className="pb-3">
                    <h3 className="font-medium flex items-center justify-between">
                      Available Features
                      <span className="text-sm text-muted-foreground">({availableFeatures.length})</span>
                    </h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div 
                      className="h-80 overflow-y-auto px-4 pb-4 space-y-2"
                      onDragOver={handleDragOver}
                      onDrop={handleDropToAvailable}
                    >
                      {availableFeatures.map((feature) => (
                        <div
                          key={feature}
                          className={`p-3 border rounded-lg cursor-move transition-all duration-200 bg-white hover:shadow-md flex items-center justify-between group ${
                            draggedFeature === feature && dragSource === 'available' ? 'opacity-50 scale-95' : ''
                          }`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, feature, 'available')}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{feature}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveFeatureToPackage(feature)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {availableFeatures.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <p>All features are already in this package</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Package Features */}
                <Card className="h-96">
                  <CardHeader className="pb-3">
                    <h3 className="font-medium flex items-center justify-between">
                      {editedPackage.name} Features
                      <span className="text-sm text-muted-foreground">({editedPackage.features.length})</span>
                    </h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div 
                      className="h-80 overflow-y-auto px-4 pb-4 space-y-2"
                      onDragOver={handleDragOver}
                      onDrop={handleDropToPackage}
                    >
                      {editedPackage.features.map((feature) => (
                        <div
                          key={feature}
                          className={`p-3 border rounded-lg cursor-move transition-all duration-200 bg-white hover:shadow-md flex items-center justify-between group ${
                            draggedFeature === feature && dragSource === 'package' ? 'opacity-50 scale-95' : ''
                          }`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, feature, 'package')}
                          onDragEnd={handleDragEnd}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeatureFromPackage(feature)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </Button>
                          <div className="flex items-center gap-2 flex-1">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        </div>
                      ))}
                      {editedPackage.features.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <p>No features selected</p>
                          <p className="text-xs">Drag features from the left column</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
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