import { AlertCircle } from 'lucide-react';
import { Progress } from './ui/progress';

interface FetchingBannerProps {
  totalRecords: number;
  fetchedRecords: number;
  isComplete: boolean;
}

export function FetchingBanner({ totalRecords, fetchedRecords, isComplete }: FetchingBannerProps) {
  const progressPercentage = totalRecords > 0 ? (fetchedRecords / totalRecords) * 100 : 0;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg mb-1">
            {isComplete ? 'Records Fetched Successfully' : 'Fetching Records...'}
          </h3>
          <p className="text-sm text-gray-600">
            {isComplete 
              ? 'Your data has been successfully retrieved from HubSpot and is ready to use.' 
              : 'Please wait while we retrieve your data from HubSpot. This may take a few moments depending on the amount of content.'}
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">
            Fetched: <strong>{fetchedRecords.toLocaleString()}</strong> of <strong>{totalRecords.toLocaleString()}</strong> records
          </span>
          <span className="text-sm">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Data Retention Notice */}
      <div className="flex items-start gap-3 bg-white border border-red-200 rounded-md p-4">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-red-600">
            <strong>Important:</strong> Your data will be automatically cleared from our database after 24 hours for security purposes. You will need to refresh again to retrieve the latest data from HubSpot.
          </p>
        </div>
      </div>
    </div>
  );
}
