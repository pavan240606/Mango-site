import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Users, Download, Mail, Calendar, Eye, Trash2, CreditCard, Ban, UserCheck, UserX, ArrowUpDown, ArrowUp, ArrowDown, Package, ChevronDown, Check, Minus } from 'lucide-react';
import { formatGlobalDateTime, formatGlobalDate } from '../utils/dateFormat';
import { UserDetailsModal } from './UserDetailsModal';

import { UserBillingModal } from './UserBillingModal';
import { UserActionConfirmModal } from './UserActionConfirmModal';
import { ChangePlanModal } from './ChangePlanModal';

// Comprehensive user data combining all users from all packages
const allUsers = [
  // Basic Plan Users
  {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    username: 'john_smith',
    email: 'john.smith@acme.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-12-01T10:30:00Z'),
    status: 'active',
    joinedDate: new Date('2024-06-15T09:00:00Z'),
    lastActiveDate: new Date('2025-01-10T14:22:00Z'),
    package: 'Basic',
    company: 'ACME Corporation',
    name: 'John Smith'
  },
  {
    id: 2,
    firstName: 'Sarah',
    lastName: 'Connor',
    username: 'sarah_connor',
    email: 'sarah.connor@techcorp.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-11-28T14:15:00Z'),
    status: 'active',
    joinedDate: new Date('2024-08-20T11:30:00Z'),
    lastActiveDate: new Date('2025-01-12T09:15:00Z'),
    package: 'Basic',
    company: 'TechCorp Solutions',
    name: 'Sarah Connor'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Wilson',
    username: 'mike_wilson',
    email: 'mike.wilson@startup.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-11-15T08:45:00Z'),
    status: 'overdue',
    joinedDate: new Date('2024-09-10T16:20:00Z'),
    lastActiveDate: new Date('2024-12-20T11:30:00Z'),
    package: 'Basic',
    company: 'Startup.io',
    name: 'Mike Wilson'
  },
  {
    id: 4,
    firstName: 'Emma',
    lastName: 'Davis',
    username: 'emma_davis',
    email: 'emma.davis@marketing.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-12-02T12:00:00Z'),
    status: 'active',
    joinedDate: new Date('2024-07-05T13:45:00Z'),
    lastActiveDate: new Date('2025-01-13T08:45:00Z'),
    package: 'Basic',
    company: 'Marketing Plus',
    name: 'Emma Davis'
  },
  // Pro Plan Users
  {
    id: 5,
    firstName: 'Alex',
    lastName: 'Chen',
    username: 'alex_chen',
    email: 'alex.chen@enterprise.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-11-30T16:20:00Z'),
    status: 'active',
    joinedDate: new Date('2024-05-12T10:15:00Z'),
    lastActiveDate: new Date('2025-01-13T16:30:00Z'),
    package: 'Professional',
    company: 'Enterprise Holdings',
    name: 'Alex Chen'
  },
  {
    id: 6,
    firstName: 'Lisa',
    lastName: 'Rodriguez',
    username: 'lisa_rodriguez',
    email: 'lisa.rodriguez@bigcorp.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-12-01T09:30:00Z'),
    status: 'active',
    joinedDate: new Date('2024-04-28T14:00:00Z'),
    lastActiveDate: new Date('2025-01-11T13:20:00Z'),
    package: 'Professional',
    company: 'BigCorp Inc.',
    name: 'Lisa Rodriguez'
  },
  {
    id: 7,
    firstName: 'David',
    lastName: 'Kumar',
    username: 'david_kumar',
    email: 'david.kumar@solutions.net',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-11-25T11:45:00Z'),
    status: 'active',
    joinedDate: new Date('2024-06-08T15:30:00Z'),
    lastActiveDate: new Date('2025-01-12T10:50:00Z'),
    package: 'Professional',
    company: 'Solutions Network',
    name: 'David Kumar'
  },
  // Enterprise Plan Users
  {
    id: 8,
    firstName: 'Jennifer',
    lastName: 'Lee',
    username: 'jennifer_lee',
    email: 'jennifer.lee@global.com',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-12-01T14:00:00Z'),
    status: 'active',
    joinedDate: new Date('2024-01-15T09:00:00Z'),
    lastActiveDate: new Date('2025-01-13T15:10:00Z'),
    package: 'Enterprise',
    company: 'Global Enterprises',
    name: 'Jennifer Lee'
  },
  {
    id: 9,
    firstName: 'Robert',
    lastName: 'Johnson',
    username: 'robert_johnson',
    email: 'robert.johnson@fortune500.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-11-29T10:15:00Z'),
    status: 'active',
    joinedDate: new Date('2024-02-20T11:30:00Z'),
    lastActiveDate: new Date('2025-01-10T12:00:00Z'),
    package: 'Enterprise',
    company: 'Fortune 500 Group',
    name: 'Robert Johnson'
  },
  // Additional users with different statuses
  {
    id: 10,
    firstName: 'Maria',
    lastName: 'Santos',
    username: 'maria_santos',
    email: 'maria.santos@techstartup.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-10-15T08:30:00Z'),
    status: 'unsubscribed',
    joinedDate: new Date('2024-03-12T14:20:00Z'),
    lastActiveDate: new Date('2024-11-05T16:40:00Z'),
    package: 'Professional',
    company: 'Tech Startup Labs',
    name: 'Maria Santos'
  },
  {
    id: 11,
    firstName: 'James',
    lastName: 'Wright',
    username: 'james_wright',
    email: 'james.wright@agency.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    lastPaidOn: new Date('2024-11-20T16:45:00Z'),
    status: 'overdue',
    joinedDate: new Date('2024-05-08T11:15:00Z'),
    lastActiveDate: new Date('2024-12-28T09:25:00Z'),
    package: 'Basic',
    company: 'Creative Agency',
    name: 'James Wright'
  }
];

