import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { LogEntry } from './LogsContext';
import { formatTableDateTime } from '../utils/dateFormat';
import { 
  Activity, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  FileText,
  Database,
  Upload,
  Download,
  Edit,
  Plus,
  Trash2,
  Zap,
  AlertCircle
} from 'lucide-react';

interface ActivityLogDetailsModalProps {
  log: LogEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivityLogDetailsModal({ log, isOpen, onClose }: ActivityLogDetailsModalProps) {
  if (!log) return null;

  // Removed old formatting function - using global utility instead

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
                   'Total Records';
    }
    
    if (key === 'format') displayKey = 'File Format';
    if (key === 'pageId') displayKey = 'Page ID';
    if (key === 'tableId') displayKey = 'Table ID';
    if (key === 'url') displayKey = 'Page URL';
    if (key === 'hubspotPortal') displayKey = 'HubSpot Portal';
    
    return (
      <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
        <span className="text-sm font-medium text-gray-600">{displayKey}</span>
        <span className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
          {displayValue}
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 p-8 pb-6 border-b border-gray-200">
            <DialogTitle className="text-2xl font-semibold mb-2">Activity Log Details</DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              View detailed information about this {log.type} log entry including status, technical details, and metadata.
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className={`flex items-start ${log.type === 'hubspot' ? 'justify-between mb-4' : 'gap-3'}`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">Error Details</h3>
                    </div>
                  </div>
                  {/* Export Button - Only for HubSpot Error Logs */}
                  {log.type === 'hubspot' && (
                    <Button 
                      onClick={() => {
                        // Export HubSpot error details as CSV
                        const errorData = [{
                          Timestamp: formatTableDateTime(log.timestamp),
                          Action: log.action,
                          Resource: formatResourceName(log.resource),
                          Status: log.status,
                          ErrorDetails: log.details || log.message || 'No error details available',
                          ErrorCode: log.metadata?.errorCode || 'N/A',
                          HubSpotPortal: log.metadata?.hubspotPortal || 'N/A',
                          AffectedRecords: log.metadata?.count || log.metadata?.affectedPages || log.metadata?.failedCount || 'N/A',
                          SuccessfulRecords: log.metadata?.successCount || 'N/A',
                          TechnicalInfo: log.metadata ? Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join('; ') : 'N/A'
                        }];

                        const headers = ['Timestamp', 'Action', 'Resource', 'Status', 'Error Details', 'Error Code', 'HubSpot Portal', 'Affected Records', 'Successful Records', 'Technical Info'];
                        const csvContent = [
                          headers.join(','),
                          ...errorData.map(row => [
                            `"${row.Timestamp}"`,
                            `"${row.Action}"`,
                            `"${row.Resource}"`,
                            `"${row.Status}"`,
                            `"${row.ErrorDetails}"`,
                            `"${row.ErrorCode}"`,
                            `"${row.HubSpotPortal}"`,
                            `"${row.AffectedRecords}"`,
                            `"${row.SuccessfulRecords}"`,
                            `"${row.TechnicalInfo}"`
                          ].join(','))
                        ].join('\n');

                        const blob = new Blob([csvContent], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `hubspot-error-${log.action}-${log.resource}-${formatTableDateTime(log.timestamp).replace(/[/:]/g, '-')}.csv`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export Errors
                    </Button>
                  )}
                </div>
                <div className={log.type === 'hubspot' ? 'pl-8' : ''}>
                  <p className="text-red-800 leading-relaxed mb-4">
                    {log.details || log.message}
                  </p>
                  
                  {/* Detailed Error Records */}
                  <div className="mt-4">
                    <h4 className="font-medium text-red-900 mb-3">Error Details:</h4>
                    <div className="border border-red-200 rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-red-50">
                            <TableHead className="text-red-900 font-medium">Row</TableHead>
                            <TableHead className="text-red-900 font-medium">Record Name</TableHead>
                            <TableHead className="text-red-900 font-medium">Error</TableHead>
                            <TableHead className="text-red-900 font-medium">Severity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(() => {
                            const errorRecords = [];
                            
                            // Generate relevant error records based on action and resource
                            if (log.action === 'import') {
                              if (log.resource === 'blog-posts') {
                                errorRecords.push(
                                  {
                                    row: 15,
                                    record: 'Advanced SEO Techniques Blog Post',
                                    error: 'Missing required field "title"',
                                    severity: 'critical'
                                  },
                                  {
                                    row: 23,
                                    record: 'Content Marketing Strategy Guide',
                                    error: 'Invalid date format for "publish_date"',
                                    severity: 'critical'
                                  },
                                  {
                                    row: 31,
                                    record: 'Digital Marketing Trends',
                                    error: 'Author ID does not exist',
                                    severity: 'warning'
                                  }
                                );
                              } else if (log.resource === 'tags') {
                                log.metadata?.duplicates?.forEach((tagName, index) => {
                                  errorRecords.push({
                                    row: (index + 1) * 5,
                                    record: `Tag: ${tagName}`,
                                    error: 'Duplicate tag name found',
                                    severity: 'critical'
                                  });
                                });
                              } else if (log.resource === 'landing-pages') {
                                errorRecords.push(
                                  {
                                    row: 8,
                                    record: 'Product Demo Landing Page',
                                    error: 'Template reference not found',
                                    severity: 'warning'
                                  },
                                  {
                                    row: 12,
                                    record: 'Free Trial Signup Page',
                                    error: 'Invalid URL slug format',
                                    severity: 'critical'
                                  }
                                );
                              }
                            } else if (log.action === 'export' && log.resource === 'tags') {
                              errorRecords.push({
                                row: 'N/A',
                                record: 'Tag Export Operation',
                                error: 'Database connection timeout after 30 seconds',
                                severity: 'critical'
                              });
                            } else if (log.action === 'import' && log.type === 'hubspot') {
                              errorRecords.push({
                                row: 'N/A',
                                record: 'HubSpot API Request',
                                error: `Rate limit exceeded for portal ${log.metadata?.hubspotPortal}`,
                                severity: 'critical'
                              });
                            }
                            
                            return errorRecords.map((error, index) => (
                              <TableRow key={index} className="hover:bg-red-50">
                                <TableCell className="font-mono text-sm text-red-700">
                                  {error.row !== 'N/A' ? error.row : '—'}
                                </TableCell>
                                <TableCell className="font-medium text-red-900">{error.record}</TableCell>
                                <TableCell className="text-red-600 text-sm">{error.error}</TableCell>
                                <TableCell>
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    error.severity === 'critical' 
                                      ? 'bg-red-200 text-red-800' 
                                      : 'bg-yellow-200 text-yellow-800'
                                  }`}>
                                    {error.severity}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ));
                          })()}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  {log.metadata?.errorCode && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                      <p className="text-red-700 text-sm font-medium mb-1">Error Code:</p>
                      <p className="text-red-800 text-sm font-mono">{log.metadata.errorCode}</p>
                      {log.metadata?.hubspotPortal && (
                        <p className="text-red-600 text-xs mt-2">HubSpot Portal: {log.metadata.hubspotPortal}</p>
                      )}
                    </div>
                  )}
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
                    <h3 className="font-semibold text-green-900 mb-2">
                      Successfully {log.action === 'export' ? 'Exported' : log.action === 'import' ? 'Imported' : 'Updated'} Records
                    </h3>
                    <p className="text-green-800 text-sm mb-4">
                      {log.metadata?.count || log.metadata?.successCount || log.metadata?.exportedCount || 0} records were successfully processed
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
                        
                        if (log.action === 'export') {
                          // For exports, show what data was included in the export
                          const exportFields = ['title', 'url', 'metaDescription', 'publishDate', 'author', 'tags', 'status', 'lastModified', 'views', 'template'];
                          
                          if (log.resource === 'landing-pages') {
                            const pages = ['Q1 Campaign', 'Product Launch', 'Newsletter Signup', 'Free Trial', 'Demo Request', 'Webinar', 'Ebook Download', 'Contact Sales', 'Product Demo', 'Case Study'];
                            
                            for (let i = 1; i <= recordCount; i++) {
                              const field = exportFields[i % exportFields.length];
                              const pageName = pages[i % pages.length];
                              
                              records.push({
                                name: `${pageName} Landing Page`,
                                oldValue: '—',
                                newValue: `Exported to ${log.metadata?.format?.toUpperCase() || 'CSV'}`
                              });
                            }
                          } else if (log.resource === 'blog-posts') {
                            const posts = ['SEO Best Practices', 'Content Marketing', 'Digital Strategy', 'Analytics Guide', 'Growth Hacking', 'Social Media', 'Email Marketing', 'Conversion Optimization', 'User Experience', 'Marketing Automation'];
                            
                            for (let i = 1; i <= recordCount; i++) {
                              const postName = posts[i % posts.length];
                              
                              records.push({
                                name: `${postName} Blog Post`,
                                oldValue: '—',
                                newValue: `Exported to ${log.metadata?.format?.toUpperCase() || 'CSV'}`
                              });
                            }
                          } else if (log.resource === 'website-pages') {
                            const pages = ['About Us', 'Contact', 'Services', 'Portfolio', 'Team', 'Careers', 'Privacy Policy', 'Terms', 'FAQ', 'Support'];
                            
                            for (let i = 1; i <= recordCount; i++) {
                              const pageName = pages[i % pages.length];
                              
                              records.push({
                                name: `${pageName} Page`,
                                oldValue: '—',
                                newValue: `Exported to ${log.metadata?.format?.toUpperCase() || 'XLSX'}`
                              });
                            }
                          } else if (log.resource === 'authors') {
                            const authors = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emily Chen', 'David Wilson', 'Lisa Martinez', 'Tom Anderson', 'Jessica Brown', 'Chris Taylor', 'Amanda White'];
                            
                            for (let i = 1; i <= recordCount; i++) {
                              const authorName = authors[i % authors.length];
                              
                              records.push({
                                name: `${authorName} Author Profile`,
                                oldValue: '—',
                                newValue: `Exported to ${log.metadata?.format?.toUpperCase() || 'CSV'}`
                              });
                            }
                          } else if (log.resource === 'url-redirects') {
                            for (let i = 1; i <= recordCount; i++) {
                              records.push({
                                name: `/old-page-${i} → /new-page-${i}`,
                                oldValue: '—',
                                newValue: `301 Redirect exported to ${log.metadata?.format?.toUpperCase() || 'CSV'}`
                              });
                            }
                          }
                        } else if (log.action === 'import') {
                          // For imports, show what was created/added
                          if (log.resource === 'website-pages') {
                            const pages = ['Features', 'Pricing', 'Solutions', 'Resources', 'Blog', 'Support', 'Documentation', 'API', 'Integration', 'Security'];
                            
                            for (let i = 1; i <= recordCount; i++) {
                              const pageName = pages[i % pages.length];
                              
                              records.push({
                                name: `New ${pageName} Page`,
                                oldValue: 'Not existed',
                                newValue: `Created from ${log.metadata?.format?.toUpperCase() || 'CSV'} import`
                              });
                            }
                          } else if (log.resource === 'authors') {
                            const authors = ['Robert Taylor', 'Amanda White', 'Chris Lee', 'Jennifer Garcia', 'Mark Thompson', 'Rachel Kim', 'Alex Rodriguez', 'Nicole Turner', 'Kevin Brown', 'Maria Lopez'];
                            
                            for (let i = 1; i <= recordCount; i++) {
                              const authorName = authors[i % authors.length];
                              
                              records.push({
                                name: `${authorName} Author Profile`,
                                oldValue: 'Not existed',
                                newValue: `Created from ${log.metadata?.format?.toUpperCase() || 'CSV'} import`
                              });
                            }
                          } else if (log.resource === 'url-redirects') {
                            for (let i = 1; i <= recordCount; i++) {
                              records.push({
                                name: `/import-${i} → /redirect-${i}`,
                                oldValue: 'No redirect',
                                newValue: `301 Redirect created from ${log.metadata?.format?.toUpperCase() || 'CSV'}`
                              });
                            }
                          } else if (log.resource === 'blog-posts') {
                            const posts = ['Advanced SEO', 'Content Strategy', 'Digital Marketing', 'Analytics Deep Dive', 'Growth Tactics', 'Social Media Guide', 'Email Campaigns', 'Conversion Science', 'UX Research', 'Marketing Tech'];
                            
                            for (let i = 1; i <= recordCount; i++) {
                              const postName = posts[i % posts.length];
                              
                              records.push({
                                name: `${postName} Blog Post`,
                                oldValue: 'Not existed',
                                newValue: `Created from ${log.metadata?.format?.toUpperCase() || 'CSV'} import`
                              });
                            }
                          }
                        } else if (log.action === 'update') {
                          // For updates, show field changes
                          if (log.resource === 'website-pages') {
                            const fields = ['title', 'metaDescription', 'content', 'publishDate', 'template'];
                            
                            for (let i = 1; i <= Math.min(recordCount, 5); i++) {
                              const field = fields[i - 1];
                              
                              records.push({
                                name: `About Us Page - ${field}`,
                                oldValue: field === 'title' ? 'About Our Company' : field === 'metaDescription' ? 'Learn about us' : field === 'publishDate' ? '2024-01-01' : 'Original content',
                                newValue: field === 'title' ? 'About Our Company - Updated 2024' : field === 'metaDescription' ? 'Learn about our mission and values' : field === 'publishDate' ? '2024-02-01' : 'Updated content'
                              });
                            }
                          } else if (log.resource === 'hubdb-tables') {
                            const fields = ['schema', 'columns', 'data', 'permissions', 'settings'];
                            
                            for (let i = 1; i <= Math.min(recordCount, 5); i++) {
                              const field = fields[i - 1];
                              
                              records.push({
                                name: `Product Catalog Table - ${field}`,
                                oldValue: field === 'schema' ? 'v1.0 schema' : field === 'columns' ? '5 columns' : 'Original configuration',
                                newValue: field === 'schema' ? 'v2.0 schema with improvements' : field === 'columns' ? '8 columns with new fields' : 'Updated configuration'
                              });
                            }
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