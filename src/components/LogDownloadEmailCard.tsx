import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LogEntry } from './LogsContext';
import { formatTableDateTime } from '../utils/dateFormat';
import { 
  Download, 
  CheckCircle, 
  XCircle,
  Calendar,
  Activity,
  Upload,
  Edit,
  FileText,
  Database,
  Sheet,
  ArrowLeft,
  Loader2
} from 'lucide-react';

interface LogDownloadEmailCardProps {
  log: LogEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LogDownloadEmailCard({ log, isOpen, onClose }: LogDownloadEmailCardProps) {
  const [showGoogleSheetsSelection, setShowGoogleSheetsSelection] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [selectedTab, setSelectedTab] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for Google Sheets - replace with actual data from your Google Sheets integration
  const availableSheets = [
    { id: 'sheet1', name: 'HubSpot Content Database' },
    { id: 'sheet2', name: 'Marketing Analytics 2024' },
    { id: 'sheet3', name: 'Content Exports Archive' },
  ];

  const availableTabs = [
    { id: 'tab1', name: 'Export Logs' },
    { id: 'tab2', name: 'Import Logs' },
    { id: 'tab3', name: 'All Activity' },
    { id: 'tab4', name: 'Error Reports' },
  ];

  if (!log) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <XCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'export': return <Download className="h-5 w-5 text-blue-600" />;
      case 'import': return <Upload className="h-5 w-5 text-green-600" />;
      case 'update': return <Edit className="h-5 w-5 text-amber-600" />;
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

  const handleDownload = () => {
    // Generate CSV content based on action type
    const headers = ['Timestamp', 'Action', 'Resource', 'Status', 'Message', 'Details'];
    const csvData = [
      formatTableDateTime(log.timestamp),
      log.action,
      formatResourceName(log.resource),
      log.status,
      log.message,
      log.details || 'N/A'
    ];

    const csvContent = [
      headers.join(','),
      csvData.map(field => `"${field}"`).join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${log.action}-${log.resource}-${formatTableDateTime(log.timestamp).replace(/[/:]/g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGoogleSheetsExport = async () => {
    setIsExporting(true);
    
    // TODO: Implement actual Google Sheets export
    console.log('Exporting to Google Sheets:', {
      sheet: selectedSheet,
      tab: selectedTab,
      logData: log
    });
    
    // Simulate export process with 5 second delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Reset and close
    setIsExporting(false);
    setShowGoogleSheetsSelection(false);
    setSelectedSheet('');
    setSelectedTab('');
    onClose();
  };

  const handleBackToOptions = () => {
    setShowGoogleSheetsSelection(false);
    setSelectedSheet('');
    setSelectedTab('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 p-8 pb-6 border-b border-gray-200">
            <DialogTitle className="text-2xl font-semibold mb-2">
              {log.action.charAt(0).toUpperCase() + log.action.slice(1)} Log Details
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              View detailed information about this {log.action} operation and download or email the log data.
            </DialogDescription>
            
            {/* Activity Logs Style Cards */}
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
            <div className="mt-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Total Records */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Total Records</span>
                  </div>
                  <p className="text-2xl font-semibold text-blue-900">
                    {log.metadata?.count || log.metadata?.totalRows || log.metadata?.affectedPages || 0}
                  </p>
                </div>

                {/* Total Success */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Total Success</span>
                  </div>
                  <p className="text-2xl font-semibold text-green-900">
                    {log.metadata?.successCount || 
                     (log.status === 'success' ? (log.metadata?.count || log.metadata?.affectedPages || 0) : 0)}
                  </p>
                </div>

                {/* Total Failure */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Total Failure</span>
                  </div>
                  <p className="text-2xl font-semibold text-red-900">
                    {log.metadata?.failedCount || log.metadata?.errorCount || 
                     (log.status === 'error' ? (log.metadata?.count || log.metadata?.totalRows || 1) : 0)}
                  </p>
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {log.action === 'export' ? 'Export Details' : 'Export Options'}
                </h3>
                
                {/* Message Display */}
                

                {/* Conditional Content Based on Action Type */}
                {log.action === 'export' ? (
                  /* Export Destination Info */
                  <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-blue-50">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Export Destination
                        </h4>
                        <p className="text-sm text-gray-700">
                          This export action has been exported to{' '}
                          <span className="font-semibold text-blue-900">
                            "{formatResourceName(log.resource)}_Export_{new Date(log.timestamp).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: '2-digit', 
                              year: 'numeric' 
                            }).replace(/\s/g, '_')}"
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Download Options for Import/Update */
                  <>
                    {!showGoogleSheetsSelection ? (
                      /* Initial Export Options */
                      <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-6">
                          Choose how you'd like to export this log data
                        </p>
                        
                        {/* Two Download Options */}
                        <div className="grid grid-cols-2 gap-4">
                          {/* CSV Download Option */}
                          <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                            <div className="flex flex-col items-center text-center gap-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                <Download className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  Download as CSV
                                </h4>
                                <p className="text-xs text-gray-600">
                                  Download the complete log information in CSV format
                                </p>
                              </div>
                              <Button
                                onClick={handleDownload}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download CSV
                              </Button>
                            </div>
                          </div>

                          {/* Google Sheets Option */}
                          <div className="border border-gray-200 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group">
                            <div className="flex flex-col items-center text-center gap-4">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                <Sheet className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  Export to Google Sheets
                                </h4>
                                <p className="text-xs text-gray-600">
                                  Send this log data directly to a Google Sheet
                                </p>
                              </div>
                              <Button
                                onClick={() => setShowGoogleSheetsSelection(true)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Sheet className="h-4 w-4 mr-2" />
                                Export to Sheets
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Google Sheets Selection Screen */
                      <div className="mb-6">
                        {/* Back Button */}
                        <Button
                          onClick={handleBackToOptions}
                          variant="ghost"
                          className="mb-6 -ml-2"
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back to export options
                        </Button>

                        <div className="space-y-6">
                          <p className="text-sm text-gray-600">
                            Select the Google Sheet and tab where you'd like to export this log data
                          </p>

                          {/* Sheet Selection */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">
                              Select Google Sheet
                            </label>
                            <Select value={selectedSheet} onValueChange={setSelectedSheet} disabled={isExporting}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a Google Sheet..." />
                              </SelectTrigger>
                              <SelectContent>
                                {availableSheets.map((sheet) => (
                                  <SelectItem key={sheet.id} value={sheet.id}>
                                    {sheet.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Tab Selection */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">
                              Select Tab/Worksheet
                            </label>
                            <Select 
                              value={selectedTab} 
                              onValueChange={setSelectedTab}
                              disabled={!selectedSheet || isExporting}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a tab..." />
                              </SelectTrigger>
                              <SelectContent>
                                {availableTabs.map((tab) => (
                                  <SelectItem key={tab.id} value={tab.id}>
                                    {tab.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {!selectedSheet && !isExporting && (
                              <p className="text-xs text-gray-500">
                                Please select a Google Sheet first
                              </p>
                            )}
                          </div>

                          {/* Export Button */}
                          <div className="pt-4 flex justify-end gap-3">
                            <Button
                              onClick={handleBackToOptions}
                              variant="outline"
                              className="px-6"
                              disabled={isExporting}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleGoogleSheetsExport}
                              disabled={!selectedSheet || !selectedTab || isExporting}
                              className="bg-green-600 hover:bg-green-700 text-white px-6"
                            >
                              {isExporting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Exporting...
                                </>
                              ) : (
                                <>
                                  <Sheet className="h-4 w-4 mr-2" />
                                  Export to Google Sheets
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
