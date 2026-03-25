import { X } from 'lucide-react';
import { Button } from './ui/button';

interface SmartSelectionBarProps {
  selectedCount: number;
  totalOnPage: number;
  totalAll: number;
  allSelected: boolean;
  contentTypeLabel: string;
  onSelectAllPages: () => void;
  onClearSelection: () => void;
}

export function SmartSelectionBar({
  selectedCount,
  totalOnPage,
  totalAll,
  allSelected,
  contentTypeLabel,
  onSelectAllPages,
  onClearSelection
}: SmartSelectionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-gray-100 border border-gray-300 rounded px-[242px] py-[7px] mb-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {allSelected ? (
          <Button
            variant="secondary"
            size="sm"
            className="bg-white border border-gray-300 shadow-sm h-8 px-3"
          >
            Selected All {totalAll} records {contentTypeLabel}
          </Button>
        ) : (
          selectedCount === totalOnPage && totalAll > totalOnPage ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={onSelectAllPages}
              className="bg-white border border-gray-300 shadow-sm h-8 px-3 hover:bg-gray-50"
            >
              Select All {totalAll} records in {contentTypeLabel}
            </Button>
          ) : null
        )}
        
        <span className="text-sm">
          {selectedCount} record{selectedCount !== 1 ? 's' : ''} selected.{' '}
          <button
            onClick={onClearSelection}
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Deselect
          </button>
        </span>
      </div>
    </div>
  );
}
