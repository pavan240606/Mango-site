import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from './ui/button';

interface AdvancedFilterDropdownProps {
  label: string;
  placeholder: string;
  options: string[];
  selectedValues: string[];
  onShowMore: () => void;
  onClear: () => void;
  onSelect?: (value: string) => void;
  className?: string;
}

export function AdvancedFilterDropdown({
  label,
  placeholder,
  options,
  selectedValues,
  onShowMore,
  onClear,
  onSelect,
  className = ''
}: AdvancedFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Show first 5 options
  const displayOptions = options.slice(0, 5);
  const hasMore = options.length > 5;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayText = selectedValues.length > 0
    ? `${selectedValues.length} selected`
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors text-sm"
      >
        <span className={`truncate pr-2 ${selectedValues.length > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
          {displayText}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {selectedValues.length > 0 && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </div>
          )}
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          <div className="relative">
            {/* Options List */}
            <div className="py-1 overflow-hidden">
              {displayOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer truncate"
                  onClick={() => {
                    // This is just for preview - actual selection happens in modal
                    setIsOpen(false);
                    if (onSelect) {
                      onSelect(option);
                    }
                  }}
                  title={option}
                >
                  {option}
                </div>
              ))}
            </div>

            {/* Show More Button Section */}
            {hasMore && (
              <div className="px-3 py-3 bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm text-[10px] font-bold rounded-[64px] px-[44px] py-[0px] mx-[-4px] my-[0px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    onShowMore();
                  }}
                >
                  Show More ({options.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}