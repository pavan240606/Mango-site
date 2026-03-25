import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Users, Download, Mail, Calendar, MoreVertical, Eye, Edit, Trash2, CreditCard, Ban, UserCheck, UserX } from 'lucide-react';
import { formatGlobalDateTime } from '../utils/dateFormat';
import { toast } from 'sonner@2.0.3';
import { UserDetailsModal } from './UserDetailsModal';
import { EditUserModal } from './EditUserModal';
import { UserBillingModal } from './UserBillingModal';
import { UserActionConfirmModal } from './UserActionConfirmModal';
import { useState } from 'react';

interface ViewUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  packageId: number;
}

// Mock user data for different packages
const mockPackageUsers = {
  1: [ // Basic Plan
    {
      id: 1,
      username: 'john_smith',
      email: 'john.smith@acme.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      lastPaidOn: new Date('2024-12-01T10:30:00Z'),
      status: 'active',
      joinedDate: new Date('2024-06-15T09:00:00Z')
    },
    {
      id: 2,
      username: 'sarah_connor',
      email: 'sarah.connor@techcorp.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      lastPaidOn: new Date('2024-11-28T14:15:00Z'),
      status: 'active',
      joinedDate: new Date('2024-08-20T11:30:00Z')
    },
    {
      id: 3,
      username: 'mike_wilson',
      email: 'mike.wilson@startup.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      lastPaidOn: new Date('2024-11-15T08:45:00Z'),
      status: 'overdue',
      joinedDate: new Date('2024-09-10T16:20:00Z')
    },
    {
      id: 4,
      username: 'emma_davis',
      email: 'emma.davis@marketing.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      lastPaidOn: new Date('2024-12-02T12:00:00Z'),
      status: 'active',
      joinedDate: new Date('2024-07-05T13:45:00Z')
    }
  ],
  2: [ // Pro Plan
    {
      id: 5,
      username: 'alex_chen',
      email: 'alex.chen@enterprise.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      lastPaidOn: new Date('2024-11-30T16:20:00Z'),
      status: 'active',
      joinedDate: new Date('2024-05-12T10:15:00Z')
    },
    {
      id: 6,
      username: 'lisa_rodriguez',
      email: 'lisa.rodriguez@bigcorp.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      lastPaidOn: new Date('2024-12-01T09:30:00Z'),
      status: 'active',
      joinedDate: new Date('2024-04-28T14:00:00Z')
    },
    {
      id: 7,
      username: 'david_kumar',
      email: 'david.kumar@solutions.net',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
      lastPaidOn: new Date('2024-11-25T11:45:00Z'),
      status: 'active',
      joinedDate: new Date('2024-06-08T15:30:00Z')
    }
  ],
  3: [ // Enterprise Plan
    {
      id: 8,
      username: 'jennifer_lee',
      email: 'jennifer.lee@global.com',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
      lastPaidOn: new Date('2024-12-01T14:00:00Z'),
      status: 'active',
      joinedDate: new Date('2024-01-15T09:00:00Z')
    },
    {
      id: 9,
      username: 'robert_johnson',
      email: 'robert.johnson@fortune500.com',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      lastPaidOn: new Date('2024-11-29T10:15:00Z'),
      status: 'active',
      joinedDate: new Date('2024-02-20T11:30:00Z')
    }
  ]
};

