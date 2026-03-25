import { CheckCircle2, Download, Hourglass, AlertCircle } from 'lucide-react';
import { FetchingProgress } from './FetchingStatusContext';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';

interface FetchingStatusTrayProps {
  fetchingProgresses: FetchingProgress[];
}

export function FetchingStatusTray({ fetchingProgresses = [] }: FetchingStatusTrayProps) {
  // If no fetches at all
  const hasNoFetches = fetchingProgresses.length === 0;

  // Calculate summary stats
  const activeFetches = fetchingProgresses.filter(p => p.isFetching);
  const completedFetches = fetchingProgresses.filter(p => p.isComplete);
  const totalActiveFetches = activeFetches.length;
  const totalCompletedFetches = completedFetches.length;

  if (hasNoFetches) {
    return (
      <div className="w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hourglass className="h-5 w-5 text-gray-700" />
            <h3 className="text-lg">Fetching Status</h3>
          </div>
        </div>

        {/* Empty State */}
        <div className="p-8 text-center text-gray-500">
          <Hourglass className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No Active Data Fetch</p>
          
          
        </div>

        {/* Data Retention Notice */}
        <div className="p-2 border-t border-gray-200">
          <div className="flex items-start gap-3 rounded-lg p-2">
            <AlertCircle className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Your data will be automatically cleared after 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {totalActiveFetches > 0 ? (
            <Hourglass className="h-5 w-5 text-blue-600 animate-spin" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          )}
          <div>
            <h3 className="text-lg">
              {totalActiveFetches > 0 ? 'Fetching Live Data' : 'All Fetches Complete'}
            </h3>
            {totalActiveFetches > 0 && (
              <p className="text-xs text-gray-500">
                {totalActiveFetches} active {totalActiveFetches === 1 ? 'fetch' : 'fetches'}
                {totalCompletedFetches > 0 ? `, ${totalCompletedFetches} completed` : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          {totalActiveFetches > 0
            ? 'Please wait while we retrieve your data from HubSpot.You will be notified once done'
            : 'All data has been successfully retrieved from HubSpot.'}
        </p>
      </div>

      {/* Fetches List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-200">
          {fetchingProgresses.map((progress) => {
            const progressPercentage = progress.total > 0 ? (progress.fetched / progress.total) * 100 : 0;
            const elapsedTime = Math.floor((Date.now() - progress.startTime) / 1000); // in seconds
            const elapsedMinutes = Math.floor(elapsedTime / 60);
            const elapsedSeconds = elapsedTime % 60;

            return (
              <div
                key={progress.id}
                className={`p-4 ${
                  progress.isComplete
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'bg-blue-50 hover:bg-blue-100'
                } transition-colors`}
              >
                {/* Content Type Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {progress.isFetching ? (
                      <Download className="h-4 w-4 text-blue-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                    <div className="font-medium">{progress.contentType}</div>
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
      </ScrollArea>
    </div>
  );
}