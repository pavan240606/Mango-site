import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onSelectionChange: (selectedValues: string[]) => void;
  placeholder: string;
  className?: string;
  allKey?: string; // Key for "All" option
}

export function MultiSelectFilter({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  className = "",
  allKey = "all"
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<string[]>(selectedValues);

  // Update pending selection when selectedValues prop changes
  useEffect(() => {
    setPendingSelection(selectedValues);
  }, [selectedValues]);

  const handleToggleOption = (optionValue: string) => {
    if (optionValue === allKey) {
      // If "All" is selected, clear all other selections
      setPendingSelection([allKey]);
    } else {
      setPendingSelection(prev => {
        // Remove "All" if it's selected and we're selecting something else
        const withoutAll = prev.filter(val => val !== allKey);
        
        if (withoutAll.includes(optionValue)) {
          // Remove the option if it's already selected
          const newSelection = withoutAll.filter(val => val !== optionValue);
          // If nothing is selected, add "All"
          return newSelection.length === 0 ? [allKey] : newSelection;
        } else {
          // Add the option
          return [...withoutAll, optionValue];
        }
      });
    }
  };

  const handleApply = () => {
    onSelectionChange(pendingSelection);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setPendingSelection(selectedValues);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedValues.includes(allKey) || selectedValues.length === 0) {
      return placeholder;
    }
    
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || placeholder;
    }
    
    return `${selectedValues.length} selected`;
  };

  const isAllSelected = pendingSelection.includes(allKey);
  const hasChanges = JSON.stringify(pendingSelection.sort()) !== JSON.stringify(selectedValues.sort());

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between h-9 ${className}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{getDisplayText()}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="max-h-80 overflow-auto">
          <div className="p-3 space-y-2">
            {options.map((option) => {
              const isSelected = pendingSelection.includes(option.value);
              const isAllOption = option.value === allKey;
              
              return (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                  onClick={() => handleToggleOption(option.value)}
                >
                  <Checkbox
                    id={option.value}
                    checked={isSelected}
                    onCheckedChange={() => {}} // Handled by parent div click
                    className="shrink-0"
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                  >
                    {option.label}
                  </label>
                  {isSelected && !isAllOption && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Apply/Cancel buttons */}
        <div className="border-t p-3 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!hasChanges}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}