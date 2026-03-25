import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { CheckCircle, XCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useLogs } from './LogsContext';

interface Change {
  field: string;
  value: string;
  label: string;
  displayValue?: string;
}

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  changes: Change[];
  selectedCount: number;
  onConfirm: () => void;
  onShowLogs: () => void;
  contentType: string;
}

interface ProcessingResult {
  successful: number;
  failed: number;
  errors: string[];
}

export function ImportPreviewModal({ 
  isOpen, 
  onClose, 
  changes, 
  selectedCount, 
  onConfirm, 
  onShowLogs, 
  contentType 
}: ImportPreviewModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [progress, setProgress] = useState(0);
  const { addLog } = useLogs();

  const handleConfirm = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Generate realistic failure scenarios for imports
    const potentialErrors = [
      'Item "Imported Page 3": Duplicate URL path detected - conflicts with existing content',
      'Item "Imported Page 7": Invalid template reference - template not found in HubSpot',
      'Item "Imported Page 12": Required field validation failed - missing meta description',
      'Item "Imported Page 15": Permission denied - user lacks import privileges for this content type',
      'Item "Imported Page 18": HubSpot API rate limit exceeded - retry in 60 seconds'
    ];
    
    const failureCount = Math.random() > 0.8 ? Math.floor(Math.random() * 2) + 1 : 0;
    const successCount = selectedCount - failureCount;
    
    const selectedErrors = failureCount > 0 
      ? potentialErrors.slice(0, failureCount)
      : [];

    const mockResults: ProcessingResult = {
      successful: Math.max(0, successCount),
      failed: failureCount,
      errors: selectedErrors
    };
    
    // Simulate progress updates for 3 seconds
    try {
      const totalDuration = 3000; // 3 seconds
      const updateInterval = 50; // Update every 50ms for smoother progress
      const totalSteps = totalDuration / updateInterval;
      
      for (let i = 0; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, updateInterval));
        const progressPercent = (i / totalSteps) * 100;
        setProgress(progressPercent);
        
        // When we reach exactly 100%, immediately switch to results
        if (i === totalSteps) {
          // Add a tiny delay to ensure UI updates properly
          await new Promise(resolve => setTimeout(resolve, 50));
          setResults(mockResults);
          setProcessingComplete(true);
          setIsProcessing(false);
          
          // Log the import results
          if (mockResults.failed === 0) {
            // Log successful import
            addLog({
              type: 'hubspot',
              action: 'import',
              resource: contentType,
              status: 'success',
              message: `Successfully imported ${mockResults.successful} items to HubSpot`,
              user: 'current.user@company.com',
              metadata: {
                successCount: mockResults.successful,
                failedCount: mockResults.failed,
                changes: changes.map(c => ({ field: c.field, value: c.value })),
                contentType
              }
            });
            
            // Also log as bulk edit activity
            addLog({
              type: 'bulk-edit',
              action: 'import',
              resource: contentType,
              status: 'success',
              message: `Bulk imported ${selectedCount} items - ${changes.map(c => c.label).join(', ')}`,
              user: 'current.user@company.com',
              metadata: {
                selectedCount,
                fields: changes.map(c => c.field),
                changes: changes.map(c => ({ field: c.field, value: c.value })),
                contentType
              }
            });
          } else if (mockResults.failed > 0 && mockResults.successful > 0) {
            // Log partial success with warnings
            addLog({
              type: 'hubspot',
              action: 'import',
              resource: contentType,
              status: 'warning',
              message: `Partially imported items to HubSpot - ${mockResults.successful} succeeded, ${mockResults.failed} failed`,
              details: mockResults.errors.join('\n'),
              user: 'current.user@company.com',
              metadata: {
                successCount: mockResults.successful,
                failedCount: mockResults.failed,
                errors: mockResults.errors,
                contentType
              }
            });
            
            // Log bulk edit with warnings
            addLog({
              type: 'bulk-edit',
              action: 'import',
              resource: contentType,
              status: 'warning',
              message: `Bulk import completed with issues - ${mockResults.successful}/${selectedCount} items imported successfully`,
              details: mockResults.errors.join('\n'),
              user: 'current.user@company.com',
              metadata: {
                selectedCount,
                successCount: mockResults.successful,
                failedCount: mockResults.failed,
                errors: mockResults.errors,
                contentType
              }
            });
          } else {
            // Log complete failure
            addLog({
              type: 'hubspot',
              action: 'import',
              resource: contentType,
              status: 'error',
              message: `Failed to import items to HubSpot - ${mockResults.failed} errors`,
              details: mockResults.errors.join('\n'),
              user: 'current.user@company.com',
              metadata: {
                failedCount: mockResults.failed,
                errors: mockResults.errors,
                contentType
              }
            });
            
            // Log bulk edit failure
            addLog({
              type: 'bulk-edit',
              action: 'import',
              resource: contentType,
              status: 'error',
              message: `Bulk import failed - Unable to import ${selectedCount} items`,
              details: mockResults.errors.join('\n'),
              user: 'current.user@company.com',
              metadata: {
                selectedCount,
                errors: mockResults.errors,
                contentType
              }
            });
          }
          
          break;
        }
      }
      
    } catch (error) {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    // If we're closing from the results screen, call onConfirm to update parent state
    if (processingComplete && results) {
      onConfirm();
    }
    
    setProcessingComplete(false);
    setResults(null);
    setIsProcessing(false);
    setProgress(0);
    onClose();
  };

  const formatDisplayValue = (change: Change) => {
    // If displayValue is already provided, use it
    if (change.displayValue) {
      return change.displayValue;
    }
    
    // For datetime values, format them nicely (date only)
    if (change.value && change.value.includes('T') && change.value.includes('Z')) {
      try {
        const date = new Date(change.value);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch {
        return change.value;
      }
    }
    
    // For array values (comma-separated), format them nicely
    if (change.field === 'tagIds' && change.value && change.value.includes(',')) {
      const values = change.value.split(',').map(v => v.trim()).filter(v => v);
      return `[${values.join(', ')}]`;
    }
    
    // For other values, return as-is
    return change.value;
  };

  const renderProcessingState = () => {
    if (isProcessing) {
      return (
        <div className="text-center py-8">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-teal-600" />
          <h3 className="text-lg font-medium mb-4">Uploading to HubSpot</h3>
          <div className="max-w-md mx-auto mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-200" />
          </div>
          <p className="text-gray-600">Processing {selectedCount} items...</p>
          {progress > 0 && progress < 100 && (
            <p className="text-sm text-gray-500 mt-2">
              {progress < 30 && "Validating import data..."}
              {progress >= 30 && progress < 60 && "Creating content in HubSpot..."}
              {progress >= 60 && progress < 90 && "Applying imported data..."}
              {progress >= 90 && progress < 100 && "Finalizing import..."}
            </p>
          )}
        </div>
      );
    }

    if (processingComplete && results) {
      return (
        <div className="py-6">
          <div className="mb-6">
            {/* Success/Warning Header with Icon */}
            <div className="text-center mb-6">
              {results.failed === 0 ? (
                <div className="mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-green-800">Upload Complete!</h3>
                  <p className="text-sm text-green-600 mt-1">All items successfully uploaded to HubSpot</p>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-yellow-800">Import Completed with Issues</h3>
                  <p className="text-sm text-yellow-600 mt-1">Some items failed to import - see details below</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-1">{results.successful}</div>
                  <div className="text-sm font-medium text-green-800">Items Successfully Imported</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-3xl font-bold text-red-600 mb-1">{results.failed}</div>
                  <div className="text-sm font-medium text-red-800">Items Failed to Import</div>
                </div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="text-left mb-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-red-900 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Import Errors ({results.errors.length} items)
                  </h4>
                  <div className="space-y-3">
                    {results.errors.map((error, index) => (
                      <div key={index} className="bg-white border border-red-200 p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <div className="text-red-500 font-medium text-sm mt-0.5">#{index + 1}</div>
                          <p className="text-sm text-red-700 flex-1">{error}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  // Call onConfirm before closing when navigating to logs
                  if (processingComplete && results) {
                    onConfirm();
                  }
                  setProcessingComplete(false);
                  setResults(null);
                  setIsProcessing(false);
                  setProgress(0);
                  onClose();
                  onShowLogs();
                }}
              >
                <ExternalLink className="h-4 w-4" />
                View Detailed Logs
              </Button>
              
              <Button 
                onClick={handleClose}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          The following changes will be uploaded to HubSpot for {selectedCount} selected items:
        </p>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Field</TableHead>
                <TableHead>Value to Import</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {changes.map((change, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{change.label}</TableCell>
                  <TableCell>{formatDisplayValue(change)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> These imported items will be created in your HubSpot account. 
            Ensure the data is correct before proceeding.
          </p>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            className="bg-green-600 hover:bg-green-700"
            disabled={isProcessing}
          >
            Upload to HubSpot
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={isProcessing ? undefined : handleClose}>
      <DialogContent className="modal-override">
        <DialogTitle className="sr-only">
          {processingComplete ? 'Import Results' : isProcessing ? 'Importing to HubSpot' : 'Confirm Upload'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {processingComplete 
            ? 'Review the results of your bulk upload operation.'
            : isProcessing 
              ? 'Please wait while your data is being imported to HubSpot.'
              : 'Review and confirm the data that will be imported to HubSpot.'
          }
        </DialogDescription>
        
        <DialogHeader className="p-6 border-b flex-shrink-0 bg-white">
          <DialogTitle>
            {processingComplete ? 'Import Results' : isProcessing ? 'Importing to HubSpot' : 'Confirm Upload'}
          </DialogTitle>
          <DialogDescription>
            {processingComplete 
              ? 'Review the results of your bulk upload operation.'
              : isProcessing 
                ? 'Please wait while your data is being imported to HubSpot.'
                : 'Review and confirm the data that will be imported to HubSpot.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="modal-scrollable p-8 bg-white">
          <div className="max-w-4xl mx-auto">
            {renderProcessingState()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
