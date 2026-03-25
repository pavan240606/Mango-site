import { useState } from 'react';
import { Clock, Download, Filter, Search, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface FileAsset {
  sr: number;
  fileName: string;
  fileType: string;
  filePath: string;
  usedOn: number;
  primaryPages: number;
  localizedPages: number;
  lastScanAt: string;
}

export function FilesAssets() {
  const [fileNameFilter, setFileNameFilter] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [foundInFilter, setFoundInFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const [lastCrawled] = useState('February 27, 2026 06:32:00');

  // Mock data
  const mockFiles: FileAsset[] = [
    {
      sr: 1,
      fileName: 'hero-banner.jpg',
      fileType: 'Image',
      filePath: 'https://cdn.hubspot.com/images/hero-banner.jpg',
      usedOn: 24,
      primaryPages: 18,
      localizedPages: 6,
      lastScanAt: 'February 27, 2026 06:32:00'
    },
    {
      sr: 2,
      fileName: 'company-logo.svg',
      fileType: 'Image',
      filePath: 'https://cdn.hubspot.com/images/company-logo.svg',
      usedOn: 156,
      primaryPages: 124,
      localizedPages: 32,
      lastScanAt: 'February 27, 2026 06:32:00'
    },
    {
      sr: 3,
      fileName: 'product-demo.mp4',
      fileType: 'Video',
      filePath: 'https://cdn.hubspot.com/videos/product-demo.mp4',
      usedOn: 8,
      primaryPages: 8,
      localizedPages: 0,
      lastScanAt: 'February 27, 2026 06:32:00'
    },
    {
      sr: 4,
      fileName: 'whitepaper-2025.pdf',
      fileType: 'PDF',
      filePath: 'https://cdn.hubspot.com/documents/whitepaper-2025.pdf',
      usedOn: 12,
      primaryPages: 12,
      localizedPages: 0,
      lastScanAt: 'February 27, 2026 06:32:00'
    },
    {
      sr: 5,
      fileName: 'icon-check.svg',
      fileType: 'Image',
      filePath: 'https://cdn.hubspot.com/icons/icon-check.svg',
      usedOn: 89,
      primaryPages: 67,
      localizedPages: 22,
      lastScanAt: 'February 27, 2026 06:32:00'
    },
  ];

  const [files] = useState<FileAsset[]>(mockFiles);

  const resetFilters = () => {
    setFileNameFilter('');
    setFileTypeFilter('all');
    setFoundInFilter('all');
    setSortBy('name');
  };

  const handleExportCSV = () => {
    console.log('Exporting Files & Assets CSV...');
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
          
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">Files & Assets</h1>
              <p className="text-sm text-gray-600">View and manage all media files discovered across your HubSpot pages.</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last crawled: {lastCrawled}</span>
            </div>
          </div>

          {/* Filters Card */}
          <Card className="p-6 bg-white border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">File Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search files..."
                    value={fileNameFilter}
                    onChange={(e) => setFileNameFilter(e.target.value)}
                    className="h-9 text-sm pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">File Type</label>
                <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="pdfs">PDFs</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Found In</label>
                <Select value={foundInFilter} onValueChange={setFoundInFilter}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pages</SelectItem>
                    <SelectItem value="blog">Blog Posts</SelectItem>
                    <SelectItem value="website">Website Pages</SelectItem>
                    <SelectItem value="landing">Landing Pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="usage">Usage Count</SelectItem>
                    <SelectItem value="type">File Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Button 
                className="bg-teal-600 hover:bg-teal-700 text-white h-9 px-4 rounded-lg font-medium text-sm"
              >
                <Filter className="h-3.5 w-3.5 mr-2" />
                Apply Filters
              </Button>
              <Button 
                variant="ghost"
                className="h-9 px-4 text-gray-600 text-sm"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </Card>

          {/* Table Card */}
          <Card className="p-6 bg-white border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Total Files: {files.length}</p>
              <Button 
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
                className="h-8 px-3 gap-2 text-sm"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        SR
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        File Name
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        File Type
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        File URL / Path
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Used On
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Primary Pages
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Localized Pages
                      </th>
                      <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        Last Scan At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {files.map((file) => (
                      <tr key={file.sr} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{file.sr}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{file.fileName}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{file.fileType}</td>
                        <td className="py-3 px-4 text-sm">
                          <a 
                            href={file.filePath} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
                          >
                            <span className="truncate max-w-xs">{file.filePath}</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{file.usedOn}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{file.primaryPages}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{file.localizedPages}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{file.lastScanAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
