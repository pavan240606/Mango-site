import { useState } from 'react';
import { RotateCcw, History, Eye, GitCompare, AlertTriangle, Clock, User, FileText, Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Download, Upload, RefreshCw, Check, X, ArrowLeft, ArrowRight, MoreHorizontal, Info, HardDrive, Calendar } from 'lucide-react';
import { formatGlobalDateTime } from '../utils/dateFormat';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useBackups } from './BackupContext';

// Content types and mock data
const contentTypes = [
  { value: 'all', label: 'All Content Types' },
  { value: 'website-page', label: 'Website Pages' },
  { value: 'landing-page', label: 'Landing Pages' },
  { value: 'blog-post', label: 'Blog Posts' },
  { value: 'blogs', label: 'Blogs' },
  { value: 'tags', label: 'Tags' },
  { value: 'authors', label: 'Authors' },
  { value: 'url-redirects', label: 'URL Redirects' },
  { value: 'hubdb-tables', label: 'HubDB Tables' }
];



// Mock restore items for granular selection
const mockRestoreItems = [
  {
    id: 1,
    type: 'Website Page',
    name: 'Home Page',
    path: '/home',
    lastModified: '2024-12-20 14:30:00',
    status: 'modified',
    changes: ['Title updated', 'Hero image changed', 'CTA button text modified']
  },
  {
    id: 2,
    type: 'Blog Post',
    name: 'Getting Started with HubSpot',
    path: '/blog/getting-started',
    lastModified: '2024-12-20 10:15:00',
    status: 'new',
    changes: ['New blog post created']
  },
  {
    id: 3,
    type: 'Landing Page',
    name: 'Product Demo Request',
    path: '/demo-request',
    lastModified: '2024-12-19 16:45:00',
    status: 'deleted',
    changes: ['Page removed from site']
  },
  {
    id: 4,
    type: 'Author',
    name: 'Sarah Johnson',
    path: '/authors/sarah-johnson',
    lastModified: '2024-12-19 11:20:00',
    status: 'modified',
    changes: ['Bio updated', 'Profile image changed']
  }
];

