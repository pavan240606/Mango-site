import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import { GripVertical, ArrowRight, ArrowLeft } from 'lucide-react';
import { useFeatures } from './FeaturesContext';

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPackage: { name: string; price: string; features: string[] }) => void;
}

export function AddPackageModal({ isOpen, onClose, onSave }: AddPackageModalProps) {
  const { masterFeatures } = useFeatures();
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [draggedFeature, setDraggedFeature] = useState<string | null>(null);
  const [dragSource, setDragSource] = useState<'available' | 'package' | null>(null);

  // Get available features (features not selected)
  const availableFeatures = masterFeatures.filter(
    feature => !selectedFeatures.includes(feature)
  );

  const handleSave = () => {
    if (packageName.trim() && packagePrice.trim()) {
      onSave({
        name: packageName.trim(),
        price: packagePrice.trim(),
        features: selectedFeatures
      });
      // Reset form
      setPackageName('');
      setPackagePrice('');
      setSelectedFeatures([]);
      onClose();
    }
  };

  const handleCancel = () => {
    setPackageName('');
    setPackagePrice('');
    setSelectedFeatures([]);
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
      setSelectedFeatures([...selectedFeatures, draggedFeature]);
    }
    setDraggedFeature(null);
    setDragSource(null);
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedFeature && dragSource === 'package') {
      setSelectedFeatures(selectedFeatures.filter(f => f !== draggedFeature));
    }
    setDraggedFeature(null);
    setDragSource(null);
  };

  const handleDragEnd = () => {
    setDraggedFeature(null);
    setDragSource(null);
  };

  const moveFeatureToPackage = (feature: string) => {
    setSelectedFeatures([...selectedFeatures, feature]);
  };

  const removeFeatureFromPackage = (feature: string) => {
    setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Add New Package</DialogTitle>
          <DialogDescription>
            Create a new subscription package with custom features and pricing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="modal-scrollable px-6">
          <div className="space-y-6 py-4">
            {/* Package Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-package-name">Package Name</Label>
                <Input
                  id="new-package-name"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="e.g., Premium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-package-price">Package Price</Label>
                <Input
                  id="new-package-price"
                  value={packagePrice}
                  onChange={(e) => setPackagePrice(e.target.value)}
                  placeholder="e.g., $149/month"
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
                          <p>All features are selected</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Package Features */}
                <Card className="h-96">
                  <CardHeader className="pb-3">
                    <h3 className="font-medium flex items-center justify-between">
                      Package Features
                      <span className="text-sm text-muted-foreground">({selectedFeatures.length})</span>
                    </h3>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div 
                      className="h-80 overflow-y-auto px-4 pb-4 space-y-2"
                      onDragOver={handleDragOver}
                      onDrop={handleDropToPackage}
                    >
                      {selectedFeatures.map((feature) => (
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
                      {selectedFeatures.length === 0 && (
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
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!packageName.trim() || !packagePrice.trim()}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Create Package
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
