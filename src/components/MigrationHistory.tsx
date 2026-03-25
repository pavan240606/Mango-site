import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  History, 
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';

interface MigrationRecord {
  id: string;
  project: string;
  description: string;
  source: string;
  destination: string;
  status: 'Completed' | 'In progress' | 'Failed';
  date: string;
}

const historyData: MigrationRecord[] = [
  {
    id: '1',
    project: 'Website Replatform 2026',
    description: 'Migrating legacy WordPress blog ...',
    source: 'WP Blog Production',
    destination: 'Contentful Master',
    status: 'Completed',
    date: '15/01/2026'
  },
  {
    id: '2',
    project: 'Landing Page Sync',
    description: 'HubSpot to Contentstack migration',
    source: 'HubSpot Marketing',
    destination: 'Strapi Cloud',
    status: 'In progress',
    date: '03/02/2026'
  },
  {
    id: '3',
    project: 'Database Backup Migration',
    description: 'No description',
    source: 'Contentful Master',
    destination: 'Strapi Cloud',
    status: 'Failed',
    date: '28/01/2026'
  },
  {
    id: '4',
    project: 'Product Catalog Import',
    description: 'Strapi to WordPress migration',
    source: 'Strapi Cloud',
    destination: 'WP Blog Production',
    status: 'In progress',
    date: '03/02/2026'
  },
  {
    id: '5',
    project: 'Resource Library Migration',
    description: 'Sanity to Contentful migration',
    source: 'Sanity IO',
    destination: 'Contentful Master',
    status: 'In progress',
    date: '03/02/2026'
  }
];

export function MigrationHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700 hover:bg-green-100 border-none';
      case 'In progress':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-none';
      case 'Failed':
        return 'bg-red-100 text-red-700 hover:bg-red-100 border-none';
      default:
        return 'bg-gray-100 text-gray-700 border-none';
    }
  };

  const filteredData = useMemo(() => {
    return historyData.filter(item => {
      const matchesSearch = item.project.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.destination.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = !statusFilter || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="h-9 w-9 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 border border-gray-100">
            <History className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Migration History</h1>
        </div>

        {/* Toolbar */}
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10 h-10 border-gray-200 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`h-10 border-gray-200 gap-2 font-medium ${statusFilter ? 'bg-teal-50 border-teal-200 text-teal-700' : ''}`}>
                  <Filter className="h-4 w-4" />
                  {statusFilter ? `Status: ${statusFilter}` : 'Filters'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1.5">Filter by Status</DropdownMenuLabel>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter(null)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  All Statuses
                  {!statusFilter && <Check className="h-3.5 w-3.5 text-teal-600" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setStatusFilter('Completed')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  Completed
                  {statusFilter === 'Completed' && <Check className="h-3.5 w-3.5 text-teal-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter('In progress')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  In Progress
                  {statusFilter === 'In progress' && <Check className="h-3.5 w-3.5 text-teal-600" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setStatusFilter('Failed')}
                  className="flex items-center justify-between cursor-pointer"
                >
                  Failed
                  {statusFilter === 'Failed' && <Check className="h-3.5 w-3.5 text-teal-600" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {statusFilter && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setStatusFilter(null)}
                className="h-10 text-gray-400 hover:text-gray-600 px-2"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}

            <Button variant="outline" className="h-10 border-gray-200 gap-2 font-medium">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Project</th>
                <th className="text-left py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Route</th>
                <th className="text-left py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <tr key={record.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-gray-900">{record.project}</div>
                        <div className="text-xs text-gray-400">{record.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                        <span>{record.source}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-300" />
                        <span>{record.destination}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${getStatusStyles(record.status)}`}>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-sm font-medium text-gray-500">{record.date}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <Search className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">No migrations found</p>
                        <p className="text-xs text-gray-500">Try adjusting your filters or search terms.</p>
                      </div>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter(null);
                        }}
                        className="text-teal-600 text-xs font-semibold"
                      >
                        Clear all filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
