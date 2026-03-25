import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableHeaders: string[];
  onExportComplete: () => void;
}

interface Field {
  id: string;
  label: string;
  readOnly?: boolean;
}

const exportFields = {
  required: [
    { id: 'id', label: 'Id', readOnly: true },
    { id: 'name', label: 'Name' }
  ],
  recommended: [
    { id: 'authorName', label: 'Author Name' },
    { id: 'campaign', label: 'Campaign' },
    { id: 'currentState', label: 'Current State', readOnly: true },
    { id: 'domain', label: 'Domain' },
    { id: 'language', label: 'Language' },
    { id: 'metaDescription', label: 'Meta Description' },
    { id: 'publishDate', label: 'Publish Date' },
    { id: 'published', label: 'Published', readOnly: true },
    { id: 'slug', label: 'Slug' },
    { id: 'state', label: 'State' },
    { id: 'url', label: 'Url' }
  ],
  additional: [
    { id: 'abStatus', label: 'Ab Status', readOnly: true },
    { id: 'archivedAt', label: 'Archived At', readOnly: true },
    { id: 'archivedInDashboard', label: 'Archived In Dashboard' },
    { id: 'attachedStylesheets', label: 'Attached Stylesheets', readOnly: true },
    { id: 'categoryId', label: 'Category Id', readOnly: true },
    { id: 'contentTypeCategory', label: 'Content Type Category', readOnly: true },
    { id: 'createdAt', label: 'Created At', readOnly: true },
    { id: 'createdById', label: 'Created By Id' },
    { id: 'featuredImage', label: 'Featured Image' },
    { id: 'featuredImageAltText', label: 'Featured Image Alt Text' },
    { id: 'footerHtml', label: 'Footer Html' },
    { id: 'headHtml', label: 'Head Html' },
    { id: 'htmlTitle', label: 'Html Title' },
    { id: 'layoutSections', label: 'Layout Sections', readOnly: true },
    { id: 'linkRelCanonicalUrl', label: 'Link Rel Canonical Url' },
    { id: 'mabExperimentId', label: 'Mab Experiment Id', readOnly: true },
    { id: 'pageRedirected', label: 'Page Redirected', readOnly: true },
    { id: 'publicAccessRules', label: 'Public Access Rules' },
    { id: 'publicAccessRulesEnabled', label: 'Public Access Rules Enabled', readOnly: true },
    { id: 'publishImmediately', label: 'Publish Immediately' },
    { id: 'subcategory', label: 'Subcategory', readOnly: true },
    { id: 'templatePath', label: 'Template Path', readOnly: true },
    { id: 'translatedFromId', label: 'Translated From Id' },
    { id: 'translations', label: 'Translations', readOnly: true },
    { id: 'updatedAt', label: 'Updated At', readOnly: true },
    { id: 'updatedById', label: 'Updated By Id' },
    { id: 'useFeaturedImage', label: 'Use Featured Image' },
    { id: 'widgetContainers', label: 'Widget Containers', readOnly: true },
    { id: 'widgets', label: 'Widgets' }
  ]
};