export function ViewUsersModal({ isOpen, onClose, packageName, packageId }: ViewUsersModalProps) {
  const users = mockPackageUsers[packageId as keyof typeof mockPackageUsers] || [];
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [activeModal, setActiveModal] = useState<'details' | 'edit' | 'billing' | 'confirm' | null>(null);
  const [confirmAction, setConfirmAction] = useState<'activate' | 'suspend' | 'delete' | null>(null);

  const handleExportUsers = () => {
    // Mock export functionality
    console.log(`Exporting ${users.length} users from ${packageName}`);
    toast.success(`Exported ${users.length} users from ${packageName}`, {
      description: 'User data has been exported to CSV format'
    });
  };

  const handleUserAction = (action: string, userId: number, username: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setSelectedUser(user);

    switch (action) {
      case 'View Details':
        setActiveModal('details');
        break;
      case 'Edit User':
        setActiveModal('edit');
        break;
      case 'View Billing':
        setActiveModal('billing');
        break;
      case 'Suspend User':
        setConfirmAction('suspend');
        setActiveModal('confirm');
        break;
      case 'Delete User':
        setConfirmAction('delete');
        setActiveModal('confirm');
        break;
      case 'Activate User':
        setConfirmAction('activate');
        setActiveModal('confirm');
        break;
      default:
        console.log(`Unknown action: ${action} for user ${username} (ID: ${userId})`);
    }
  };

  const handleCloseModals = () => {
    setActiveModal(null);
    setSelectedUser(null);
    setConfirmAction(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {packageName} Users ({users.length})
          </DialogTitle>
          <DialogDescription>
            Manage and view details for all users subscribed to the {packageName} package.
          </DialogDescription>
        </DialogHeader>
        
        <div className="modal-scrollable px-6">
          <div className="space-y-6 py-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Badge className="h-4 w-4" />
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Overdue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.status === 'overdue').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Details</CardTitle>
                  <Button onClick={handleExportUsers} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Users
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/5">Username</TableHead>
                      <TableHead className="w-1/5">Email</TableHead>
                      <TableHead className="w-1/5">Status</TableHead>
                      <TableHead className="w-1/5">Last Paid On</TableHead>
                      <TableHead className="w-1/5">Joined Date</TableHead>
                      <TableHead className="w-12 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatGlobalDateTime(user.lastPaidOn)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {formatGlobalDateTime(user.joinedDate)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer border-0 bg-transparent"
                                style={{ 
                                  display: 'inline-flex !important',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '32px',
                                  height: '32px',
                                  padding: '0',
                                  margin: '0 auto',
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  borderRadius: '6px',
                                  cursor: 'pointer'
                                }}
                                aria-label="User actions"
                              >
                                <svg 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                  style={{ 
                                    display: 'block !important',
                                    width: '16px !important',
                                    height: '16px !important',
                                    color: '#666666'
                                  }}
                                >
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="12" cy="5" r="1"></circle>
                                  <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem 
                                onClick={() => handleUserAction('View Details', user.id, user.username)}
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleUserAction('Edit User', user.id, user.username)}
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleUserAction('View Billing', user.id, user.username)}
                                className="cursor-pointer"
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                View Billing
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === 'active' && (
                                <DropdownMenuItem 
                                  onClick={() => handleUserAction('Suspend User', user.id, user.username)}
                                  className="cursor-pointer text-orange-600 focus:text-orange-600"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              )}
                              {user.status === 'overdue' && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => handleUserAction('Activate User', user.id, user.username)}
                                    className="cursor-pointer text-green-600 focus:text-green-600"
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Activate User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleUserAction('Suspend User', user.id, user.username)}
                                    className="cursor-pointer text-orange-600 focus:text-orange-600"
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend User
                                  </DropdownMenuItem>
                                </>
                              )}
                              {user.status === 'unsubscribed' && (
                                <DropdownMenuItem 
                                  onClick={() => handleUserAction('Activate User', user.id, user.username)}
                                  className="cursor-pointer text-green-600 focus:text-green-600"
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activate User
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleUserAction('Delete User', user.id, user.username)}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {users.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No users found for this package</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          isOpen={activeModal === 'details'}
          onClose={handleCloseModals}
          user={selectedUser}
        />
      )}

      {/* Edit User Modal */}
      {selectedUser && (
        <EditUserModal
          isOpen={activeModal === 'edit'}
          onClose={handleCloseModals}
          user={selectedUser}
        />
      )}

      {/* User Billing Modal */}
      {selectedUser && (
        <UserBillingModal
          isOpen={activeModal === 'billing'}
          onClose={handleCloseModals}
          user={selectedUser}
        />
      )}

      {/* User Action Confirmation Modal */}
      {selectedUser && confirmAction && (
        <UserActionConfirmModal
          isOpen={activeModal === 'confirm'}
          onClose={handleCloseModals}
          action={confirmAction}
          user={selectedUser}
        />
      )}
    </Dialog>
  );
}