// Custom Indeterminate Checkbox Component
function IndeterminateCheckbox({ 
  checked, 
  indeterminate, 
  onCheckedChange, 
  className,
  ...props 
}: {
  checked: boolean;
  indeterminate: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center w-4 h-4 border rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        checked || indeterminate
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-input-background border-border hover:bg-accent'
      } ${className || ''}`}
      onClick={() => onCheckedChange(!checked)}
      {...props}
    >
      {indeterminate ? (
        <Minus className="w-3 h-3" />
      ) : checked ? (
        <Check className="w-3 h-3" />
      ) : null}
    </button>
  );
}

export function UserManagementTab() {
  const [users, setUsers] = useState(allUsers);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPackage, setFilterPackage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sorting state
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState<'joinedDate' | 'lastActiveDate'>('joinedDate');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Selection state
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [isAllPagesSelected, setIsAllPagesSelected] = useState(false);
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<typeof allUsers[0] | null>(null);
  const [activeModal, setActiveModal] = useState<'details' | 'edit' | 'billing' | 'action' | 'changePlan' | 'bulkChangePlan' | null>(null);
  const [actionType, setActionType] = useState<'activate' | 'suspend' | 'delete' | null>(null);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    setIsAllPagesSelected(false);
    if (checked) {
      setSelectedUserIds(filteredUsers.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectAllPages = () => {
    setSelectedUserIds(allFilteredUsers.map(user => user.id));
    setIsAllPagesSelected(true);
  };

  const handleClearSelection = () => {
    setSelectedUserIds([]);
    setIsAllPagesSelected(false);
  };

  const handleSelectUser = (userId: number, checked: boolean) => {
    setIsAllPagesSelected(false);
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  // Bulk actions
  const handleBulkAction = (action: string) => {
    const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));
    
    switch(action) {
      case 'activate':
        setUsers(users.map(user => 
          selectedUserIds.includes(user.id) 
            ? { ...user, status: 'active' }
            : user
        ));
        setSelectedUserIds([]);
        setIsAllPagesSelected(false);
        break;
      case 'suspend':
        setUsers(users.map(user => 
          selectedUserIds.includes(user.id) 
            ? { ...user, status: 'unsubscribed' }
            : user
        ));
        setSelectedUserIds([]);
        setIsAllPagesSelected(false);
        break;
      case 'delete':
        setUsers(users.filter(user => !selectedUserIds.includes(user.id)));
        setSelectedUserIds([]);
        setIsAllPagesSelected(false);
        break;
      case 'changePlan':
        setActiveModal('bulkChangePlan');
        break;
    }
  };

  const handleBulkPlanChange = (newPlan: string) => {
    setUsers(users.map(user => 
      selectedUserIds.includes(user.id) 
        ? { ...user, package: newPlan }
        : user
    ));
    setSelectedUserIds([]);
    setIsAllPagesSelected(false);
    setActiveModal(null);
  };

  const handleUserAction = (action: string, userId: number, username: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setSelectedUser(user);

    switch(action) {
      case 'View Details':
        setActiveModal('details');
        break;
      case 'View Billing':
        setActiveModal('billing');
        break;
      case 'Change Plan':
        setActiveModal('changePlan');
        break;
      case 'Activate User':
        setActionType('activate');
        setActiveModal('action');
        break;
      case 'Suspend User':
        setActionType('suspend');
        setActiveModal('action');
        break;
      case 'Delete User':
        setActionType('delete');
        setActiveModal('action');
        break;
    }
  };

  const handleConfirmAction = (action: 'activate' | 'suspend' | 'delete', reason?: string) => {
    if (!selectedUser) return;

    let newStatus = selectedUser.status;
    if (action === 'activate') newStatus = 'active';
    if (action === 'suspend') newStatus = 'unsubscribed';
    
    if (action === 'delete') {
      setUsers(users.filter(u => u.id !== selectedUser.id));
    } else {
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, status: newStatus }
          : user
      ));
    }

    closeAllModals();
  };

  const handleSaveUser = (updatedUser: any) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id 
        ? { ...user, ...updatedUser }
        : user
    ));
    closeAllModals();
  };

  const closeAllModals = () => {
    setSelectedUser(null);
    setActiveModal(null);
    setActionType(null);
  };

  const handleSortByDate = (field: 'joinedDate' | 'lastActiveDate') => {
    setSortField(field);
    setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
  };

  // Reset selection when filters change
  useEffect(() => {
    setSelectedUserIds([]);
    setIsAllPagesSelected(false);
    setCurrentPage(1);
  }, [filterStatus, filterPackage, searchQuery]);

  const allFilteredUsers = users
    .filter(user => {
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      const matchesPackage = filterPackage === 'all' || user.package === filterPackage;
      const matchesSearch = searchQuery === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesPackage && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });

  // Calculate pagination
  const totalPages = Math.ceil(allFilteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredUsers = allFilteredUsers.slice(startIndex, endIndex);

  // Checkbox state helpers
  const isAllSelected = filteredUsers.length > 0 && filteredUsers.every(user => selectedUserIds.includes(user.id));
  const isIndeterminate = filteredUsers.some(user => selectedUserIds.includes(user.id)) && !isAllSelected;
  const hasSelectedUsers = selectedUserIds.length > 0;
  const isAllPageSelected = isAllSelected && !isAllPagesSelected;
  const canSelectAllPages = isAllPageSelected && allFilteredUsers.length > filteredUsers.length;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, filterPackage, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'unsubscribed':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Unsubscribed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    overdue: users.filter(u => u.status === 'overdue').length,
    suspended: users.filter(u => u.status === 'unsubscribed').length
  };

  return (
    <>
      <div className="space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
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
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Ban className="h-4 w-4" />
                Unsubscribed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.suspended}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Users Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="font-bold text-[20px]">User Management</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant={hasSelectedUsers ? "default" : "outline"} 
                    size="sm"
                    disabled={!hasSelectedUsers}
                    className={hasSelectedUsers ? "bg-primary text-primary-foreground" : ""}
                  >
                    Actions ({selectedUserIds.length})
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('activate')}
                    className="cursor-pointer text-green-600 focus:text-green-600"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate Users
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('suspend')}
                    className="cursor-pointer text-orange-600 focus:text-orange-600"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend Users
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('changePlan')}
                    className="cursor-pointer"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Change Plan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('delete')}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Users
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPackage} onValueChange={setFilterPackage}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Selection Banner */}
            {canSelectAllPages && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <span className="font-medium">{filteredUsers.length} users</span> selected on this page.
                    <button
                      onClick={handleSelectAllPages}
                      className="ml-1 text-blue-600 hover:text-blue-800 underline font-medium"
                    >
                      Select all {allFilteredUsers.length} users
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleClearSelection}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear selection
                </Button>
              </div>
            )}

            {isAllPagesSelected && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <span className="font-medium">All {allFilteredUsers.length} users</span> are selected.
                  </div>
                </div>
                <Button
                  onClick={handleClearSelection}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear selection
                </Button>
              </div>
            )}

            {/* Users Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <IndeterminateCheckbox
                      checked={isAllSelected || isAllPagesSelected}
                      indeterminate={isIndeterminate}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all users"
                    />
                  </TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
                      onClick={() => handleSortByDate('joinedDate')}
                    >
                      <div className="flex items-center gap-2">
                        Joined Date
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </div>
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      className="h-auto p-0 hover:bg-gray-100 rounded px-2 py-1 transition-colors"
                      onClick={() => handleSortByDate('lastActiveDate')}
                    >
                      <div className="flex items-center gap-2">
                        Last Active Date
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </div>
                    </Button>
                  </TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="w-12 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                        aria-label={`Select ${user.username}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.firstName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.lastName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {user.package}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatGlobalDate(user.joinedDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatGlobalDate(user.lastActiveDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.company}</div>
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleUserAction('View Billing', user.id, user.username)}
                            className="cursor-pointer"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            View Billing
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleUserAction('Change Plan', user.id, user.username)}
                            className="cursor-pointer"
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Change Plan
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
                          {(user.status === 'overdue' || user.status === 'unsubscribed') && (
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
            
            {/* Pagination */}
            {allFilteredUsers.length > 0 && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, allFilteredUsers.length)} of {allFilteredUsers.length} users
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current page
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
            
            {allFilteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {selectedUser && activeModal === 'details' && (
        <UserDetailsModal
          isOpen={true}
          onClose={closeAllModals}
          user={selectedUser}
        />
      )}

      {selectedUser && activeModal === 'billing' && (
        <UserBillingModal
          isOpen={true}
          onClose={closeAllModals}
          user={selectedUser}
        />
      )}

      {selectedUser && activeModal === 'action' && actionType && (
        <UserActionConfirmModal
          isOpen={true}
          onClose={closeAllModals}
          user={selectedUser}
          action={actionType}
          onConfirm={handleConfirmAction}
        />
      )}

      {selectedUser && activeModal === 'changePlan' && (
        <ChangePlanModal
          isOpen={true}
          onClose={closeAllModals}
          user={selectedUser}
          onSave={handleSaveUser}
        />
      )}

      <Dialog open={activeModal === 'bulkChangePlan'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Plan for {selectedUserIds.length} Users</DialogTitle>
            <DialogDescription>
              Select a new plan to apply to all selected users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={() => handleBulkPlanChange('Basic')}
                variant="outline" 
                className="w-full justify-start"
              >
                <Package className="h-4 w-4 mr-2" />
                Basic Plan
              </Button>
              <Button 
                onClick={() => handleBulkPlanChange('Professional')}
                variant="outline" 
                className="w-full justify-start"
              >
                <Package className="h-4 w-4 mr-2" />
                Professional Plan
              </Button>
              <Button 
                onClick={() => handleBulkPlanChange('Enterprise')}
                variant="outline" 
                className="w-full justify-start"
              >
                <Package className="h-4 w-4 mr-2" />
                Enterprise Plan
              </Button>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setActiveModal(null)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}