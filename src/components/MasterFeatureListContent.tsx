import { useState, useEffect } from 'react';
import { Clock, Plus, Pencil, Trash2, Search, ArrowUpDown, Save, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useFeatures, Feature } from './FeaturesContext';
import { usePackages } from './PackagesContext';
import { formatGlobalDateTime } from '../utils/dateFormat';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

export function MasterFeatureListContent() {
  const { masterFeatures, addFeature, removeFeature, updateFeature } = useFeatures();
  const { packages, updatePackageFeatures } = usePackages();
  const [searchQuery, setSearchQuery] = useState('');
  const [connectionFilter, setConnectionFilter] = useState<'all' | 'connected' | 'not-connected'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureConnected, setNewFeatureConnected] = useState(false);
  const [newFeaturePackages, setNewFeaturePackages] = useState<Set<number>>(new Set());
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editedFeatureName, setEditedFeatureName] = useState('');
  const [editedFeatureConnected, setEditedFeatureConnected] = useState(false);
  const [editedFeaturePackages, setEditedFeaturePackages] = useState<Set<number>>(new Set());
  const [deletingFeature, setDeletingFeature] = useState<string | null>(null);
  
  // Track which features are assigned to which packages (read-only view)
  const [packageFeatures, setPackageFeatures] = useState<Record<string, Set<number>>>(() => {
    const initial: Record<string, Set<number>> = {};
    masterFeatures.forEach(feature => {
      initial[feature.name] = new Set();
      packages.forEach(pkg => {
        if (pkg.features.includes(feature.name)) {
          initial[feature.name].add(pkg.id);
        }
      });
    });
    return initial;
  });

  // Update packageFeatures when packages or masterFeatures change
  useEffect(() => {
    const updated: Record<string, Set<number>> = {};
    masterFeatures.forEach(feature => {
      updated[feature.name] = new Set();
      packages.forEach(pkg => {
        if (pkg.features.includes(feature.name)) {
          updated[feature.name].add(pkg.id);
        }
      });
    });
    setPackageFeatures(updated);
  }, [packages, masterFeatures]);

  const filteredFeatures = masterFeatures
    .filter(feature => feature.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(feature => {
      if (connectionFilter === 'connected') return feature.isConnected;
      if (connectionFilter === 'not-connected') return !feature.isConnected;
      return true;
    });

  const connectedCount = masterFeatures.filter(f => f.isConnected).length;
  const notConnectedCount = masterFeatures.length - connectedCount;

  const handleAddFeature = () => {
    if (newFeatureName.trim()) {
      addFeature(newFeatureName.trim(), newFeatureConnected);
      
      // Save changes immediately to packages
      packages.forEach(pkg => {
        if (newFeaturePackages.has(pkg.id)) {
          const currentFeatures = masterFeatures
            .filter(feature => pkg.features.includes(feature.name))
            .map(f => f.name);
          updatePackageFeatures(pkg.id, [...currentFeatures, newFeatureName.trim()]);
        }
      });
      
      // Reset form
      setNewFeatureName('');
      setNewFeatureConnected(false);
      setNewFeaturePackages(new Set());
      setIsAddModalOpen(false);
      
      toast.success('Feature added and assigned successfully');
    }
  };

  const toggleNewFeaturePackage = (packageId: number) => {
    setNewFeaturePackages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  const toggleAllPackages = () => {
    if (newFeaturePackages.size === packages.length) {
      setNewFeaturePackages(new Set());
    } else {
      setNewFeaturePackages(new Set(packages.map(pkg => pkg.id)));
    }
  };

  const toggleEditFeaturePackage = (packageId: number) => {
    setEditedFeaturePackages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  const toggleAllEditPackages = () => {
    if (editedFeaturePackages.size === packages.length) {
      setEditedFeaturePackages(new Set());
    } else {
      setEditedFeaturePackages(new Set(packages.map(pkg => pkg.id)));
    }
  };

  const handleEditFeature = () => {
    if (editingFeature && editedFeatureName.trim()) {
      updateFeature(editingFeature.name, editedFeatureName.trim(), editedFeatureConnected);
      
      // Get current package data snapshot before updating
      const currentPackages = packages;
      
      // Save changes immediately to all packages
      currentPackages.forEach(pkg => {
        // Get all features currently in this package, excluding the one being edited
        const otherFeatures = pkg.features.filter(fname => fname !== editingFeature.name);
        
        if (editedFeaturePackages.has(pkg.id)) {
          // Add the edited feature (with potentially new name) to this package
          updatePackageFeatures(pkg.id, [...otherFeatures, editedFeatureName.trim()]);
        } else {
          // Don't include the edited feature in this package
          updatePackageFeatures(pkg.id, otherFeatures);
        }
      });
      
      // Reset form
      setEditingFeature(null);
      setEditedFeatureName('');
      setEditedFeatureConnected(false);
      setEditedFeaturePackages(new Set());
      setIsEditModalOpen(false);
      
      toast.success('Feature updated and assigned successfully');
    }
  };

  const handleDeleteFeature = () => {
    if (deletingFeature) {
      removeFeature(deletingFeature);
      setDeletingFeature(null);
      setIsDeleteModalOpen(false);
      toast.success('Feature deleted successfully');
    }
  };

  const openEditModal = (feature: Feature) => {
    setEditingFeature(feature);
    setEditedFeatureName(feature.name);
    setEditedFeatureConnected(feature.isConnected);
    setEditedFeaturePackages(packageFeatures[feature.name] || new Set());
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (featureName: string) => {
    setDeletingFeature(featureName);
    setIsDeleteModalOpen(true);
  };

  const isFeatureInPackage = (featureName: string, packageId: number) => {
    return packageFeatures[featureName]?.has(packageId) || false;
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Master Feature List</h1>
            <p className="text-gray-600 mt-1">Manage features and assign them to packages</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Last updated: {formatGlobalDateTime(new Date())}
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </div>

        {/* Feature Matrix Card */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Assignment Matrix</CardTitle>
            <CardDescription>
              {masterFeatures.length} features available • {packages.length} packages configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="mb-4 flex gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={connectionFilter} onValueChange={(value: any) => setConnectionFilter(value)}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Features</SelectItem>
                  <SelectItem value="connected">Connected Only</SelectItem>
                  <SelectItem value="not-connected">Not Connected Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Legend */}
            <div className="mb-4 flex items-center gap-4 justify-end">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                <span className="text-xs text-gray-600">
                  Connected ({connectedCount})
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                <span className="text-xs text-gray-600">
                  Not Connected ({notConnectedCount})
                </span>
              </div>
            </div>

            {/* Features Matrix Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-700 min-w-[250px] sticky left-0 bg-gray-50 z-10">
                        <div className="flex items-center gap-2">
                          Feature
                          <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                        </div>
                      </th>
                      {packages.map(pkg => (
                        <th key={pkg.id} className="text-center px-4 py-3 text-sm font-medium text-gray-700 min-w-[120px]">
                          <div className="flex items-center justify-center gap-2">
                            {pkg.name}
                            <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                          </div>
                        </th>
                      ))}
                      <th className="text-right px-4 py-3 text-sm font-medium text-gray-700 w-32 sticky right-0 bg-gray-50 z-10">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-white">
                    {filteredFeatures.map((feature, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm sticky left-0 bg-white z-10 hover:bg-gray-50">
                          <span 
                            className={`font-bold ${
                              feature.isConnected 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}
                          >
                            {feature.name}
                          </span>
                        </td>
                        {packages.map(pkg => (
                          <td key={pkg.id} className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center bg-[rgba(0,0,0,0)]">
                              <Checkbox
                                checked={isFeatureInPackage(feature.name, pkg.id)}
                                disabled
                                className="h-5 w-5 disabled:opacity-100"
                              />
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right sticky right-0 bg-white z-10 hover:bg-gray-50">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(feature)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteModal(feature.name)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredFeatures.length === 0 && (
                      <tr>
                        <td colSpan={packages.length + 2} className="px-4 py-8 text-center text-gray-500">
                          {searchQuery ? 'No features found matching your search' : 'No features available'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-4 flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>Total Features: {masterFeatures.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Showing: {filteredFeatures.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Feature Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Feature</DialogTitle>
              <DialogDescription>
                Add a new feature and assign it to packages in one step
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="feature-name">Feature Name</Label>
                <Input
                  id="feature-name"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  placeholder="e.g., Advanced Analytics"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="feature-connected"
                  checked={newFeatureConnected}
                  onCheckedChange={(checked) => setNewFeatureConnected(checked as boolean)}
                />
                <Label htmlFor="feature-connected" className="cursor-pointer">
                  Mark as Connected (Live)
                </Label>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label>Assign to Packages</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleAllPackages}
                  >
                    {newFeaturePackages.size === packages.length ? 'Unselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {packages.map(pkg => (
                    <div key={pkg.id} className="flex items-center gap-2 p-2 hover:bg-white rounded transition-colors">
                      <Checkbox
                        id={`package-${pkg.id}`}
                        checked={newFeaturePackages.has(pkg.id)}
                        onCheckedChange={() => toggleNewFeaturePackage(pkg.id)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor={`package-${pkg.id}`} className="cursor-pointer flex-1">
                        {pkg.name}
                      </Label>
                      <span className="text-xs text-gray-500">{pkg.price}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {newFeaturePackages.size} of {packages.length} packages
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => {
                setIsAddModalOpen(false);
                setNewFeatureName('');
                setNewFeatureConnected(false);
                setNewFeaturePackages(new Set());
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleAddFeature}
                disabled={!newFeatureName.trim()}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Add & Save Feature
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Feature Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Feature</DialogTitle>
              <DialogDescription>
                Update the feature name, connection status, and package assignments
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-feature-name">Feature Name</Label>
                <Input
                  id="edit-feature-name"
                  value={editedFeatureName}
                  onChange={(e) => setEditedFeatureName(e.target.value)}
                  placeholder="e.g., Advanced Analytics"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleEditFeature();
                    }
                  }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-feature-connected"
                  checked={editedFeatureConnected}
                  onCheckedChange={(checked) => setEditedFeatureConnected(checked as boolean)}
                />
                <Label htmlFor="edit-feature-connected" className="cursor-pointer">
                  Mark as Connected (Live)
                </Label>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <Label>Assign to Packages</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleAllEditPackages}
                  >
                    {editedFeaturePackages.size === packages.length ? 'Unselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {packages.map(pkg => (
                    <div key={pkg.id} className="flex items-center gap-2 p-2 hover:bg-white rounded transition-colors">
                      <Checkbox
                        id={`edit-package-${pkg.id}`}
                        checked={editedFeaturePackages.has(pkg.id)}
                        onCheckedChange={() => toggleEditFeaturePackage(pkg.id)}
                        className="h-5 w-5"
                      />
                      <Label htmlFor={`edit-package-${pkg.id}`} className="cursor-pointer flex-1">
                        {pkg.name}
                      </Label>
                      <span className="text-xs text-gray-500">{pkg.price}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {editedFeaturePackages.size} of {packages.length} packages
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditFeature}
                disabled={!editedFeatureName.trim()}
                className="bg-teal-600 hover:bg-teal-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Update Feature
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Feature Modal */}
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Feature</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this feature?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-900">
                  This will remove <strong>{deletingFeature}</strong> from all packages. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDeleteFeature}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Feature
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}