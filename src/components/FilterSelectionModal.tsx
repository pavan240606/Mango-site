import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';

interface FilterSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterLabel: string;
  allOptions: string[];
  selectedValues: string[];
  onApply: (selected: string[]) => void;
}

export function FilterSelectionModal({
  isOpen,
  onClose,
  filterLabel,
  allOptions,
  selectedValues,
  onApply
}: FilterSelectionModalProps) {
  const [localSelected, setLocalSelected] = useState<string[]>(selectedValues);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLocalSelected(selectedValues);
  }, [selectedValues, isOpen]);

  if (!isOpen) return null;

  const filteredOptions = allOptions.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (value: string) => {
    if (localSelected.includes(value)) {
      setLocalSelected(localSelected.filter(v => v !== value));
    } else {
      setLocalSelected([...localSelected, value]);
    }
  };

  const handleToggleAll = () => {
    if (localSelected.length === filteredOptions.length) {
      setLocalSelected([]);
    } else {
      setLocalSelected(filteredOptions);
    }
  };

  const handleApply = () => {
    onApply(localSelected);
    onClose();
  };

  const allSelected = localSelected.length === filteredOptions.length && filteredOptions.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-xl">Select {filterLabel}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${filterLabel.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Selection Actions */}
        <div className="px-6 py-3 border-b bg-gray-50 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            {localSelected.length} of {filteredOptions.length} selected
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleAll}
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-3">
              {filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleToggle(option)}
                >
                  <Checkbox
                    checked={localSelected.includes(option)}
                    onCheckedChange={() => handleToggle(option)}
                  />
                  <label className="cursor-pointer flex-1 text-sm">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Footer */}
        {localSelected.length > 0 && (
          <div className="p-6 border-t flex justify-end gap-3 flex-shrink-0">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
