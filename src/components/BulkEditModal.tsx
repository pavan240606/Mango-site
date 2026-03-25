import { useState } from 'react';
import { Upload, Calendar, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight, Loader2, CheckCircle, FileText, Download, AlertCircle, GripVertical } from 'lucide-react';
import { formatTableDateTime } from '../utils/dateFormat';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import exampleImage from 'figma:asset/e118ba5b0d1c4d508eb1230ea9ab8b56ab06f600.png';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: string;
  currentConfig: any;
  data: any[];
  onUploadComplete: () => void;
  contentTypeConfigs?: any;
}

export function BulkEditModal({ 
  isOpen, 
  onClose, 
  contentType: initialContentType, 
  currentConfig: initialConfig, 
  data: initialData, 
  onUploadComplete,
  contentTypeConfigs 
}: BulkEditModalProps) {
  // Content type management
  const [selectedContentType, setSelectedContentType] = useState<string>(initialContentType);
  const [currentConfig, setCurrentConfig] = useState(initialConfig);
  const [data, setData] = useState(initialData);
  
  // Modal state
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set(data.map((_, index) => index))); // Select all records by default
  const [bulkEditValues, setBulkEditValues] = useState<Record<string, any>>({});
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [hasChanges, setHasChanges] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState({ success: 0, failed: 0, successfulItems: [], failedItems: [] });
  const [activeTab, setActiveTab] = useState('successful');
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const itemsPerPage = 25;

  // Handle content type change
  const handleContentTypeChange = (newContentType: string) => {
    setSelectedContentType(newContentType);
    if (contentTypeConfigs && contentTypeConfigs[newContentType]) {
      setCurrentConfig(contentTypeConfigs[newContentType]);
      // Here you would normally fetch new data for the content type
      // For now, we'll use the same data structure
      setData(initialData);
    }
    // Clear selections when content type changes
    setSelectedRows(new Set());
    setBulkEditValues({});
    setHasChanges(false);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Get total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentData = data.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(currentData.map((_, index) => startIndex + index)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectAllRecords = () => {
    setSelectedRows(new Set(data.map((_, index) => index)));
  };

  // Column reordering function
  const handleColumnDrop = (dragIndex: number, hoverIndex: number) => {
    const headers = columnOrder.length > 0 ? columnOrder : currentConfig?.tableHeaders || [];
    const newOrder = [...headers];
    const draggedColumn = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedColumn);
    setColumnOrder(newOrder);
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleApplyChanges = () => {
    if (selectedRows.size === 0) {
      toast.error('Please select rows to apply changes');
      return;
    }
    
    if (Object.keys(bulkEditValues).length === 0) {
      toast.error('Please make some changes in the bulk edit fields');
      return;
    }

    setHasChanges(true);
    toast.success(`Changes applied to ${selectedRows.size} records`);
  };

  const handleUploadToHubSpot = () => {
    if (selectedRows.size === 0) {
      toast.error('Please select rows to apply changes');
      return;
    }
    
    if (Object.keys(bulkEditValues).length === 0) {
      toast.error('Please make some changes in the bulk edit fields');
      return;
    }

    setShowPreviewModal(true);
  };

  const handleConfirmChanges = async () => {
    setShowPreviewModal(false);
    setShowProgressModal(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Simulate results (most successful, some might fail)
      const totalItems = selectedRows.size;
      const successCount = Math.floor(totalItems * 0.9); // 90% success rate
      const failedCount = totalItems - successCount;
      
      // Generate mock successful items
      const successfulItems = Array.from({ length: successCount }, (_, i) => ({
        id: i + 1,
        name: `${selectedContentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${i + 1}`,
        field: Object.keys(bulkEditValues).join(', '),
        newValue: Object.values(bulkEditValues).join(' | '),
        status: 'Updated Successfully'
      }));

      // Generate mock failed items
      const failedItems = Array.from({ length: failedCount }, (_, i) => ({
        id: successCount + i + 1,
        name: `${selectedContentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${successCount + i + 1}`,
        field: Object.keys(bulkEditValues).join(', '),
        newValue: Object.values(bulkEditValues).join(' | '),
        errorReason: 'Validation failed - Invalid data format or missing required fields'
      }));
      
      setUploadResults({ 
        success: successCount, 
        failed: failedCount, 
        successfulItems, 
        failedItems 
      });
      setShowProgressModal(false);
      setShowResultsModal(true);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
      setShowProgressModal(false);
    }
  };

  const handleCloseResults = () => {
    setShowResultsModal(false);
    onUploadComplete();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="modal-override overflow-hidden">
          <DialogTitle className="sr-only">Bulk Edit</DialogTitle>
          <DialogDescription className="sr-only">
            Select records and apply bulk changes to {currentConfig?.label || selectedContentType}.
          </DialogDescription>
          <div className="flex flex-col h-full">
            {/* Bulk Edit Fields - Horizontal Row Above Table */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">Bulk Edit Fields</h3>
                  <span className="text-sm text-gray-600">
                    Editing {data.length} record{data.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {currentConfig?.bulkEditFields?.map((field: any) => (
                  <div key={field.key} className="space-y-1">
                    <label className="block text-xs font-medium text-gray-700">{field.label}</label>
                    
                    {field.type === 'select' ? (
                      <Select
                        value={bulkEditValues[field.key] || ''}
                        onValueChange={(value) => setBulkEditValues(prev => ({
                          ...prev,
                          [field.key]: value
                        }))}
                        disabled={false}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'boolean' ? (
                      <Select
                        value={bulkEditValues[field.key] || ''}
                        onValueChange={(value) => setBulkEditValues(prev => ({
                          ...prev,
                          [field.key]: value
                        }))}
                        disabled={false}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === 'datetime' ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-8 text-sm"
                            disabled={false}
                          >
                            <Calendar className="mr-1 h-3 w-3" />
                            {bulkEditValues[field.key] ? 
                              new Date(bulkEditValues[field.key] as string).toLocaleDateString() : 
                              'Date'
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={bulkEditValues[field.key] ? new Date(bulkEditValues[field.key] as string) : undefined}
                            onSelect={(date) => setBulkEditValues(prev => ({
                              ...prev,
                              [field.key]: date?.toISOString()
                            }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : field.type === 'textarea' ? (
                      <Textarea
                        value={bulkEditValues[field.key] as string || ''}
                        onChange={(e) => setBulkEditValues(prev => ({
                          ...prev,
                          [field.key]: e.target.value
                        }))}
                        placeholder="Enter text..."
                        className="h-8 min-h-8 text-sm resize-none"
                        disabled={false}
                      />
                    ) : (
                      <Input
                        value={bulkEditValues[field.key] as string || ''}
                        onChange={(e) => setBulkEditValues(prev => ({
                          ...prev,
                          [field.key]: e.target.value
                        }))}
                        placeholder="Enter value..."
                        className="h-8 text-sm"
                        disabled={false}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Data Table - Full Width */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Data Table */}
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {(columnOrder.length > 0 ? columnOrder : currentConfig?.tableHeaders || []).map((header: string, index: number) => (
                        <TableHead key={header}>
                          <div className="flex items-center gap-1">
                            <GripVertical 
                              className="w-4 h-4 cursor-move opacity-60 hover:opacity-100" 
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData('text/plain', index.toString());
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                                handleColumnDrop(dragIndex, index);
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const originalHeaders = currentConfig?.tableHeaders || [];
                                const sortableIndex = originalHeaders.indexOf(header);
                                const sortableColumn = currentConfig?.sortableColumns?.[sortableIndex];
                                if (sortableColumn) handleSort(sortableColumn);
                              }}
                              className="h-auto p-0 font-medium"
                            >
                              {header}
                              {(() => {
                                const originalHeaders = currentConfig?.tableHeaders || [];
                                const sortableIndex = originalHeaders.indexOf(header);
                                const sortableColumn = currentConfig?.sortableColumns?.[sortableIndex];
                                return sortableColumn && sortColumn === sortableColumn && (
                                  sortDirection === 'asc' ? (
                                    <ChevronUp className="ml-2 h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                  )
                                );
                              })()}
                            </Button>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((item, index) => {
                      const headers = columnOrder.length > 0 ? columnOrder : currentConfig?.tableHeaders || [];
                      return (
                        <TableRow key={item.id}>
                          {headers.map((header, cellIndex) => {
                            const fieldKey = header.toLowerCase().replace(/\s+/g, '');
                            const mappedFieldKey = fieldKey === 'name' ? 'name' : 
                                               fieldKey === 'archivedat' ? 'archivedAt' :
                                               fieldKey === 'archivedindashboard' ? 'archivedInDashboard' :
                                               fieldKey === 'attachedstylesheets' ? 'attachedStylesheets' :
                                               fieldKey === 'authorname' ? 'authorName' :
                                               fieldKey === 'campaign' ? 'campaign' : fieldKey;
                            return (
                              <TableCell key={cellIndex}>
                                {(() => {
                                   const cellValue = item[mappedFieldKey as keyof typeof item];
                                   if (mappedFieldKey === 'archivedAt' && cellValue && cellValue !== '1970-01-01T00:00:00Z') {
                                     return formatTableDateTime(cellValue);
                                   }
                                   return cellValue || '-';
                                 })()}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Footer with Pagination and Action Buttons */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                {/* Pagination */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {startIndex + 1} - {endIndex} of {data.length}
                    </span>
                  </div>

                  {/* Selection Status */}
                  <div className="text-sm text-gray-600">
                    {selectedRows.size > 0 ? (
                      <>
                        {selectedRows.size} records selected.{' '}
                        {selectedRows.size < data.length && (
                          <button
                            onClick={handleSelectAllRecords}
                            className="text-blue-600 hover:underline"
                          >
                            Select all {data.length} {currentConfig?.label || 'records'}
                          </button>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {selectedRows.size > 0 && Object.keys(bulkEditValues).length > 0 && !hasChanges && (
                    <Button 
                      onClick={handleApplyChanges}
                    >
                      Apply Changes ({selectedRows.size} records)
                    </Button>
                  )}
                  
                  {hasChanges && (
                    <Button 
                      onClick={handleUploadToHubSpot}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload to HubSpot
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="sr-only">Confirm Changes</DialogTitle>
          <DialogDescription className="sr-only">
            Review and confirm the changes that will be applied to your selected items.
          </DialogDescription>
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Confirm Changes</h2>
              <p className="text-sm text-gray-600 mt-1">
                Review and confirm the changes that will be applied to your selected items.
              </p>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              The following changes will be uploaded to HubSpot for {selectedRows.size} selected item{selectedRows.size !== 1 ? 's' : ''}:
            </p>
            
            <div className="border rounded-lg overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Field</TableHead>
                    <TableHead>New Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(bulkEditValues).map(([key, value]) => {
                    const field = currentConfig?.bulkEditFields?.find((f: any) => f.key === key);
                    const displayValue = field?.type === 'select' || field?.type === 'boolean' 
                      ? field.options?.find((opt: any) => opt.value === value)?.label || value
                      : value;
                    
                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{field?.label || key}</TableCell>
                        <TableCell>{displayValue}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> These changes will be permanently applied to your HubSpot content. 
                Make sure you have reviewed all changes before proceeding.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmChanges}
                className="bg-green-600 hover:bg-green-700"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Progress Modal */}
      <Dialog open={showProgressModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogTitle className="sr-only">Uploading to HubSpot</DialogTitle>
          <DialogDescription className="sr-only">
            Please wait while your changes are being uploaded to HubSpot.
          </DialogDescription>
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Uploading to HubSpot</h2>
              <p className="text-sm text-gray-600 mt-1">
                Please wait while your changes are being uploaded to HubSpot.
              </p>
            </div>
          </div>
          
          <div className="p-8 text-center">
            <div className="mb-6">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-teal-500" />
            </div>
            
            <h3 className="text-lg font-medium mb-4">Uploading Changes to HubSpot</h3>
            
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-teal-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-gray-500">
              <p>Processing {selectedRows.size} item{selectedRows.size !== 1 ? 's' : ''}...</p>
              {uploadProgress > 50 && <p>Finalizing changes...</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Results Modal */}
      <Dialog open={showResultsModal} onOpenChange={handleCloseResults}>
        <DialogContent className="modal-override overflow-hidden">
          <DialogTitle className="sr-only">Upload Results</DialogTitle>
          <DialogDescription className="sr-only">
            Review the results of your bulk upload operation.
          </DialogDescription>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Upload Results</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Review the results of your bulk upload operation.
                </p>
              </div>
              
            </div>
            
            <div className="modal-scrollable p-8">
              {/* Success Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              {/* Success Message */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold text-green-600 mb-2">Upload Complete!</h3>
                <p className="text-gray-600">
                  {uploadResults.failed === 0 
                    ? 'All changes successfully applied to HubSpot'
                    : `${uploadResults.success} items updated successfully, ${uploadResults.failed} items failed`
                  }
                </p>
              </div>
              
              {/* Success/Failure Cards */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {uploadResults.success}
                  </div>
                  <div className="text-sm font-medium text-green-700">
                    Items Successfully Updated
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {uploadResults.failed}
                  </div>
                  <div className="text-sm font-medium text-red-700">
                    Items Failed to Update
                  </div>
                </div>
              </div>

              {/* Tabs for Successful and Failed Records */}
              {(uploadResults.success > 0 || uploadResults.failed > 0) && (
                <div className="mb-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="successful" className="relative">
                        Successful Records
                        {uploadResults.success > 0 && (
                          <span className="ml-2 bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs">
                            {uploadResults.success}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="failed" className="relative">
                        Failed Records
                        {uploadResults.failed > 0 && (
                          <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                            {uploadResults.failed}
                          </span>
                        )}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="successful" className="mt-4">
                      {uploadResults.success > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-green-50">
                                <TableHead>Item Name</TableHead>
                                <TableHead>Field Updated</TableHead>
                                <TableHead>New Value</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {uploadResults.successfulItems?.map((item: any) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.name}</TableCell>
                                  <TableCell>{item.field}</TableCell>
                                  <TableCell>{item.newValue}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-green-600">{item.status}</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No successful records to display
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="failed" className="mt-4">
                      {uploadResults.failed > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-red-50">
                                <TableHead>Item Name</TableHead>
                                <TableHead>Field</TableHead>
                                <TableHead>Attempted Value</TableHead>
                                <TableHead>Error Reason</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {uploadResults.failedItems?.map((item: any) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.name}</TableCell>
                                  <TableCell>{item.field}</TableCell>
                                  <TableCell>{item.newValue}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <AlertCircle className="h-4 w-4 text-red-600" />
                                      <span className="text-red-600">{item.errorReason}</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No failed records to display
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {/* Action Buttons */}
              
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}