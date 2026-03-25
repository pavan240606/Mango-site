import { useState } from 'react';
import { Copy, CheckCircle2, Hourglass, ShieldOff, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { UserAccountDropdown } from './UserAccountDropdown';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { FetchingStatusTray } from './FetchingStatusTray';
import { useFetchingStatus } from './FetchingStatusContext';
import { useBypass } from './BypassContext';
import { toast } from 'sonner';

interface HeaderProps {
  onShowProfile: () => void;
  onNotificationClick?: (notification: any) => void;
}

export function Header({ onShowProfile }: HeaderProps) {
  const { fetchingProgresses } = useFetchingStatus();
  const { isBypassEnabled, setBypassEnabled } = useBypass();
  const [fetchingOpen, setFetchingOpen] = useState(false);

  const handleBypassToggle = () => {
    const newState = !isBypassEnabled;
    setBypassEnabled(newState);
    if (newState) {
      toast.success('Bypass Mode Enabled! Full access to all features unlocked.');
    } else {
      toast.info('Bypass Mode Disabled. Premium features require connections.');
    }
  };

  // Check if any fetch is active
  const activeFetchCount = fetchingProgresses.filter(p => p.isFetching).length;
  const hasActiveFetch = activeFetchCount > 0;
  const hasCompletedFetch = fetchingProgresses.some(p => p.isComplete && !p.isFetching);
  const isFetching = hasActiveFetch;
  const isComplete = !hasActiveFetch && hasCompletedFetch;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Live Fetching Status Button - Always visible */}
        <Popover open={fetchingOpen} onOpenChange={setFetchingOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`relative ${
                isFetching
                  ? 'text-blue-600 hover:text-blue-700'
                  : isComplete
                  ? 'text-green-600 hover:text-green-700'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Hourglass className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              )}
              {isFetching && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[10px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center font-medium shadow-lg border-2 border-white">
                  {activeFetchCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0 border-0 shadow-none">
            <FetchingStatusTray fetchingProgresses={fetchingProgresses} />
          </PopoverContent>
        </Popover>
        
        {/* Global Bypass Toggle Button */}
        <Button
          onClick={handleBypassToggle}
          variant={isBypassEnabled ? "default" : "outline"}
          size="sm"
          className={`gap-2 transition-all ${
            isBypassEnabled
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isBypassEnabled ? (
            <>
              <ShieldOff className="h-4 w-4" />
              Bypass ON
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Bypass OFF
            </>
          )}
        </Button>

        <UserAccountDropdown onShowProfile={onShowProfile} />
      </div>
    </header>
  );
}
