import { useState } from 'react';
import { RefreshCw, FileText, Eye, Edit, CheckCircle, AlertCircle, Info, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, XCircle } from 'lucide-react';
import { formatTableDateTime } from '../utils/dateFormat';
import { Button } from './ui/button';

import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useLogs, LogEntry } from './LogsContext';
import { LogDetailsModal } from './LogDetailsModal';
import { ActivityLogDetailsModal } from './ActivityLogDetailsModal';
import { LogDownloadEmailCard } from './LogDownloadEmailCard';
import { StatusBadgeSimple } from './StatusBadgeSimple';
import { MultiSelectFilter } from './MultiSelectFilter';

export function LogsPage({ onClose }: { onClose: () => void }) {
  // Unified filters for all logs
  const [actionFilter, setActionFilter] = useState<string[]>(['all-actions']);
  const [resourceFilter, setResourceFilter] = useState<string[]>(['all-resources']);
  const [statusFilter, setStatusFilter] = useState<string[]>(['all-status']);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  
  const { logs, getLogsByType, clearLogs } = useLogs();

  // Filter options
  const actionOptions = [
    { value: 'all-actions', label: 'All Actions' },
    { value: 'update', label: 'Update' },
    { value: 'export', label: 'Export' },
    { value: 'import', label: 'Import' }
  ];

  const resourceOptions = [
    { value: 'all-resources', label: 'All Resources' },
    { value: 'website-pages', label: 'Website Pages' },
    { value: 'landing-pages', label: 'Landing Pages' },
    { value: 'blog-posts', label: 'Blog Posts' },
    { value: 'blogs', label: 'Blogs' },
    { value: 'tags', label: 'Tags' },
    { value: 'authors', label: 'Authors' },
    { value: 'url-redirects', label: 'URL Redirects' },
    { value: 'hubdb-tables', label: 'HubDB Tables' }
  ];

  const statusOptions = [
    { value: 'all-status', label: 'All Status' },
    { value: 'success', label: 'Success' },
    { value: 'error', label: 'Error' }
  ];

  const handleRefresh = () => {
    // Reset all filters and selections
    setActionFilter(['all-actions']);
    setResourceFilter(['all-resources']);
    setStatusFilter(['all-status']);
    setSortOrder('none');
  };

  const handleClearFilters = () => {
    setActionFilter(['all-actions']);
    setResourceFilter(['all-resources']);
    setStatusFilter(['all-status']);
    setSortOrder('none');
  };

  const handleDateSort = () => {
    setSortOrder(prev => {
      if (prev === 'none') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'none';
    });
  };

  const getSortIcon = (sortOrder: 'none' | 'asc' | 'desc') => {
    switch (sortOrder) {
      case 'asc':
        return <ArrowUp className="h-4 w-4 text-blue-600" />;
      case 'desc':
        return <ArrowDown className="h-4 w-4 text-blue-600" />;
      default:
        return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
  };

  const hasFilters = !actionFilter.includes('all-actions') || 
    !resourceFilter.includes('all-resources') || 
    !statusFilter.includes('all-status');

  const getStatusIcon = (status: LogEntry['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get all logs from all types
  const getAllLogs = () => {
    const activityLogs = getLogsByType('activity');
    const hubspotLogs = getLogsByType('hubspot');
    const bulkEditLogs = getLogsByType('bulk-edit');
    
    return [...activityLogs, ...hubspotLogs, ...bulkEditLogs];
  };

  const filterLogs = (logs: LogEntry[]) => {
    const filtered = logs.filter(log => {
      const matchesAction = actionFilter.includes('all-actions') || actionFilter.includes(log.action);
      const matchesResource = resourceFilter.includes('all-resources') || resourceFilter.includes(log.resource);
      const matchesStatus = statusFilter.includes('all-status') || statusFilter.includes(log.status);
      
      return matchesAction && matchesResource && matchesStatus;
    });

    // Apply sorting
    if (sortOrder === 'none') {
      return filtered;
    }
    
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const UnifiedLogTable = ({ logs, hasFilters }: { 
    logs: LogEntry[], 
    hasFilters: boolean
  }) => {
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const filteredLogs = filterLogs(logs);
    
    // Calculate status counts for filtered logs
    const statusCounts = filteredLogs.reduce((counts, log) => {
      counts[log.status] = (counts[log.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const handleViewDetails = (log: LogEntry) => {
      setSelectedLog(log);
      setIsModalOpen(true);
    };

    const StatusBadgeWithCount = ({ 
      status, 
      count,
      allLogs 
    }: { 
      status: LogEntry['status'], 
      count: number,
      allLogs: LogEntry[]
    }) => {
      const variants = {
        success: 'bg-green-100 text-green-800 border-green-200',
        error: 'bg-red-100 text-red-800 border-red-200'
      };

      // Calculate statistics based on the clicked status (filter logs by the current status)
      const statusFilteredLogs = allLogs.filter(log => log.status === status);
      const totalRecords = statusFilteredLogs.length;
      const allStatusCounts = statusFilteredLogs.reduce((counts, log) => {
        counts[log.status] = (counts[log.status] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);

      const successCount = allStatusCounts.success || 0;
      const errorCount = allStatusCounts.error || 0;
      const failureCount = errorCount; // Failures = Errors only

      const getStatusTitle = (status: string) => {
        switch (status) {
          case 'success': return 'Success Statistics';
          case 'error': return 'Error Statistics';
          default: return 'Status Statistics';
        }
      };

      const getStatusDescription = (status: string) => {
        switch (status) {
          case 'success': return 'Operations completed successfully';
          case 'error': return 'Operations that failed with errors';
          default: return 'Status information';
        }
      };

      return (
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <Badge variant="secondary" className={`${variants[status]} border flex items-center gap-1 text-xs`}>
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                <ChevronDown className="h-3 w-3" />
              </Badge>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="center">
            <div className="p-4">
              {/* Header */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(status)}
                  <h4 className="font-medium text-gray-900">{getStatusTitle(status)}</h4>
                </div>
                <p className="text-xs text-gray-600">{getStatusDescription(status)}</p>
              </div>

              {/* Statistics Grid - ORIGINAL UI STRUCTURE */}
              <div className="space-y-3">
                {/* Total Records */}
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Total Records</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{totalRecords}</span>
                </div>

                {/* Success */}
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Success</span>
                  </div>
                  <span className="text-sm font-bold text-green-800">{successCount}</span>
                </div>

                {/* Total Failures (Errors + Warnings) */}
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Total Failures</span>
                  </div>
                  <span className="text-sm font-bold text-red-800">{failureCount}</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    };

    
    if (filteredLogs.length === 0) {
      return (
        <div className="p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {hasFilters ? 'No matching logs found' : 'No Logs'}
          </h4>
          <p className="text-gray-600">
            {hasFilters ? 'Try adjusting your filters' : 'No system activities recorded yet'}
          </p>
        </div>
      );
    }

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center font-bold">Resource</TableHead>
              <TableHead className="text-center font-bold">Action</TableHead>
              <TableHead className="text-center font-bold">
                <div 
                  className="flex items-center justify-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={handleDateSort}
                >
                  Date/Time
                  {getSortIcon(sortOrder)}
                </div>
              </TableHead>
              <TableHead className="text-center font-bold">Status</TableHead>
              <TableHead className="text-center font-bold">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-center">
                  <span className="capitalize text-sm text-gray-700">{log.resource.replace('-', ' ')}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="capitalize text-sm font-medium text-gray-900">{log.action}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="text-xs text-gray-500">
                    {formatTableDateTime(log.timestamp)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <StatusBadgeWithCount 
                      status={log.status} 
                      count={statusCounts[log.status] || 0}
                      allLogs={filteredLogs}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDetails(log)}
                    className="h-8 px-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Use appropriate modal based on action type */}
        {selectedLog?.action === 'import' || selectedLog?.action === 'update' || selectedLog?.action === 'export' ? (
          <LogDownloadEmailCard 
            log={selectedLog}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        ) : selectedLog?.type === 'activity' ? (
          <ActivityLogDetailsModal 
            log={selectedLog}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <LogDetailsModal 
            log={selectedLog}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </>
    );
  };

  const allLogs = getAllLogs();

  return (
    <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6">
          {/* Page Header */}
          

          {/* Log Section */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            {/* Log Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Main Log Section */}
                <div className="border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">Logs</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View all system activities, HubSpot operations, and bulk editing actions in one unified view. Use filters to find specific log entries.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center gap-2">
                        
                      </div>
                    </div>
                  </div>

                  {/* Unified Filters */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-4 flex-wrap justify-start">
                      {/* Action Filter */}
                      <MultiSelectFilter
                        options={actionOptions}
                        selectedValues={actionFilter}
                        onSelectionChange={setActionFilter}
                        placeholder="All Actions"
                        className="w-40"
                        allKey="all-actions"
                      />

                      {/* Resource Filter */}
                      <MultiSelectFilter
                        options={resourceOptions}
                        selectedValues={resourceFilter}
                        onSelectionChange={setResourceFilter}
                        placeholder="All Resources"
                        className="w-44"
                        allKey="all-resources"
                      />

                      {/* Status Filter */}
                      <MultiSelectFilter
                        options={statusOptions}
                        selectedValues={statusFilter}
                        onSelectionChange={setStatusFilter}
                        placeholder="All Status"
                        className="w-32"
                        allKey="all-status"
                      />

                      {/* Clear Filters */}
                      {hasFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearFilters}
                          className="h-9 px-3 text-sm"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Table Content */}
                  <div className="overflow-hidden">
                    <UnifiedLogTable logs={allLogs} hasFilters={hasFilters} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}