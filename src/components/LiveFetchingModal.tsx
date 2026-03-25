import { X, AlertCircle, CheckCircle2, Download, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { FetchingProgress } from './FetchingStatusContext';

interface LiveFetchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchingProgresses: FetchingProgress[];
}

export function LiveFetchingModal({
  isOpen,
  onClose,
  fetchingProgresses = [],
}: LiveFetchingModalProps) {
  if (!isOpen) return null;

  // If no fetches at all
  const hasNoFetches = fetchingProgresses.length === 0;

  // Calculate summary stats
  const activeFetches = fetchingProgresses.filter(p => p.isFetching);
  const completedFetches = fetchingProgresses.filter(p => p.isComplete);
  const totalActiveFetches = activeFetches.length;
  const totalCompletedFetches = completedFetches.length;

  if (hasNoFetches) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg">No Active Data Fetch</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              There is currently no active data fetch in progress. To fetch live records from HubSpot:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Navigate to the Edit and Export page</li>
              <li>Select a content type from the dropdown</li>
              <li>Click the "Refresh" button to fetch live data</li>
            </ol>
            <p className="text-sm text-gray-600 mt-4">
              The live fetching status will appear here when a data fetch is in progress.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {totalActiveFetches > 0 ? (
              <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}
            <div>
              <h2 className="text-lg">
                {totalActiveFetches > 0 ? 'Fetching Live Data' : 'All Fetches Complete'}
              </h2>
              {totalActiveFetches > 0 && (
                <p className="text-xs text-gray-500">
                  {totalActiveFetches} active {totalActiveFetches === 1 ? 'fetch' : 'fetches'}{totalCompletedFetches > 0 ? `, ${totalCompletedFetches} completed` : ''}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content - Scrollable list of fetches */}
        <div className="flex-1 overflow-auto p-6">
          {/* Status Message */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {totalActiveFetches > 0
                ? 'Please wait while we retrieve your data from HubSpot. This may take a few moments depending on the amount of content.'
                : 'All data has been successfully retrieved from HubSpot and is ready to use.'}
            </p>
          </div>

          {/* List of all fetches */}
          <div className="space-y-4">
            {fetchingProgresses.map((progress) => {
              const progressPercentage = progress.total > 0 ? (progress.fetched / progress.total) * 100 : 0;
              const elapsedTime = Math.floor((Date.now() - progress.startTime) / 1000); // in seconds
              const elapsedMinutes = Math.floor(elapsedTime / 60);
              const elapsedSeconds = elapsedTime % 60;

              return (
                <div
                  key={progress.id}
                  className={`border rounded-lg p-4 ${
                    progress.isComplete
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  {/* Content Type Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {progress.isFetching ? (
                        <Download className="h-4 w-4 text-blue-600 animate-download-slow" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                      <div>
                        <div className="font-medium">{progress.contentType}</div>
                
                      </div>
                    </div>
                    <div className="text-sm">
                      {progress.isComplete ? (
                        <span className="text-green-600 font-medium">Complete</span>
                      ) : (
                        <span className="text-blue-600 font-medium">In Progress</span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        <strong>{progress.fetched.toLocaleString()}</strong> of{' '}
                        <strong>{progress.total.toLocaleString()}</strong> records
                      </span>
                      <span className="font-medium">
                        {progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className={`h-2 ${
                        progress.isComplete ? 'bg-green-200' : 'bg-blue-200'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Data Retention Notice */}
          {totalCompletedFetches > 0 && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-600">
                  <strong>Important:</strong> Your data will be automatically cleared from our
                  database after 24 hours for security purposes. You will need to refresh again to
                  retrieve the latest data from HubSpot.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
