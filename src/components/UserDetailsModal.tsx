import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { User, Mail, Calendar, CreditCard, MapPin, Phone, Building, Globe, Edit3, Check, X, Download, DollarSign, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { formatGlobalDateTime } from '../utils/dateFormat';
import { toast } from 'sonner@2.0.3';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    username: string;
    email: string;
    avatar: string;
    lastPaidOn: Date;
    status: string;
    joinedDate: Date;
    package?: string;
    name?: string;
  };
}

export function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  // User details with editable fields
  const [userDetails, setUserDetails] = useState({
    firstName: user.name?.split(' ')[0] || user.username.split('_')[0] || 'John',
    lastName: user.name?.split(' ')[1] || user.username.split('_')[1] || 'Doe',
    email: user.email,
    company: 'Acme Corporation',
    companyDomain: 'acmecorp.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    timezone: 'PST (UTC-8)',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    totalLogins: Math.floor(Math.random() * 500) + 100,
    accountValue: '$' + (Math.floor(Math.random() * 1000) + 200),
    subscription: user.package || 'Pro Plan',
    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  // Mock billing data
  const billingData = {
    totalPaid: '$1,247.00',
    pendingAmount: '$99.00',
    failedPayments: 1,
    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    currentCard: {
      type: 'Visa',
      last4: '4242',
      expiry: '12/26'
    },
    transactions: [
      {
        id: 'inv_001',
        date: new Date('2024-12-01T10:30:00Z'),
        amount: '$99.00',
        status: 'paid',
        description: 'Professional Plan - Monthly',
        invoice: 'INV-001-2024'
      },
      {
        id: 'inv_002',
        date: new Date('2024-11-01T10:30:00Z'),
        amount: '$99.00',
        status: 'paid',
        description: 'Professional Plan - Monthly',
        invoice: 'INV-002-2024'
      },
      {
        id: 'inv_003',
        date: new Date('2024-10-01T10:30:00Z'),
        amount: '$99.00',
        status: 'failed',
        description: 'Professional Plan - Monthly',
        invoice: 'INV-003-2024'
      },
      {
        id: 'inv_004',
        date: new Date('2024-09-01T10:30:00Z'),
        amount: '$99.00',
        status: 'paid',
        description: 'Professional Plan - Monthly',
        invoice: 'INV-004-2024'
      },
      {
        id: 'inv_005',
        date: new Date('2024-08-01T10:30:00Z'),
        amount: '$99.00',
        status: 'paid',
        description: 'Professional Plan - Monthly',
        invoice: 'INV-005-2024'
      }
    ]
  };

  const handleEditField = (fieldName: string) => {
    setEditingField(fieldName);
    setTempValue(userDetails[fieldName as keyof typeof userDetails] as string);
  };

  const handleSaveField = (fieldName: string) => {
    setUserDetails(prev => ({
      ...prev,
      [fieldName]: tempValue
    }));
    setEditingField(null);
    setTempValue('');
    toast.success('Field updated successfully');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  const handleExportBilling = () => {
    console.log(`Exporting billing data for ${user.username}`);
    // Mock export functionality
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    console.log(`Downloading invoice ${invoiceId}`);
    // Mock download functionality
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const EditableField = ({ fieldName, value, icon, isFullWidth = false }: { 
    fieldName: string; 
    value: string; 
    icon: React.ReactNode; 
    isFullWidth?: boolean;
  }) => {
    const isEditing = editingField === fieldName;
    
    return (
      <div className={isFullWidth ? 'col-span-2' : ''}>
        <div className="flex items-center gap-2">
          {icon}
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button size="sm" onClick={() => handleSaveField(fieldName)}>
                <Check className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span>{value}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditField(fieldName)}
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
          <DialogDescription>
            View and edit comprehensive information about {user.username}'s account and activity.
          </DialogDescription>
        </DialogHeader>
        
        <div className="modal-scrollable px-6">
          <div className="py-4">
            <Tabs defaultValue="user-details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user-details">User Details</TabsTrigger>
                <TabsTrigger value="billing-details">Billing Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="user-details" className="space-y-6 mt-6">
                {/* User Profile Header */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-semibold">
                        {userDetails.firstName.charAt(0)}{userDetails.lastName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {editingField === 'name' ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  placeholder="First Last"
                                  autoFocus
                                />
                                <Button size="sm" onClick={() => {
                                  const names = tempValue.split(' ');
                                  setUserDetails(prev => ({
                                    ...prev,
                                    firstName: names[0] || '',
                                    lastName: names[1] || ''
                                  }));
                                  setEditingField(null);
                                  setTempValue('');
                                  toast.success('Name updated successfully');
                                }}>
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <h3 className="text-xl font-semibold">
                                  {userDetails.firstName} {userDetails.lastName}
                                </h3>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingField('name');
                                    setTempValue(`${userDetails.firstName} ${userDetails.lastName}`);
                                  }}
                                  className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {editingField === 'email' ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                type="email"
                                placeholder="Enter email address"
                                className="flex-1 text-sm"
                                autoFocus
                              />
                              <Button size="sm" onClick={() => handleSaveField('email')}>
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="text-sm">{userDetails.email}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditField('email')}
                                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-bold">
                      <Building className="h-4 w-4" />
                      Company Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-bold text-muted-foreground">Company Name</label>
                        <div className="mt-2">
                          <EditableField 
                            fieldName="company"
                            value={userDetails.company}
                            icon={<Building className="h-4 w-4 text-muted-foreground" />}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-muted-foreground">Company Domain</label>
                        <div className="mt-2">
                          <EditableField 
                            fieldName="companyDomain"
                            value={userDetails.companyDomain}
                            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-bold">
                      <Calendar className="h-4 w-4" />
                      Account Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-bold text-muted-foreground">Joined Date</label>
                          <p>{formatGlobalDateTime(user.joinedDate)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-bold text-muted-foreground">Last Active</label>
                          <p>{formatGlobalDateTime(userDetails.lastActive)}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-bold text-muted-foreground">Account Status</label>
                          <div className="mt-2">
                            <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-bold">
                      <CreditCard className="h-4 w-4" />
                      Subscription Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-bold text-muted-foreground">Current Plan</label>
                          <p className="font-medium">{userDetails.subscription}</p>
                        </div>
                        <div>
                          <label className="text-sm font-bold text-muted-foreground">Account Value</label>
                          <p className="font-medium text-green-600">{userDetails.accountValue}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-bold text-muted-foreground">Last Payment</label>
                          <p>{formatGlobalDateTime(user.lastPaidOn)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-bold text-muted-foreground">Next Billing</label>
                          <p>{formatGlobalDateTime(userDetails.nextBilling)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing-details" className="space-y-6 mt-6">
                {/* Billing Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Total Paid
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{billingData.totalPaid}</div>
                      <p className="text-xs text-muted-foreground">Lifetime payments</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Pending Amount
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">{billingData.pendingAmount}</div>
                      <p className="text-xs text-muted-foreground">Current balance</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Failed Payments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{billingData.failedPayments}</div>
                      <p className="text-xs text-muted-foreground">This year</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Subscription */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Current Subscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Plan</label>
                          <p className="text-lg font-semibold">{user.package} Plan</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <div className="mt-1">
                            <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Last Payment</label>
                          <p>{formatGlobalDateTime(user.lastPaidOn)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Next Billing</label>
                          <p>{formatGlobalDateTime(billingData.nextBilling)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-md flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{billingData.currentCard.type}</span>
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• {billingData.currentCard.last4}</p>
                          <p className="text-sm text-muted-foreground">Expires {billingData.currentCard.expiry}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Transaction History</CardTitle>
                      <Button onClick={handleExportBilling} variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Invoice</TableHead>
                          <TableHead className="w-12">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {billingData.transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {formatGlobalDateTime(transaction.date)}
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className="font-medium">{transaction.amount}</TableCell>
                            <TableCell>
                              {getStatusBadge(transaction.status)}
                            </TableCell>
                            <TableCell>
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                {transaction.invoice}
                              </code>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadInvoice(transaction.invoice)}
                                className="h-8 w-8 p-0"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleExportBilling}>
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}