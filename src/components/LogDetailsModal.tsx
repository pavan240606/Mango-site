import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { formatTableDateTime } from '../utils/dateFormat';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { LogEntry } from './LogsContext';
import { 
  Activity, 
  Database, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download,
  Edit,
  Plus,
  Trash2,
  Upload,
  Zap,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from './ui/button';

interface LogDetailsModalProps {
  log: LogEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

interface RecordChange {
  id: string;
  recordName: string;
  changes: {
    field: string;
    previousValue: string;
    newValue: string;
  }[];
}

export function LogDetailsModal({ log, isOpen, onClose }: LogDetailsModalProps) {
  if (!log) return null;

  // Removed old formatting function - using global utility instead

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Info className="h-5 w-5 text-blue-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'export': return <Download className="h-5 w-5 text-blue-600" />;
      case 'import': return <Upload className="h-5 w-5 text-green-600" />;
      case 'create': return <Plus className="h-5 w-5 text-purple-600" />;
      case 'update': return <Edit className="h-5 w-5 text-amber-600" />;
      case 'delete': return <Trash2 className="h-5 w-5 text-red-600" />;
      case 'sync': return <Zap className="h-5 w-5 text-indigo-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getResourceIcon = (resource: string) => {
    switch (resource) {
      case 'landing-pages':
      case 'website-pages':
      case 'blog-posts':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'hubdb-tables':
        return <Database className="h-5 w-5 text-indigo-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatResourceName = (resource: string) => {
    return resource
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderMetadataItem = (key: string, value: any) => {
    if (value === null || value === undefined) return null;
    
    let displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    let displayValue = String(value);
    
    // Handle special cases
    if (key === 'count' || key.includes('Count')) {
      displayKey = key.includes('success') ? 'Successful Records' :
                   key.includes('failed') || key.includes('error') ? 'Failed Records' :
                   key.includes('warning') ? 'Warnings' :
                   key.includes('skipped') ? 'Skipped Records' :
                   key.includes('deleted') ? 'Deleted Records' :
                   key.includes('affected') ? 'Affected Records' :
                   key.includes('selected') ? 'Selected Records' :
                   'Total Records';
    }
    
    if (key === 'field') displayKey = 'Field Updated';
    if (key === 'value') displayKey = 'New Value';
    if (key === 'invalidTags') displayKey = 'Invalid Tag IDs';
    if (key === 'format') displayKey = 'File Format';
    
    return (
      <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
        <span className="text-sm font-medium text-gray-600">{displayKey}</span>
        <span className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
          {Array.isArray(value) ? value.join(', ') : displayValue}
        </span>
      </div>
    );
  };

  // Handle export functionality for bulk edit error logs  
  const handleExportErrors = () => {
    const errorData = [{
      Timestamp: formatTableDateTime(log.timestamp),
      Action: log.action,
      Resource: formatResourceName(log.resource),
      Status: log.status,
      ErrorDetails: log.details || log.message || 'No error details available',
      Field: log.metadata?.field || 'N/A',
      InvalidData: log.metadata?.invalidTags ? log.metadata.invalidTags.join(', ') : 'N/A',
      SelectedRecords: log.metadata?.selectedCount || 'N/A',
      SuccessfulRecords: log.metadata?.successCount || 'N/A',
      FailedRecords: log.metadata?.failedCount || 'N/A',
      TechnicalInfo: log.metadata ? Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join('; ') : 'N/A'
    }];

    const headers = ['Timestamp', 'Action', 'Resource', 'Status', 'Error Details', 'Field', 'Invalid Data', 'Selected Records', 'Successful Records', 'Failed Records', 'Technical Info'];
    const csvContent = [
      headers.join(','),
      ...errorData.map(row => [
        `"${row.Timestamp}"`,
        `"${row.Action}"`,
        `"${row.Resource}"`,
        `"${row.Status}"`,
        `"${row.ErrorDetails}"`,
        `"${row.Field}"`,
        `"${row.InvalidData}"`,
        `"${row.SelectedRecords}"`,
        `"${row.SuccessfulRecords}"`,
        `"${row.FailedRecords}"`,
        `"${row.TechnicalInfo}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bulk-edit-error-${log.action}-${log.resource}-${formatDateTime(log.timestamp).replace(/[/:]/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 p-8 pb-6 border-b border-gray-200">
            <DialogTitle className="text-2xl font-semibold mb-2">Bulk Edit Log Details</DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              View detailed information about this bulk edit operation including status, technical details, and metadata.
            </DialogDescription>
            
            {/* Activity Logs Style Cards - Exact Same as Image */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-4 gap-6">
                {/* Status Card */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(log.status)}
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{log.status}</p>
                </div>

                {/* Action Card */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getActionIcon(log.action)}
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Action</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{log.action}</p>
                </div>

                {/* Resource Card */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getResourceIcon(log.resource)}
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Resource</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{formatResourceName(log.resource)}</p>
                </div>

                {/* When Card */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">When</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatTableDateTime(log.timestamp)}</p>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="modal-scrollable px-8 pb-8">
            <div className="space-y-6 mt-6">
            {/* Error Details */}
            {log.status === 'error' && (
              <div className="bg-[rgba(254,242,242,1)] border border-red-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">Error Details</h3>
                    </div>
                  </div>
                  {/* Export Button - Only for Bulk Edit Error Logs */}
                  <Button 
                    onClick={handleExportErrors}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Errors
                  </Button>
                </div>
                <div className="pl-8">
                  
                  
                  {/* Detailed Error Records */}
                  <div className="mt-4">
                    <h4 className="font-medium text-red-900 mb-3">Failed Records Details:</h4>
                    <div className="border border-red-200 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-red-50">
                            <TableHead className="text-red-900 font-medium">Page Name</TableHead>
                            <TableHead className="text-red-900 font-medium">Error</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            const errorRecords = [];
                            
                            // Generate relevant error records based on action and resource
                            if (log.action === 'update' && log.resource === 'blog-posts' && log.metadata?.invalidTags) {
                              const selectedCount = log.metadata?.selectedCount || 8;
                              for (let i = 1; i <= Math.min(selectedCount, 6); i++) {
                                errorRecords.push({
                                  id: `BP-${String(i).padStart(3, '0')}`,
                                  name: `Blog Post ${i} - ${['Advanced SEO Guide', 'Content Marketing Tips', 'Digital Analytics', 'Growth Strategies', 'Marketing Automation', 'Social Media'][i-1]}`,
                                  error: i <= 3 ? `Invalid tag ID: ${log.metadata.invalidTags[i-1] || '999'}` : 'Validation failed',
                                  field: log.metadata?.field || 'tagIds',
                                  attemptedValue: i <= 3 ? `${log.metadata.invalidTags[i-1] || '999'}` : 'Invalid data format'
                                });
                              }
                            } else if (log.action === 'update' && log.resource === 'landing-pages') {
                              const failedCount = log.metadata?.failedCount || 3;
                              for (let i = 1; i <= Math.min(failedCount, 4); i++) {
                                errorRecords.push({
                                  id: `LP-${String(i).padStart(3, '0')}`,
                                  name: `Landing Page ${i} - ${['Product Demo', 'Free Trial', 'Newsletter', 'Webinar'][i-1]}`,
                                  error: ['Permission denied - page is locked', 'Invalid meta description length', 'Required field missing', 'Template conflict'][i-1],
                                  field: 'metaDescription',
                                  attemptedValue: 'New meta description that exceeds character limit...'
                                });
                              }
                            } else if (log.action === 'update' && log.resource === 'website-pages') {
                              const failedCount = log.metadata?.failedCount || 2;
                              for (let i = 1; i <= Math.min(failedCount, 3); i++) {
                                errorRecords.push({
                                  id: `WP-${String(i).padStart(3, '0')}`,
                                  name: `Website Page ${i} - ${['About Us', 'Contact', 'Services'][i-1]}`,
                                  error: ['Page is currently being edited by another user', 'Invalid date format', 'Required approval for changes'][i-1],
                                  field: log.metadata?.field || 'publishDate',
                                  attemptedValue: ['2024-13-45', 'invalid-date', '2024/15/30'][i-1]
                                });
                              }
                            }
                            
                            return errorRecords.map((record, index) => (
                              <TableRow key={index} className="hover:bg-red-50">
                                <TableCell className="font-medium text-red-900">{record.name}</TableCell>
                                <TableCell className="text-red-600 text-sm">{record.error}</TableCell>
                              </TableRow>
                            ));
                          })()}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warning Details */}
            {log.status === 'warning' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Warning Details</h3>
                    <p className="text-yellow-800 leading-relaxed">
                      {log.details || log.message}
                    </p>
                    {log.metadata?.warningCount && (
                      <p className="text-yellow-700 mt-2 text-sm">
                        {log.metadata.warningCount} warnings encountered
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success Records */}
            {log.status === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Successfully Updated Records</h3>
                    <p className="text-green-800 text-sm mb-4">
                      {log.metadata?.affectedPages || log.metadata?.successCount || log.metadata?.count || 25} records were successfully processed
                    </p>
                  </div>
                </div>
                
                <div className="border border-green-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-50">
                        <TableHead className="text-green-900 font-medium">Name</TableHead>
                        <TableHead className="text-green-900 font-medium">Old Value</TableHead>
                        <TableHead className="text-green-900 font-medium">New Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const records = [];
                        
                        // Always generate 25 records for demonstration
                        const recordCount = 25;
                        
                        if (log.action === 'update' && log.resource === 'landing-pages') {
                          const fields = ['metaDescription', 'title', 'publishDate', 'author', 'tags', 'slug', 'template', 'keywords', 'socialImage', 'canonicalUrl'];
                          const pages = ['Q1 Campaign', 'Product Launch', 'Newsletter Signup', 'Free Trial', 'Demo Request', 'Webinar Registration', 'Ebook Download', 'Contact Sales', 'Product Demo', 'Case Study'];
                          
                          for (let i = 1; i <= recordCount; i++) {
                            const field = fields[i % fields.length];
                            const pageName = pages[i % pages.length];
                            let oldValue, newValue;
                            
                            switch (field) {
                              case 'metaDescription':
                                oldValue = 'Previous meta description';
                                newValue = 'Optimized meta description for better SEO performance';
                                break;
                              case 'title':
                                oldValue = `Old ${pageName} Title`;
                                newValue = `New ${pageName} Title - Updated`;
                                break;
                              case 'publishDate':
                                oldValue = '2024-01-15';
                                newValue = '2024-02-01';
                                break;
                              case 'author':
                                oldValue = 'John Smith';
                                newValue = 'Sarah Johnson';
                                break;
                              case 'tags':
                                oldValue = 'marketing, landing';
                                newValue = 'marketing, landing, conversion, campaign';
                                break;
                              case 'slug':
                                oldValue = `/old-${pageName.toLowerCase().replace(/\s+/g, '-')}`;
                                newValue = `/new-${pageName.toLowerCase().replace(/\s+/g, '-')}`;
                                break;
                              case 'template':
                                oldValue = 'template_v1';
                                newValue = 'template_v2';
                                break;
                              case 'keywords':
                                oldValue = 'basic keywords';
                                newValue = 'optimized, targeted, keywords, seo';
                                break;
                              case 'socialImage':
                                oldValue = 'old-social-image.jpg';
                                newValue = 'new-social-image-2024.jpg';
                                break;
                              case 'canonicalUrl':
                                oldValue = 'https://old-domain.com/page';
                                newValue = 'https://new-domain.com/page';
                                break;
                            }
                            
                            records.push({
                              name: `${pageName} Landing Page - ${field}`,
                              oldValue,
                              newValue
                            });
                          }
                        } else if (log.action === 'update' && log.resource === 'blog-posts') {
                          const fields = ['tagIds', 'title', 'metaDescription', 'publishDate', 'featuredImage', 'categories', 'author', 'slug', 'excerpt', 'keywords'];
                          const posts = ['SEO Best Practices', 'Content Marketing', 'Digital Strategy', 'Analytics Guide', 'Growth Hacking', 'Social Media', 'Email Marketing', 'Conversion Tips', 'UX Design', 'Marketing Automation'];
                          
                          for (let i = 1; i <= recordCount; i++) {
                            const field = fields[i % fields.length];
                            const postName = posts[i % posts.length];
                            let oldValue, newValue;
                            
                            switch (field) {
                              case 'tagIds':
                                oldValue = 'marketing, content';
                                newValue = 'marketing, content, seo, strategy, digital';
                                break;
                              case 'title':
                                oldValue = `${postName} - Original Title`;
                                newValue = `${postName} - Updated Title 2024`;
                                break;
                              case 'metaDescription':
                                oldValue = 'Original meta description';
                                newValue = 'Enhanced meta description with targeted keywords';
                                break;
                              case 'publishDate':
                                oldValue = '2024-01-10';
                                newValue = '2024-02-15';
                                break;
                              case 'featuredImage':
                                oldValue = 'old-featured-image.jpg';
                                newValue = 'new-featured-image-2024.jpg';
                                break;
                              case 'categories':
                                oldValue = 'General';
                                newValue = 'Marketing, Strategy';
                                break;
                              case 'author':
                                oldValue = 'Original Author';
                                newValue = 'Updated Author';
                                break;
                              case 'slug':
                                oldValue = `/blog/old-${postName.toLowerCase().replace(/\s+/g, '-')}`;
                                newValue = `/blog/new-${postName.toLowerCase().replace(/\s+/g, '-')}`;
                                break;
                              case 'excerpt':
                                oldValue = 'Original excerpt text...';
                                newValue = 'Updated excerpt with better hook...';
                                break;
                              case 'keywords':
                                oldValue = 'basic, keywords';
                                newValue = 'targeted, seo, keywords, optimization';
                                break;
                            }
                            
                            records.push({
                              name: `${postName} - ${field}`,
                              oldValue,
                              newValue
                            });
                          }
                        } else if (log.action === 'update' && log.resource === 'website-pages') {
                          const fields = ['publishDate', 'title', 'metaDescription', 'content', 'template', 'navigation', 'footer', 'header', 'sidebar', 'canonical'];
                          const pages = ['About Us', 'Contact', 'Services', 'Portfolio', 'Team', 'Careers', 'Privacy Policy', 'Terms', 'FAQ', 'Support'];
                          
                          for (let i = 1; i <= recordCount; i++) {
                            const field = fields[i % fields.length];
                            const pageName = pages[i % pages.length];
                            let oldValue, newValue;
                            
                            switch (field) {
                              case 'publishDate':
                                oldValue = '2024-01-15';
                                newValue = '2024-02-01';
                                break;
                              case 'title':
                                oldValue = `${pageName} - Old Title`;
                                newValue = `${pageName} - Updated Title`;
                                break;
                              case 'metaDescription':
                                oldValue = 'Old meta description';
                                newValue = 'Updated meta description for better SEO';
                                break;
                              case 'content':
                                oldValue = 'Original page content...';
                                newValue = 'Updated page content with improvements...';
                                break;
                              case 'template':
                                oldValue = 'old_template_v1';
                                newValue = 'new_template_v2';
                                break;
                              case 'navigation':
                                oldValue = 'Standard Nav';
                                newValue = 'Enhanced Navigation';
                                break;
                              case 'footer':
                                oldValue = 'Basic Footer';
                                newValue = 'Enhanced Footer with Links';
                                break;
                              case 'header':
                                oldValue = 'Standard Header';
                                newValue = 'Updated Header Design';
                                break;
                              case 'sidebar':
                                oldValue = 'Basic Sidebar';
                                newValue = 'Enhanced Sidebar Content';
                                break;
                              case 'canonical':
                                oldValue = 'https://old-url.com/page';
                                newValue = 'https://new-url.com/page';
                                break;
                            }
                            
                            records.push({
                              name: `${pageName} Page - ${field}`,
                              oldValue,
                              newValue
                            });
                          }
                        }
                        
                        return records.slice(0, 25).map((record, index) => (
                          <TableRow key={index} className="hover:bg-green-50">
                            <TableCell className="font-medium text-green-900">{record.name}</TableCell>
                            <TableCell className="text-red-600 text-sm">{record.oldValue}</TableCell>
                            <TableCell className="text-green-600 text-sm">{record.newValue}</TableCell>
                          </TableRow>
                        ));
                      })()}
                    </TableBody>
                  </Table>
                  
                  <div className="bg-green-50 border-t border-green-200 p-3 text-center">
                    <span className="text-sm text-green-700 font-medium">
                      25 records were successfully processed
                    </span>
                  </div>
                </div>
              </div>
            )}

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}