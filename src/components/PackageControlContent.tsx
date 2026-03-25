import { useState } from 'react';
import { Package, Clock, Plus, DollarSign, Users, TrendingUp, Star, Target, Activity } from 'lucide-react';
import { PackageEditModal } from './PackageEditModal';
import { AddPackageModal } from './AddPackageModal';
import { PackageDetailsModal } from './PackageDetailsModal';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formatGlobalDateTime } from '../utils/dateFormat';
import { usePackages } from './PackagesContext';

export function PackageControlContent({ onShowLogs }: { onShowLogs: () => void }) {
  const { packages, updatePackage, addPackage } = usePackages();
  const [editingPackage, setEditingPackage] = useState<typeof packages[0] | null>(null);
  const [addingPackage, setAddingPackage] = useState(false);
  const [viewingPackage, setViewingPackage] = useState<typeof packages[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackageFilter, setSelectedPackageFilter] = useState('all');

  const handleEditPackage = (pkg: typeof packages[0]) => {
    setViewingPackage(null);
    setEditingPackage(pkg);
  };

  const handleViewPackage = (pkg: typeof packages[0]) => {
    setViewingPackage(pkg);
  };

  const handleSavePackage = (updatedPackage: { id: number; name: string; price: string; features: string[] }) => {
    updatePackage(updatedPackage.id, {
      name: updatedPackage.name,
      price: updatedPackage.price,
      features: updatedPackage.features
    });
    setEditingPackage(null);
  };

  const handleAddPackage = (newPackage: { name: string; price: string; features: string[] }) => {
    addPackage(newPackage);
    setAddingPackage(false);
  };

  // Filter packages based on search and selected package
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = searchQuery === '' || 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPackage = selectedPackageFilter === 'all' || 
      pkg.id.toString() === selectedPackageFilter;
    
    return matchesSearch && matchesPackage;
  });

  // Calculate stats based on filtered packages
  const stats = (() => {
    const packagesToCalculate = selectedPackageFilter === 'all' ? packages : filteredPackages;
    
    const totalUsers = packagesToCalculate.reduce((sum, pkg) => sum + pkg.users, 0);
    const totalRevenue = packagesToCalculate.reduce((sum, pkg) => {
      const revenue = parseInt(pkg.revenue.replace(/[^0-9]/g, '')) || 0;
      return sum + revenue;
    }, 0);
    const activePackages = packagesToCalculate.filter(pkg => pkg.users > 0).length;
    
    // Calculate average users per package
    const avgUsersPerPackage = packagesToCalculate.length > 0 
      ? Math.round(totalUsers / packagesToCalculate.length) 
      : 0;
    
    // Calculate feature count (total unique features across selected packages)
    const allFeatures = new Set<string>();
    packagesToCalculate.forEach(pkg => {
      pkg.features.forEach(feature => allFeatures.add(feature));
    });
    const totalFeatures = allFeatures.size;
    
    // Calculate conversion rate (packages with users / total packages)
    const conversionRate = packagesToCalculate.length > 0
      ? Math.round((activePackages / packagesToCalculate.length) * 100)
      : 0;

    return {
      total: packagesToCalculate.length,
      totalUsers,
      totalRevenue,
      activePackages,
      avgUsersPerPackage,
      totalFeatures,
      conversionRate
    };
  })();

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-medium text-gray-900">Package Control</h1>
            <p className="text-gray-600 mt-1">Manage subscription packages and features</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Last updated: {formatGlobalDateTime(new Date())}
          </div>
        </div>

        {/* Stats Overview - 6 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                {selectedPackageFilter === 'all' ? 'Total Packages' : 'Selected'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active Packages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{stats.activePackages}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Total Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalFeatures}</div>
            </CardContent>
          </Card>
        </div>

        {/* Package Management Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-bold text-[20px]">Package Management</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAddingPackage(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Package
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <Input
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Select value={selectedPackageFilter} onValueChange={setSelectedPackageFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id.toString()}>
                      {pkg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table View */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Package Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Active Users</TableHead>
                    <TableHead>Monthly Revenue</TableHead>
                    <TableHead>Features</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No packages found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPackages.map((pkg) => (
                      <TableRow 
                        key={pkg.id} 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleViewPackage(pkg)}
                      >
                        <TableCell className="font-medium">{pkg.name}</TableCell>
                        <TableCell>
                          <Badge variant={pkg.price === 'Free' ? 'secondary' : 'default'}>
                            {pkg.price}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            {pkg.users}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            {pkg.revenue}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {pkg.features.slice(0, 2).map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {pkg.features.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{pkg.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Package Details Modal */}
        {viewingPackage && (
          <PackageDetailsModal
            isOpen={!!viewingPackage}
            onClose={() => setViewingPackage(null)}
            packageData={viewingPackage}
            onEdit={() => handleEditPackage(viewingPackage)}
          />
        )}

        {/* Package Edit Modal */}
        {editingPackage && (
          <PackageEditModal
            isOpen={!!editingPackage}
            onClose={() => setEditingPackage(null)}
            packageData={editingPackage}
            onSave={handleSavePackage}
          />
        )}

        {/* Add Package Modal */}
        {addingPackage && (
          <AddPackageModal
            isOpen={addingPackage}
            onClose={() => setAddingPackage(false)}
            onSave={handleAddPackage}
          />
        )}
      </div>
    </div>
  );
}