import { X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DataPullResult {
  id: string;
  name: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  timestamp: string;
}

interface DataPullResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    successful: DataPullResult[];
    failed: DataPullResult[];
  };
  totalRecords: number;
  contentType: string;
}

export function DataPullResultsModal({
  isOpen,
  onClose,
  results,
  totalRecords,
  contentType
}: DataPullResultsModalProps) {
  if (!isOpen) return null;

  const successCount = results.successful.length;
  const failureCount = results.failed.length;
  const successRate = totalRecords > 0 ? ((successCount / totalRecords) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl mb-1">Data Pull Results</h2>
            <p className="text-sm text-gray-600">
              {contentType} - {totalRecords.toLocaleString()} total records processed
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 border-b bg-gray-50 flex-shrink-0">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Total Processed</span>
            </div>
            <p className="text-2xl">{totalRecords.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Successful</span>
            </div>
            <p className="text-2xl text-green-600">{successCount.toLocaleString()}</p>
      
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-gray-600">Failed</span>
            </div>
            <p className="text-2xl text-red-600">{failureCount.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs for Success/Failure */}
        <div className="flex-1 overflow-hidden p-6">
          <Tabs defaultValue={failureCount > 0 ? "failures" : "success"} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="success" className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Successful ({successCount})
              </TabsTrigger>
              <TabsTrigger value="failures" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Failed ({failureCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="success" className="flex-1 overflow-hidden mt-0">
              <div className="h-full border rounded-lg">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    {successCount === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No successful records to display</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {results.successful.map((record, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{record.name}</p>
                              <p className="text-xs text-gray-500 mt-1">ID: {record.id}</p>
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {record.timestamp}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="failures" className="flex-1 overflow-hidden mt-0">
              <div className="h-full border rounded-lg">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    {failureCount === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-400" />
                        <p>All records were pulled successfully!</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {results.failed.map((record, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                          >
                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{record.name}</p>
                              <p className="text-xs text-gray-500 mt-1">ID: {record.id}</p>
                              {record.errorMessage && (
                                <p className="text-xs text-red-600 mt-2 bg-white px-2 py-1 rounded border border-red-200">
                                  Error: {record.errorMessage}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {record.timestamp}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end flex-shrink-0">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
