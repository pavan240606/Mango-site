import { useState } from 'react';
import { FileSpreadsheet, Upload, File } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';

interface ImportsContentProps {
  onShowLogs: () => void;
}

const contentTypes = [
  { value: 'landing-page', label: 'Landing Pages' },
  { value: 'website-page', label: 'Website Pages' },
  { value: 'blog-post', label: 'Blog Posts' },
  { value: 'blog-listing-page', label: 'Blog Listing Pages' },
  { value: 'knowledge-article', label: 'Knowledge Articles' },
  { value: 'email', label: 'Marketing Emails' },
  { value: 'form', label: 'Forms' },
];

const mockSheets = [
  { value: 'sheet-1', label: 'Marketing Landing Pages' },
  { value: 'sheet-2', label: 'Product Pages' },
  { value: 'sheet-3', label: 'Campaign Data' },
];

const mockTabs = [
  { value: 'tab-1', label: 'Q1 2024' },
  { value: 'tab-2', label: 'Q2 2024' },
  { value: 'tab-3', label: 'Q3 2024' },
];

export function ImportsContent({ onShowLogs }: ImportsContentProps) {
  const [selectedContentType, setSelectedContentType] = useState('landing-page');
  const [dataSource, setDataSource] = useState<'google-sheets' | 'upload-file'>('google-sheets');
  const [selectedSheet, setSelectedSheet] = useState('');
  const [selectedTab, setSelectedTab] = useState('');

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header with Content Type Selector */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6" />
              Import Data
            </h1>
            <p className="text-gray-600">
              Choose a content type and select your data source to preview and import your content.
            </p>
          </div>
          
          {/* Content Type Selector */}
          <Select value={selectedContentType} onValueChange={setSelectedContentType}>
            <SelectTrigger className="w-56 bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex gap-1 px-6 pt-4">
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              dataSource === 'google-sheets'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setDataSource('google-sheets')}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Google Sheets
          </Button>
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              dataSource === 'upload-file'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setDataSource('upload-file')}
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl">
          {/* Data Source Selection */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <div className="p-6">
              {/* Google Sheets Selection */}
              {dataSource === 'google-sheets' && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <File className="h-5 w-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">Select Google Sheet</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select a Sheet
                      </label>
                      <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select a sheet..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockSheets.map((sheet) => (
                            <SelectItem key={sheet.value} value={sheet.value}>
                              {sheet.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select a Tab
                      </label>
                      <Select value={selectedTab} onValueChange={setSelectedTab}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select a tab..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockTabs.map((tab) => (
                            <SelectItem key={tab.value} value={tab.value}>
                              {tab.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-gray-700 text-white hover:bg-gray-800"
                      disabled={!selectedSheet || !selectedTab}
                    >
                      <File className="h-4 w-4 mr-2" />
                      Preview Data
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload File Section */}
              {dataSource === 'upload-file' && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Upload className="h-5 w-5 text-gray-700" />
                    <h3 className="font-semibold text-gray-900">Upload File</h3>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium text-gray-900">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">CSV, XLSX or XLS (Max 10MB)</p>
                    
                    <Button
                      variant="outline"
                      className="mt-4"
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}