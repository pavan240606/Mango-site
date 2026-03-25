import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Settings, ChevronDown, ChevronRight, Search, GripVertical, X, Info } from 'lucide-react';
import { useColumnPreferences, ContentType } from './ColumnPreferencesContext';
import { toast } from 'sonner@2.0.3';

interface Column {
  key: string;
  label: string;
  selected: boolean;
}

export function ColumnSettingsTab() {
  const { getColumnPreferences, getAvailableColumns, updateColumnPreferences } = useColumnPreferences();
  const [expandedContentType, setExpandedContentType] = useState<ContentType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState<Column[]>([]);
  const [orderedSelectedColumns, setOrderedSelectedColumns] = useState<string[]>([]);

  const contentTypes: ContentType[] = [
    'Website Page',
    'Landing Page', 
    'Blog Post',
    'Blogs',
    'Tags',
    'Authors',
    'URL Redirects',
    'HubDB Tables'
  ];

  const handleContentTypeClick = (contentType: ContentType) => {
    if (expandedContentType === contentType) {
      setExpandedContentType(null);
      setSearchQuery('');
    } else {
      setExpandedContentType(contentType);
      setSearchQuery('');
      
      // Initialize columns and ordered selected columns
      const available = getAvailableColumns(contentType);
      const selected = getColumnPreferences(contentType);
      
      setColumns(available.map(col => ({
        key: col.toLowerCase().replace(/\s+/g, ''),
        label: col,
        selected: selected.includes(col)
      })));
      
      setOrderedSelectedColumns(selected.filter(col => available.includes(col)));
    }
  };

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

  const handleSavePreferences = (contentType: ContentType) => {
    updateColumnPreferences(contentType, orderedSelectedColumns);
    toast.success(`Column preferences saved for ${contentType}`);
    setExpandedContentType(null);
    setSearchQuery('');
  };

  const handleCancelChanges = (contentType: ContentType) => {
    setExpandedContentType(null);
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Column Settings</h2>
        <p className="text-gray-600">
          Customize which columns appear in your Edit and Export tables for each content type.
        </p>
      </div>

      {/* Content Types */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-lg text-gray-900">Table Column Preferences</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center cursor-help hover:bg-gray-200 transition-colors">
                    <Info className="h-3 w-3 text-gray-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Customize which columns are visible in your Edit and Export tables for each content type. You can select, deselect, and reorder columns to match your workflow preferences.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {contentTypes.map((contentType) => {
            const isExpanded = expandedContentType === contentType;
            const currentPreferences = getColumnPreferences(contentType);
            const hasChanges = isExpanded && 
              JSON.stringify(orderedSelectedColumns) !== JSON.stringify(currentPreferences);

            return (
              <div key={contentType} className="border border-gray-200 rounded-lg">
                {/* Content Type Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                  onClick={() => handleContentTypeClick(contentType)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="font-medium text-gray-900">{contentType}</span>
                    <Badge variant="secondary" className="text-xs">
                      {isExpanded ? selectedCount : currentPreferences.length} columns
                    </Badge>
                    {hasChanges && (
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 bg-orange-50">
                        Unsaved changes
                      </Badge>
                    )}
                  </div>
                  
                </div>

                {/* Column Selection - Same layout as ColumnReorderModal */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="mt-4">
                      <div className="flex gap-8">
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

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelChanges(contentType)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSavePreferences(contentType)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">i</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">How it works</h4>
              <p className="text-sm text-blue-800">
                Your column preferences will automatically apply to all Edit and Export tables. 
                You can also access these settings directly from the column reorder modal in any table.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