export function ExportModal({ isOpen, onClose, tableHeaders, onExportComplete }: ExportModalProps) {
  const [activeMethod, setActiveMethod] = useState<'csv' | 'sheets'>('csv');
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set([...exportFields.required.map(f => f.id), ...exportFields.recommended.map(f => f.id)])
  );
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [showCreateNewSheet, setShowCreateNewSheet] = useState(false);

  // Dummy data for existing sheets and tabs
  const existingSheets = [
    { id: 'sheet1', name: 'Marketing Data 2024' },
    { id: 'sheet2', name: 'Product Launch Metrics' },
    { id: 'sheet3', name: 'Customer Analytics' },
    { id: 'sheet4', name: 'Campaign Performance' }
  ];

  const existingTabs = [
    { id: 'tab1', name: 'Landing Pages' },
    { id: 'tab2', name: 'Blog Posts' },
    { id: 'tab3', name: 'Website Pages' },
    { id: 'tab4', name: 'Campaign Data' }
  ];

  const handleFieldToggle = (fieldId: string, isRequired: boolean = false) => {
    if (isRequired) return; // Can't uncheck required fields
    
    const newSelected = new Set(selectedFields);
    if (newSelected.has(fieldId)) {
      newSelected.delete(fieldId);
    } else {
      newSelected.add(fieldId);
    }
    setSelectedFields(newSelected);
  };

  const handleToggleSection = (section: 'recommended' | 'additional') => {
    const newSelected = new Set(selectedFields);
    const fieldsInSection = section === 'recommended' ? exportFields.recommended : exportFields.additional;
    
    // Check if all fields in this section are currently selected
    const allSelected = fieldsInSection.every(field => selectedFields.has(field.id));
    
    if (allSelected) {
      // If all are selected, deselect all
      fieldsInSection.forEach(field => {
        newSelected.delete(field.id);
      });
    } else {
      // If not all are selected, select all
      fieldsInSection.forEach(field => {
        newSelected.add(field.id);
      });
    }
    
    setSelectedFields(newSelected);
  };

  const handleExport = async () => {
    if (selectedFields.size === 0) {
      toast.error('Please select at least one field to export');
      return;
    }

    if (activeMethod === 'sheets' && !selectedSheet) {
      toast.error('Please select a Google Sheet');
      return;
    }

    if (activeMethod === 'sheets' && !selectedTab) {
      toast.error('Please select a tab');
      return;
    }

    try {
      if (activeMethod === 'csv') {
        // Create CSV content with proper formatting
        const headers = Array.from(selectedFields);
        const csvContent = headers.join(',') + '\n';
        
        // Add sample data row
        const sampleRow = headers.map(header => `Sample ${header}`).join(',');
        const fullCsvContent = csvContent + sampleRow;
        
        // Create blob and download
        const blob = new Blob([fullCsvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `hubspot-export-${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success('CSV file downloaded successfully');
      } else {
        // Simulate Google Sheets export
        toast.success('Exported successfully', {
          duration: 3000
        });
        
        // Close modal and return to exports page after 3 seconds
        setTimeout(() => {
          onClose();
          onExportComplete();
        }, 3000);
        return; // Don't execute the code after the try block
      }
      
      onExportComplete();
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Please try again.');
    }
  };

  const renderField = (field: Field, isRequired: boolean = false) => (
    <div key={field.id} className="flex items-center space-x-3">
      <Checkbox
        id={field.id}
        checked={selectedFields.has(field.id)}
        onCheckedChange={() => handleFieldToggle(field.id, isRequired)}
        disabled={isRequired}
        className="rounded-sm"
      />
      <label 
        htmlFor={field.id} 
        className="text-sm cursor-pointer flex items-center gap-2"
      >
        {field.label}
        {field.readOnly && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            Read-Only
          </span>
        )}
      </label>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="modal-override"
        style={{ 
          width: '90vw',
          height: '90vh',
          maxWidth: 'none',
          maxHeight: 'none',
          padding: '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0'
        }}
      >
        <DialogTitle className="sr-only">Export Content</DialogTitle>
        <DialogDescription className="sr-only">
          Choose your export method and select from all available properties to include. This will export the selected rows from the current page.
        </DialogDescription>
        
        {/* Header - Fixed */}
        <div style={{ flexShrink: 0, padding: '24px', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0' }}>Export Content</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', margin: '8px 0 0 0' }}>
              Choose your export method and select from all available properties to include. This will export the selected rows from the current page.
            </p>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div 
          style={{ 
            flex: '1 1 0%',
            overflowY: 'auto',
            minHeight: '0',
            backgroundColor: 'white'
          }}
        >
          <div style={{ padding: '24px' }}>
            {/* Export Method Selection */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Button
                  variant={activeMethod === 'csv' ? 'default' : 'outline'}
                  onClick={() => setActiveMethod('csv')}
                  className={`h-10 flex items-center justify-center gap-3 transition-colors ${
                    activeMethod === 'csv' 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-50 text-black hover:bg-gray-100 border-gray-300'
                  }`}
                >
                  <Download className="h-4 w-4" />
                  <span>Export as CSV</span>
                </Button>
                <Button
                  variant={activeMethod === 'sheets' ? 'default' : 'outline'}
                  onClick={() => setActiveMethod('sheets')}
                  className={`h-10 flex items-center justify-center gap-3 transition-colors ${
                    activeMethod === 'sheets' 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'bg-gray-50 text-black hover:bg-gray-100 border-gray-300'
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Export to Google Sheets</span>
                </Button>
              </div>
            </div>

            {/* Select Fields Section */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>Select Fields to Export</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Deselect all non-required fields
                    const requiredIds = exportFields.required.map(f => f.id);
                    setSelectedFields(new Set(requiredIds));
                  }}
                >
                  Deselect All
                </Button>
              </div>

              {/* Required Fields */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '24px' }}>
                  <h4 style={{ fontWeight: '500', color: '#374151', marginBottom: '16px', margin: '0 0 16px 0' }}>Required Fields</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {exportFields.required.map(field => renderField(field, true))}
                  </div>
                </div>
              </div>

              {/* Recommended Fields */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: '500', color: '#374151', margin: '0' }}>Recommended Fields</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleSection('recommended')}
                      className="text-sm"
                    >
                      {exportFields.recommended.every(field => selectedFields.has(field.id)) ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    {exportFields.recommended.map(field => renderField(field))}
                  </div>
                </div>
              </div>

              {/* Additional Fields */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ fontWeight: '500', color: '#374151', margin: '0' }}>Additional Fields</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleToggleSection('additional')}
                      className="text-sm"
                    >
                      {exportFields.additional.every(field => selectedFields.has(field.id)) ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    {exportFields.additional.map(field => renderField(field))}
                  </div>
                </div>
              </div>

              {/* Google Sheets Selection */}
              {activeMethod === 'sheets' && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                      <FileText className="h-5 w-5 text-gray-600" />
                      <h4 style={{ fontWeight: '500', color: '#374151', margin: '0' }}>Select Existing Google Sheet or Create New</h4>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {/* Choose Sheet */}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                          Choose Sheet
                        </label>
                        <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a sheet..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="create-new">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Plus className="h-4 w-4 text-blue-500" />
                                <span className="text-blue-500">Create New Sheet</span>
                              </div>
                            </SelectItem>
                            {existingSheets.map(sheet => (
                              <SelectItem key={sheet.id} value={sheet.id}>
                                {sheet.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Choose Tab */}
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '8px' }}>
                          Choose Tab
                        </label>
                        <Select 
                          value={selectedTab} 
                          onValueChange={setSelectedTab}
                          disabled={!selectedSheet}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose a tab..." />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedSheet === 'create-new' && (
                              <SelectItem value="new-tab">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Plus className="h-4 w-4 text-blue-500" />
                                  <span className="text-blue-500">Create New Tab</span>
                                </div>
                              </SelectItem>
                            )}
                            {selectedSheet && selectedSheet !== 'create-new' && existingTabs.map(tab => (
                              <SelectItem key={tab.id} value={tab.id}>
                                {tab.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div style={{ flexShrink: 0, padding: '24px', borderTop: '1px solid #e5e7eb', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleExport}
              disabled={
                selectedFields.size === 0 || 
                (activeMethod === 'sheets' && (!selectedSheet || !selectedTab))
              }
              className="gap-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500"
            >
              {activeMethod === 'csv' ? (
                <Download className="h-4 w-4" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              {activeMethod === 'csv' 
                ? `Export to CSV (1 rows)` 
                : `Export to Google Sheets`
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}