import { useState } from 'react';
import { X, Search, GripVertical, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

interface Column {
  key: string;
  label: string;
  selected: boolean;
}

interface ColumnReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableColumns: string[];
  selectedColumns: string[];
  onApply: (selectedColumns: string[]) => void;
  onGoToSettings?: () => void;
  contentType?: string;
}

export function ColumnReorderModal({
  isOpen,
  onClose,
  availableColumns,
  selectedColumns,
  onApply,
  onGoToSettings,
  contentType
}: ColumnReorderModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState<Column[]>(() => {
    return availableColumns.map(col => ({
      key: col.toLowerCase().replace(/\s+/g, ''),
      label: col,
      selected: selectedColumns.includes(col)
    }));
  });
  const [orderedSelectedColumns, setOrderedSelectedColumns] = useState<string[]>(
    selectedColumns.filter(col => availableColumns.includes(col))
  );

  const filteredColumns = columns.filter(col => 
    col.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = columns.filter(col => col.selected).length;

  const handleColumnToggle = (columnKey: string, checked: boolean) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column) return;

    setColumns(prev => prev.map(col => 
      col.key === columnKey ? { ...col, selected: checked } : col
    ));

    if (checked) {
      setOrderedSelectedColumns(prev => [...prev, column.label]);
    } else {
      setOrderedSelectedColumns(prev => prev.filter(col => col !== column.label));
    }
  };

  const handleRemoveSelected = (columnLabel: string) => {
    setColumns(prev => prev.map(col => 
      col.label === columnLabel ? { ...col, selected: false } : col
    ));
    setOrderedSelectedColumns(prev => prev.filter(col => col !== columnLabel));
  };

  const handleReorderSelected = (dragIndex: number, hoverIndex: number) => {
    const draggedColumn = orderedSelectedColumns[dragIndex];
    const newOrder = [...orderedSelectedColumns];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedColumn);
    setOrderedSelectedColumns(newOrder);
  };

  const handleApply = () => {
    onApply(orderedSelectedColumns);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original state
    setColumns(availableColumns.map(col => ({
      key: col.toLowerCase().replace(/\s+/g, ''),
      label: col,
      selected: selectedColumns.includes(col)
    })));
    setOrderedSelectedColumns(selectedColumns.filter(col => availableColumns.includes(col)));
    onClose();
  };

  const handleRemoveAll = () => {
    setColumns(prev => prev.map(col => ({ ...col, selected: false })));
    setOrderedSelectedColumns([]);
  };

  const handleToggleAll = () => {
    const allSelected = columns.every(col => col.selected);
    
    if (allSelected) {
      // Deselect all
      setColumns(prev => prev.map(col => ({ ...col, selected: false })));
      setOrderedSelectedColumns([]);
    } else {
      // Select all
      setColumns(prev => prev.map(col => ({ ...col, selected: true })));
      setOrderedSelectedColumns(columns.map(col => col.label));
    }
  };

  const allSelected = columns.every(col => col.selected);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 modal-override [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="bg-[rgba(255,255,255,1)] text-white p-4 rounded-t-lg">
          <DialogTitle className="text-xl font-medium text-black">
            Edit columns{contentType ? ` for "${contentType}"` : ''}
          </DialogTitle>
          <DialogDescription className="hidden">
            Select and reorder the columns you'd like to see in the table
          </DialogDescription>
          <div className="flex items-center justify-between mt-[-11px]">
            <p className="text-gray-600">
              Select the columns you'd like to see in this table.
            </p>
            {onGoToSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoToSettings}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Manage all columns
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col min-h-0">
          <div className="flex gap-8 flex-1 min-h-0">
            {/* Left Side - Column Options */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-black uppercase tracking-wide">
                  COLUMN OPTIONS
                </h3>
                <Button
                  variant="link"
                  onClick={handleToggleAll}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                >
                  {allSelected ? 'Deselect all' : 'Select all'}
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search columns"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Column List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredColumns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-3">
                    <Checkbox
                      id={column.key}
                      checked={column.selected}
                      onCheckedChange={(checked) => handleColumnToggle(column.key, !!checked)}
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <label
                      htmlFor={column.key}
                      className="text-sm text-gray-700 flex-1 cursor-pointer"
                    >
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="w-px bg-gray-200 flex-shrink-0"></div>

            {/* Right Side - Selected Columns */}
            <div className="flex-1">
              <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">
                SELECTED COLUMNS ({selectedCount})
              </h3>

              {/* Selected Items */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {orderedSelectedColumns.map((columnLabel, index) => (
                  <div
                    key={columnLabel}
                    className="bg-gray-100 border border-gray-200 rounded px-3 py-2 flex items-center justify-between"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', index.toString());
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                      handleReorderSelected(dragIndex, index);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <span className="text-sm text-gray-700">{columnLabel}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSelected(columnLabel)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}