// Mock content for different content types
const generateMockContentForType = (contentType: string) => {
  const contentData: Record<string, any[]> = {
    'website-page': [
      { id: 1, name: 'Home Page', createdDate: '2024-11-15 14:30:00', updatedDate: '2024-12-18 14:45:22', status: 'Published', campaign: 'Brand Awareness', leadGeneration: 'High', conversionRate: '18.5%' },
      { id: 2, name: 'About Us', createdDate: '2024-10-22 16:45:00', updatedDate: '2024-12-01 22:12:33', status: 'Published', campaign: 'Company Profile', leadGeneration: 'Medium', conversionRate: '12.3%' },
      { id: 3, name: 'Contact', createdDate: '2024-09-18 10:20:00', updatedDate: '2024-11-05 16:52:11', status: 'Draft', campaign: 'Lead Capture', leadGeneration: 'Very High', conversionRate: '25.7%' },
      { id: 4, name: 'Services', createdDate: '2024-08-05 13:15:00', updatedDate: '2024-11-20 14:17:55', status: 'Published', campaign: 'Service Marketing', leadGeneration: 'High', conversionRate: '16.2%' },
      { id: 5, name: 'Portfolio', createdDate: '2024-07-13 09:30:00', updatedDate: '2024-08-16 01:03:28', status: 'Published', campaign: 'Portfolio Showcase', leadGeneration: 'Medium', conversionRate: '10.8%' },
      { id: 6, name: 'Pricing', createdDate: '2024-06-20 11:15:00', updatedDate: '2024-07-25 19:25:17', status: 'Published', campaign: 'Pricing Strategy', leadGeneration: 'Very High', conversionRate: '22.4%' },
      { id: 7, name: 'FAQ', createdDate: '2024-05-15 14:45:00', updatedDate: '2024-08-01 22:11:29', status: 'Published', campaign: 'Support Content', leadGeneration: 'Low', conversionRate: '5.3%' },
      { id: 8, name: 'Testimonials', createdDate: '2024-04-28 16:20:00', updatedDate: '2024-11-15 17:47:33', status: 'Published', campaign: 'Social Proof', leadGeneration: 'High', conversionRate: '19.1%' },
      { id: 9, name: 'Case Studies', createdDate: '2024-03-14 09:15:00', updatedDate: '2024-05-10 15:22:44', status: 'Published', campaign: 'Content Marketing', leadGeneration: 'High', conversionRate: '17.6%' },
      { id: 10, name: 'Team', createdDate: '2024-02-10 13:40:00', updatedDate: '2024-03-20 19:55:18', status: 'Archived', campaign: 'About Us', leadGeneration: 'Low', conversionRate: '3.2%' },
    ],
    'landing-page': [
      { id: 1, name: 'Product Launch 2024', createdDate: '2024-12-15 20:00:45', updatedDate: '2024-12-18 14:45:22', status: 'Published', campaign: 'Product Launch Q4', leadGeneration: 'High', conversionRate: '12.5%' },
      { id: 2, name: 'Free Trial Landing', createdDate: '2024-11-28 14:45:22', updatedDate: '2024-12-01 22:12:33', status: 'Published', campaign: 'Lead Generation Campaign', leadGeneration: 'Medium', conversionRate: '8.3%' },
      { id: 3, name: 'Webinar Registration', createdDate: '2024-10-22 22:12:33', updatedDate: '2024-11-05 16:52:11', status: 'Draft', campaign: 'Educational Webinar Series', leadGeneration: 'High', conversionRate: '15.7%' },
      { id: 4, name: 'Holiday Sale 2024', createdDate: '2024-09-18 16:52:11', updatedDate: '2024-11-20 14:17:55', status: 'Published', campaign: 'Holiday Promotions', leadGeneration: 'Very High', conversionRate: '22.1%' },
      { id: 5, name: 'Beta Testing Program', createdDate: '2024-08-05 14:17:55', updatedDate: '2024-08-16 01:03:28', status: 'Archived', campaign: 'Beta Launch Initiative', leadGeneration: 'Low', conversionRate: '4.2%' },
      { id: 6, name: 'Summer Campaign Launch', createdDate: '2024-07-13 01:03:28', updatedDate: '2024-07-25 19:25:17', status: 'Published', campaign: 'Summer 2024 Campaign', leadGeneration: 'Medium', conversionRate: '9.8%' },
      { id: 7, name: 'Back to School Promo', createdDate: '2024-06-20 19:25:17', updatedDate: '2024-08-01 22:11:29', status: 'Published', campaign: 'Education Marketing', leadGeneration: 'High', conversionRate: '14.3%' },
      { id: 8, name: 'Black Friday Special', createdDate: '2024-05-15 22:11:29', updatedDate: '2024-11-15 17:47:33', status: 'Published', campaign: 'Black Friday 2024', leadGeneration: 'Very High', conversionRate: '28.9%' },
      { id: 9, name: 'Customer Success Stories', createdDate: '2024-04-28 17:47:33', updatedDate: '2024-05-10 15:22:44', status: 'Published', campaign: 'Social Proof Campaign', leadGeneration: 'High', conversionRate: '16.7%' },
      { id: 10, name: 'Q1 Growth Initiative', createdDate: '2024-03-14 15:22:44', updatedDate: '2024-03-20 19:55:18', status: 'Archived', campaign: 'Q1 2024 Growth', leadGeneration: 'Medium', conversionRate: '7.1%' },
    ],
    'blog-post': [
      { id: 1, name: 'Getting Started with HubSpot', createdDate: '2024-11-20 10:15:00', updatedDate: '2024-12-18 14:45:22', status: 'Published', campaign: 'Educational Content', leadGeneration: 'Medium', conversionRate: '6.5%' },
      { id: 2, name: '10 Marketing Tips for 2024', createdDate: '2024-10-15 15:30:00', updatedDate: '2024-12-01 22:12:33', status: 'Published', campaign: 'Thought Leadership', leadGeneration: 'High', conversionRate: '11.2%' },
      { id: 3, name: 'How to Use HubDB', createdDate: '2024-09-10 09:45:00', updatedDate: '2024-11-05 16:52:11', status: 'Draft', campaign: 'Technical Content', leadGeneration: 'Low', conversionRate: '3.8%' },
      { id: 4, name: 'SEO Best Practices', createdDate: '2024-08-22 14:20:00', updatedDate: '2024-11-20 14:17:55', status: 'Published', campaign: 'SEO Strategy', leadGeneration: 'Medium', conversionRate: '8.9%' },
      { id: 5, name: 'Email Marketing Guide', createdDate: '2024-07-05 11:10:00', updatedDate: '2024-08-16 01:03:28', status: 'Published', campaign: 'Marketing Guides', leadGeneration: 'High', conversionRate: '12.4%' },
      { id: 6, name: 'Content Marketing Strategy', createdDate: '2024-06-12 13:25:00', updatedDate: '2024-07-25 19:25:17', status: 'Published', campaign: 'Strategy Content', leadGeneration: 'Medium', conversionRate: '9.3%' },
      { id: 7, name: 'Social Media Best Practices', createdDate: '2024-05-18 16:40:00', updatedDate: '2024-08-01 22:11:29', status: 'Published', campaign: 'Social Media', leadGeneration: 'Medium', conversionRate: '7.6%' },
      { id: 8, name: 'Analytics and Reporting', createdDate: '2024-04-03 10:55:00', updatedDate: '2024-11-15 17:47:33', status: 'Published', campaign: 'Analytics Content', leadGeneration: 'Low', conversionRate: '4.5%' },
      { id: 9, name: 'Lead Generation Tactics', createdDate: '2024-03-21 14:30:00', updatedDate: '2024-05-10 15:22:44', status: 'Published', campaign: 'Lead Gen Strategy', leadGeneration: 'Very High', conversionRate: '18.7%' },
      { id: 10, name: 'Customer Retention Strategies', createdDate: '2024-02-15 09:15:00', updatedDate: '2024-03-20 19:55:18', status: 'Archived', campaign: 'Customer Success', leadGeneration: 'Medium', conversionRate: '10.1%' },
    ],
    'blogs': [
      { id: 1, name: 'Company Blog', createdDate: '2024-01-15 08:30:00', updatedDate: '2024-12-18 14:45:22', status: 'Active' },
      { id: 2, name: 'Product Updates', createdDate: '2024-02-20 12:15:00', updatedDate: '2024-12-01 22:12:33', status: 'Active' },
      { id: 3, name: 'Customer Stories', createdDate: '2024-03-10 14:45:00', updatedDate: '2024-11-05 16:52:11', status: 'Active' },
      { id: 4, name: 'Industry Insights', createdDate: '2024-04-05 10:20:00', updatedDate: '2024-11-20 14:17:55', status: 'Active' },
      { id: 5, name: 'Tech Tutorials', createdDate: '2024-05-12 16:30:00', updatedDate: '2024-08-16 01:03:28', status: 'Active' },
    ],
    'tags': [
      { id: 1, name: 'Marketing', createdDate: '2024-01-10 09:30:00', updatedDate: '2024-12-18 14:45:22', status: 'Active' },
      { id: 2, name: 'Sales', createdDate: '2024-01-15 11:20:00', updatedDate: '2024-12-01 22:12:33', status: 'Active' },
      { id: 3, name: 'Customer Service', createdDate: '2024-02-05 13:40:00', updatedDate: '2024-11-05 16:52:11', status: 'Active' },
      { id: 4, name: 'Product', createdDate: '2024-02-20 15:15:00', updatedDate: '2024-11-20 14:17:55', status: 'Active' },
      { id: 5, name: 'Industry News', createdDate: '2024-03-01 10:25:00', updatedDate: '2024-08-16 01:03:28', status: 'Active' },
      { id: 6, name: 'SEO', createdDate: '2024-03-15 14:10:00', updatedDate: '2024-07-25 19:25:17', status: 'Active' },
      { id: 7, name: 'Content Marketing', createdDate: '2024-04-01 16:45:00', updatedDate: '2024-08-01 22:11:29', status: 'Active' },
      { id: 8, name: 'Social Media', createdDate: '2024-04-20 09:20:00', updatedDate: '2024-11-15 17:47:33', status: 'Active' },
    ],
    'authors': [
      { id: 1, name: 'Sarah Johnson', createdDate: '2023-12-15 14:30:00', updatedDate: '2024-12-18 14:45:22', status: 'Active' },
      { id: 2, name: 'Mike Davis', createdDate: '2024-01-20 10:45:00', updatedDate: '2024-12-01 22:12:33', status: 'Active' },
      { id: 3, name: 'John Doe', createdDate: '2024-02-10 16:20:00', updatedDate: '2024-11-05 16:52:11', status: 'Active' },
      { id: 4, name: 'Jane Smith', createdDate: '2024-03-05 09:15:00', updatedDate: '2024-11-20 14:17:55', status: 'Active' },
      { id: 5, name: 'Robert Wilson', createdDate: '2024-04-12 13:40:00', updatedDate: '2024-08-16 01:03:28', status: 'Active' },
      { id: 6, name: 'Emily Brown', createdDate: '2024-05-08 11:25:00', updatedDate: '2024-07-25 19:25:17', status: 'Active' },
    ],
    'url-redirects': [
      { id: 1, name: 'Old Product Page Redirect', createdDate: '2024-10-15 11:30:00', updatedDate: '2024-12-18 14:45:22', status: 'Active' },
      { id: 2, name: 'Service URL Update', createdDate: '2024-09-20 14:20:00', updatedDate: '2024-12-01 22:12:33', status: 'Active' },
      { id: 3, name: 'Promo Page Redirect', createdDate: '2024-08-10 10:45:00', updatedDate: '2024-11-05 16:52:11', status: 'Active' },
      { id: 4, name: 'Contact Page Update', createdDate: '2024-07-15 15:30:00', updatedDate: '2024-11-20 14:17:55', status: 'Active' },
      { id: 5, name: 'Legacy Content Redirect', createdDate: '2024-06-05 12:15:00', updatedDate: '2024-08-16 01:03:28', status: 'Active' },
    ],
    'hubdb-tables': [
      { id: 1, name: 'Products Database', createdDate: '2024-01-05 13:45:00', updatedDate: '2024-12-18 14:45:22', status: 'Active' },
      { id: 2, name: 'Locations', createdDate: '2024-02-15 16:30:00', updatedDate: '2024-12-01 22:12:33', status: 'Active' },
      { id: 3, name: 'Team Members', createdDate: '2024-03-20 11:20:00', updatedDate: '2024-11-05 16:52:11', status: 'Active' },
      { id: 4, name: 'Events Calendar', createdDate: '2024-04-10 14:15:00', updatedDate: '2024-11-20 14:17:55', status: 'Active' },
      { id: 5, name: 'Testimonials Database', createdDate: '2024-05-25 09:40:00', updatedDate: '2024-08-16 01:03:28', status: 'Active' },
    ],
  };

  return contentData[contentType] || [];
};

const ITEMS_PER_PAGE = 10;

interface RestoreContentProps {
  onShowLogs: () => void;
}

export function RestoreContent({ onShowLogs }: RestoreContentProps) {
  const { backups } = useBackups();
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [restoreToDraft, setRestoreToDraft] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showRestoreConfirmModal, setShowRestoreConfirmModal] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [comparisonVersions, setComparisonVersions] = useState<{current?: number, backup?: number}>({});
  const [showVersionSelectorModal, setShowVersionSelectorModal] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [lastRestoreDate, setLastRestoreDate] = useState<string | null>(null);

  const totalVersions = backups.length;
  const totalPages = Math.ceil(totalVersions / ITEMS_PER_PAGE);

  // Filter versions based on search and content type
  const filteredVersions = backups.filter(version => {
    const searchableText = (version.description || version.name || '').toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm.toLowerCase()) ||
                         version.initiatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesContentType = contentTypeFilter === 'all' || 
                              version.contentTypes.some(type => 
                                type.toLowerCase().includes(contentTypeFilter.replace('-', ' '))
                              );
    
    const matchesStatus = statusFilter === 'all' || 
                          version.status.toLowerCase().includes(statusFilter);
    
    return matchesSearch && matchesContentType && matchesStatus;
  });

  const paginatedVersions = filteredVersions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const selectedVersionData = selectedVersion ? backups.find(v => v.id === selectedVersion) : null;

  const handleVersionSelect = (versionId: number) => {
    setSelectedVersion(versionId === selectedVersion ? null : versionId);
    setSelectedItems([]); // Reset item selection when changing versions
  };

  const handleItemSelect = (itemId: number, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleFullRestore = async () => {
    if (!selectedVersion) return;
    
    setIsRestoring(true);
    
    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Set the last restore date to current time
    setLastRestoreDate(new Date().toISOString());
    
    setIsRestoring(false);
    setCanUndo(true);
    setShowRestoreConfirmModal(false);
    toast.success('Full restore completed successfully!');
  };

  const handleGranularRestore = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to restore');
      return;
    }

    setIsRestoring(true);
    
    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRestoring(false);
    setCanUndo(true);
    setShowRestoreConfirmModal(false);
    toast.success(`${selectedItems.length} items restored successfully!`);
  };

  const handleUndoRestore = async () => {
    setIsRestoring(true);
    
    // Simulate undo process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsRestoring(false);
    setCanUndo(false);
    toast.success('Last restore has been undone');
  };

  const openComparison = (currentId: number, backupId: number) => {
    setComparisonVersions({ current: currentId, backup: backupId });
    setShowComparisonModal(true);
  };

  const openVersionSelector = () => {
    setShowVersionSelectorModal(true);
    setSelectedForComparison([]);
  };

  const handleVersionComparisonSelect = (versionId: number, checked: boolean) => {
    if (checked) {
      if (selectedForComparison.length < 2) {
        setSelectedForComparison(prev => [...prev, versionId]);
      } else {
        toast.error('You can only compare up to 2 versions at a time');
      }
    } else {
      setSelectedForComparison(prev => prev.filter(id => id !== versionId));
    }
  };

  const compareSelectedVersions = () => {
    if (selectedForComparison.length === 2) {
      setComparisonVersions({ 
        current: selectedForComparison[0], 
        backup: selectedForComparison[1] 
      });
      setShowVersionSelectorModal(false);
      setShowComparisonModal(true);
    } else {
      toast.error('Please select exactly 2 versions to compare');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header */}
      

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Quick Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Last Backup</p>
                    <p className="text-lg font-semibold">
                      {backups.length > 0 ? formatGlobalDateTime(backups[0].date) : 'No backups yet'}
                    </p>
                  </div>
                  <HardDrive className="h-8 w-8 text-teal-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Last Restore</p>
                    <p className="text-lg font-semibold">
                      {lastRestoreDate ? formatGlobalDateTime(lastRestoreDate) : 'Not performed yet'}
                    </p>
                  </div>
                  <RotateCcw className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Backups</p>
                    <p className="text-lg font-semibold">{backups.length}</p>
                  </div>
                  <History className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Version History Browser */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Backup History</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Browse through your backup history and select versions to restore. Compare different versions and preview content before restoring.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search Backups..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  
                  <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="successful">Successful</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Name/Date & Time</TableHead>
                      <TableHead className="w-1/4">Status</TableHead>
                      <TableHead className="w-1/4">File Size</TableHead>
                      <TableHead className="w-1/6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedVersions.map((version) => (
                      <TableRow key={version.id}>
                        <TableCell>
                          {version.name ? (
                            <div>
                              <div className="font-medium">{version.name}</div>
                              <div className="font-mono text-sm text-gray-500">{formatGlobalDateTime(version.date)}</div>
                            </div>
                          ) : (
                            <div className="font-mono text-sm">{formatGlobalDateTime(version.date)}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={version.status === 'successful' ? 'default' : 'destructive'}
                            className={version.status === 'successful' ? 'bg-green-100 text-green-700' : ''}
                          >
                            {version.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{version.fileSize}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedVersion(version.id);
                                setShowPreviewModal(true);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview Content
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                openComparison(1, version.id);
                              }}>
                                <GitCompare className="h-4 w-4 mr-2" />
                                Compare with Current
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                openVersionSelector();
                              }}>
                                <GitCompare className="h-4 w-4 mr-2" />
                                Compare Versions
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedVersion(version.id);
                                setShowRestoreConfirmModal(true);
                              }}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Full Restore
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredVersions.length)} of {filteredVersions.length} versions
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Granular Restore Options */}
          {false && selectedVersionData && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Granular Restore Options - {selectedVersionData.version}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select specific content items to restore from the backup. Choose to restore as drafts for safety or publish directly.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="restore-to-draft"
                        checked={restoreToDraft}
                        onCheckedChange={setRestoreToDraft}
                      />
                      <Label htmlFor="restore-to-draft">Restore to Draft (Recommended)</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItems(mockRestoreItems.map(item => item.id))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedItems([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>

                {restoreToDraft && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Content will be restored as drafts to prevent overwriting live pages. Review and publish manually when ready.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedItems.length === mockRestoreItems.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedItems(mockRestoreItems.map(item => item.id));
                              } else {
                                setSelectedItems([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Content Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Path</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Changes</TableHead>
                        <TableHead>Last Modified</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRestoreItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="font-mono text-sm text-gray-600">{item.path}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                item.status === 'new' ? 'default' :
                                item.status === 'modified' ? 'secondary' : 'destructive'
                              }
                              className={
                                item.status === 'new' ? 'bg-green-100 text-green-700' :
                                item.status === 'modified' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">
                              {item.changes.slice(0, 2).join(', ')}
                              {item.changes.length > 2 && ` +${item.changes.length - 2} more`}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{formatGlobalDateTime(item.lastModified)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-600">
                    {selectedItems.length} of {mockRestoreItems.length} items selected
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowPreviewModal(true)}
                      disabled={selectedItems.length === 0}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Selected
                    </Button>
                    
                    <Button
                      onClick={() => setShowRestoreConfirmModal(true)}
                      disabled={selectedItems.length === 0 || isRestoring}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      {isRestoring ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Restoring...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Restore Selected ({selectedItems.length})
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent 
          className="modal-override"
          style={{ 
            width: '90vw',
            height: '90vh',
            maxWidth: 'none',
            maxHeight: 'none',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}
        >
          <DialogTitle className="sr-only">Content Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Preview the content records from this backup version.
          </DialogDescription>
          
          {/* Header - Fixed */}
          <div style={{ flexShrink: 0, padding: '24px', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0' }}>
                Content Preview - {selectedVersionData?.name || selectedVersionData?.version}
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0' }}>
                Preview the content records from this backup version.
              </p>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div 
            style={{ 
              flex: '1 1 0%',
              overflowY: 'auto',
              minHeight: '0',
              backgroundColor: 'white'
            }}
          >
            <div style={{ padding: '24px' }}>
              {/* Content Type Label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium">Content Type:</span>
                <span className="text-sm text-gray-600">
                  {contentTypes.find(ct => ct.value === (contentTypeFilter === 'all' ? 'website-page' : contentTypeFilter))?.label || 'Website Pages'}
                </span>
              </div>

              {/* Content Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '14.28%' }}>Name</TableHead>
                      <TableHead style={{ width: '14.28%' }}>Created Date</TableHead>
                      <TableHead style={{ width: '14.28%' }}>Updated Date</TableHead>
                      <TableHead style={{ width: '14.28%' }}>Status</TableHead>
                      <TableHead style={{ width: '14.28%' }}>Campaign</TableHead>
                      <TableHead style={{ width: '14.28%' }}>Lead Generation</TableHead>
                      <TableHead style={{ width: '14.28%' }}>Conversion Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generateMockContentForType(contentTypeFilter === 'all' ? 'website-page' : contentTypeFilter).map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium" style={{ width: '14.28%' }}>{item.name}</TableCell>
                        <TableCell className="font-mono text-sm" style={{ width: '14.28%' }}>{formatGlobalDateTime(item.createdDate)}</TableCell>
                        <TableCell className="font-mono text-sm" style={{ width: '14.28%' }}>{formatGlobalDateTime(item.updatedDate)}</TableCell>
                        <TableCell style={{ width: '14.28%' }}>
                          <Badge 
                            variant={item.status === 'Published' || item.status === 'Active' ? 'default' : item.status === 'Draft' ? 'secondary' : 'outline'} 
                            className={item.status === 'Published' || item.status === 'Active' ? 'bg-green-100 text-green-700' : item.status === 'Draft' ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell style={{ width: '14.28%' }}>{item.campaign || '-'}</TableCell>
                        <TableCell style={{ width: '14.28%' }}>{item.leadGeneration || '-'}</TableCell>
                        <TableCell style={{ width: '14.28%' }}>{item.conversionRate || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div style={{ flexShrink: 0, padding: '24px', borderTop: '1px solid #e5e7eb', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version Comparison Modal */}
      <Dialog open={showComparisonModal} onOpenChange={setShowComparisonModal}>
        <DialogContent 
          className="modal-override"
          style={{ 
            width: '90vw',
            height: '90vh',
            maxWidth: 'none',
            maxHeight: 'none',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}
        >
          <DialogTitle className="sr-only">Version Comparison</DialogTitle>
          <DialogDescription className="sr-only">
            Compare the differences between the current version and a backup version side by side.
          </DialogDescription>
          
          {/* Header - Fixed */}
          <div style={{ flexShrink: 0, padding: '24px', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0' }}>
                Version Comparison
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0' }}>
                Compare the differences between the current version and a backup version side by side.
              </p>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div 
            style={{ 
              flex: '1 1 0%',
              overflowY: 'auto',
              minHeight: '0',
              backgroundColor: 'white'
            }}
          >
            <div style={{ padding: '24px' }}>
            <div className="grid grid-cols-2 gap-4 h-full">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current Version</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {mockRestoreItems.map((item) => (
                        <div key={item.id} className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{item.name}</span>
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">{item.path}</div>
                          {item.status === 'modified' && (
                            <div className="space-y-1">
                              {item.changes.map((change, i) => (
                                <div key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                  <span className="text-blue-500 mr-1">~</span>
                                  {change}
                                </div>
                              ))}
                            </div>
                          )}
                          {item.status === 'new' && (
                            <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                              <span className="text-green-500 mr-1">+</span>
                              New content added
                            </div>
                          )}
                          {item.status === 'deleted' && (
                            <div className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                              <span className="text-red-500 mr-1">-</span>
                              Content removed
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Backup Version ({selectedVersionData?.name || selectedVersionData?.version})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {mockRestoreItems.map((item) => (
                        <div key={item.id} className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{item.name}</span>
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">{item.path}</div>
                          <div className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                            Previous version content
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div style={{ flexShrink: 0, padding: '24px', borderTop: '1px solid #e5e7eb', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="outline" onClick={() => setShowComparisonModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                // Export comparison logic
                toast.success('Comparison exported to Google Sheets');
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export Comparison
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Modal */}
      <Dialog open={showRestoreConfirmModal} onOpenChange={setShowRestoreConfirmModal}>
        <DialogContent className="max-w-2xl w-[70vw]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Confirm Restore Operation
            </DialogTitle>
            <DialogDescription>
              Review and confirm the restore operation details before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-black font-bold">
                This action will restore content from {selectedVersionData?.name || selectedVersionData?.version} ({selectedVersionData?.date}).
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-medium">Restore Summary:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Items to restore:</span>
                  <span className="ml-2 font-medium">
                    {selectedItems.length > 0 ? selectedItems.length : 'All items'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Version:</span>
                  <span className="ml-2 font-medium">{selectedVersionData?.name || selectedVersionData?.version}</span>
                </div>
                <div>
                  <span className="text-gray-600">File size:</span>
                  <span className="ml-2 font-medium">{selectedVersionData?.fileSize}</span>
                </div>
              </div>
            </div>

            {!restoreToDraft && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-600">
                  <strong>Warning:</strong> This will overwrite 3 live pages. Consider using "Restore to Draft" mode instead.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowRestoreConfirmModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={selectedItems.length > 0 ? handleGranularRestore : handleFullRestore}
                disabled={isRestoring}
                className={restoreToDraft ? 'bg-teal-600 hover:bg-teal-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Confirm Restore
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version Selector Modal for Comparison */}
      <Dialog open={showVersionSelectorModal} onOpenChange={setShowVersionSelectorModal}>
        <DialogContent 
          className="modal-override"
          style={{ 
            width: '90vw',
            height: '90vh',
            maxWidth: 'none',
            maxHeight: 'none',
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0'
          }}
        >
          <DialogTitle className="sr-only">Select Versions to Compare</DialogTitle>
          <DialogDescription className="sr-only">
            Choose exactly 2 backup versions to compare their differences side by side.
          </DialogDescription>
          
          {/* Header - Fixed */}
          <div style={{ flexShrink: 0, padding: '24px', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0' }}>
                Select Versions to Compare
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0' }}>
                Choose exactly 2 backup versions to compare their differences side by side.
              </p>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div 
            style={{ 
              flex: '1 1 0%',
              overflowY: 'auto',
              minHeight: '0',
              backgroundColor: 'white'
            }}
          >
            <div style={{ padding: '24px' }}>
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Select exactly 2 versions to compare. You can compare any two backup versions.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                {backups.map((version) => (
                  <div key={version.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedForComparison.includes(version.id)}
                        onCheckedChange={(checked) => handleVersionComparisonSelect(version.id, checked as boolean)}
                        disabled={!selectedForComparison.includes(version.id) && selectedForComparison.length >= 2}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium">
                            {version.name ? version.name : version.version}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {version.fileSize}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {version.status}
                          </Badge>
                        </div>
                        {version.name && (
                          <div className="text-xs text-gray-500 mb-1">{version.version}</div>
                        )}
                        <p className="text-sm text-gray-600 mb-2">{version.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {version.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {version.initiatedBy}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            {version.changes?.added || 0} added
                          </span>
                          <span className="text-blue-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            {version.changes?.edited || 0} edited
                          </span>
                          <span className="text-red-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            {version.changes?.deleted || 0} deleted
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 justify-end">
                          {version.contentTypes.slice(0, 2).map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {version.contentTypes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{version.contentTypes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div style={{ flexShrink: 0, padding: '24px', borderTop: '1px solid #e5e7eb', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="text-sm text-gray-600">
                {selectedForComparison.length} of 2 versions selected
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="outline" onClick={() => setShowVersionSelectorModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={compareSelectedVersions}
                  disabled={selectedForComparison.length !== 2}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare Selected Versions
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}