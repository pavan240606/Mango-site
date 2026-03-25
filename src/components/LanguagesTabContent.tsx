import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion } from 'motion/react';
import { Download, Filter } from 'lucide-react';

interface LanguageModule {
  id: string;
  moduleName: string;
  total: number;
  languages: {
    [key: string]: number | null;
  };
}

interface LanguagesTabContentProps {
  isLoadingTable?: boolean;
}

export function LanguagesTabContent({ isLoadingTable = false }: LanguagesTabContentProps) {
  // Filter states
  const [moduleNameFilter, setModuleNameFilter] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState<'moduleName' | 'total' | 'language'>('total');

  // All language codes from the image
  const languageCodes = [
    'DE-AT', 'DE-CH', 'DE-DE', 'EN', 'EN-AU', 'EN-CA', 'EN-GB', 'EN-HK', 
    'EN-IE', 'EN-IN', 'EN-NZ', 'EN-PH', 'EN-SG'
  ];

  // Mock data based on the image
  const languageModules: LanguageModule[] = [
    {
      id: 'mod1',
      moduleName: 'Remote - Page Schema.module',
      total: 29973,
      languages: {
        'DE-AT': 1082, 'DE-CH': 1081, 'DE-DE': 1084, 'EN': 1, 'EN-AU': 1964,
        'EN-CA': 1964, 'EN-GB': 1, 'EN-HK': 1964, 'EN-IE': 1964, 'EN-IN': 1964,
        'EN-NZ': 1964, 'EN-PH': 1964, 'EN-SG': 1964
      }
    },
    {
      id: 'mod2',
      moduleName: 'Remote - Hero - Expanded',
      total: 28845,
      languages: {
        'DE-AT': 904, 'DE-CH': 904, 'DE-DE': 907, 'EN': null, 'EN-AU': 1741,
        'EN-CA': 1741, 'EN-GB': 1741, 'EN-HK': 1741, 'EN-IE': 1741, 'EN-IN': 1741,
        'EN-NZ': 1741, 'EN-PH': 1741, 'EN-SG': 1741
      }
    },
    {
      id: 'mod3',
      moduleName: 'Remote - Side Navigation',
      total: 28741,
      languages: {
        'DE-AT': 899, 'DE-CH': 899, 'DE-DE': 902, 'EN': null, 'EN-AU': 1736,
        'EN-CA': 1736, 'EN-GB': 1736, 'EN-HK': 1736, 'EN-IE': 1736, 'EN-IN': 1736,
        'EN-NZ': 1736, 'EN-PH': 1736, 'EN-SG': 1736
      }
    },
    {
      id: 'mod4',
      moduleName: 'Remote - CE - SE - Code',
      total: 24146,
      languages: {
        'DE-AT': 713, 'DE-CH': 713, 'DE-DE': 716, 'EN': null, 'EN-AU': 1600,
        'EN-CA': 1600, 'EN-GB': 1500, 'EN-HK': 1500, 'EN-IE': 1500, 'EN-IN': 1500,
        'EN-NZ': 1500, 'EN-PH': 1600, 'EN-SG': 1500
      }
    },
    {
      id: 'mod5',
      moduleName: 'Remote - Accordion',
      total: 8664,
      languages: {
        'DE-AT': 361, 'DE-CH': 361, 'DE-DE': 366, 'EN': null, 'EN-AU': 433,
        'EN-CA': 433, 'EN-GB': 436, 'EN-HK': 433, 'EN-IE': 433, 'EN-IN': 433,
        'EN-NZ': 433, 'EN-PH': 433, 'EN-SG': 433
      }
    },
    {
      id: 'mod6',
      moduleName: 'Remote - Benefits Guide',
      total: 4774,
      languages: {
        'DE-AT': null, 'DE-CH': null, 'DE-DE': null, 'EN': null, 'EN-AU': 434,
        'EN-CA': 434, 'EN-GB': 434, 'EN-HK': 434, 'EN-IE': 434, 'EN-IN': 434,
        'EN-NZ': 434, 'EN-PH': 434, 'EN-SG': 434
      }
    },
    {
      id: 'mod7',
      moduleName: 'Remote - Facts',
      total: 4753,
      languages: {
        'DE-AT': 191, 'DE-CH': 191, 'DE-DE': 191, 'EN': null, 'EN-AU': 246,
        'EN-CA': 246, 'EN-GB': 246, 'EN-HK': 246, 'EN-IE': 246, 'EN-IN': 246,
        'EN-NZ': 246, 'EN-PH': 246, 'EN-SG': 246
      }
    },
    {
      id: 'mod8',
      moduleName: 'Remote - Page Setting.module',
      total: 2710,
      languages: {
        'DE-AT': 45, 'DE-CH': 45, 'DE-DE': 48, 'EN': 1, 'EN-AU': 58,
        'EN-CA': 58, 'EN-GB': 58, 'EN-HK': 58, 'EN-IE': 58, 'EN-IN': 59,
        'EN-NZ': 59, 'EN-PH': 59, 'EN-SG': 59
      }
    },
    {
      id: 'mod9',
      moduleName: 'Remote - Statistics - CE',
      total: 2710,
      languages: {
        'DE-AT': 92, 'DE-CH': 92, 'DE-DE': 92, 'EN': null, 'EN-AU': 142,
        'EN-CA': 142, 'EN-GB': 142, 'EN-HK': 142, 'EN-IE': 142, 'EN-IN': 142,
        'EN-NZ': 142, 'EN-PH': 142, 'EN-SG': 142
      }
    },
    {
      id: 'mod10',
      moduleName: 'Remote - Unique Page ID.module',
      total: 2394,
      languages: {
        'DE-AT': 41, 'DE-CH': 41, 'DE-DE': 41, 'EN': null, 'EN-AU': 40,
        'EN-CA': 40, 'EN-GB': 40, 'EN-HK': 40, 'EN-IE': 40, 'EN-IN': 41,
        'EN-NZ': 41, 'EN-PH': 41, 'EN-SG': 41
      }
    },
    {
      id: 'mod11',
      moduleName: 'Remote - Accordion Table',
      total: 2118,
      languages: {
        'DE-AT': 96, 'DE-CH': 96, 'DE-DE': 96, 'EN': null, 'EN-AU': 96,
        'EN-CA': 96, 'EN-GB': 96, 'EN-HK': 96, 'EN-IE': 96, 'EN-IN': 96,
        'EN-NZ': 96, 'EN-PH': 96, 'EN-SG': 96
      }
    },
    {
      id: 'mod12',
      moduleName: 'Remote - Image Grid',
      total: 1857,
      languages: {
        'DE-AT': 79, 'DE-CH': 78, 'DE-DE': 79, 'EN': null, 'EN-AU': 99,
        'EN-CA': 99, 'EN-GB': 99, 'EN-HK': 99, 'EN-IE': 99, 'EN-IN': 99,
        'EN-NZ': 99, 'EN-PH': 98, 'EN-SG': 99
      }
    }
  ];

  const handleExportCSV = () => {
    console.log('Exporting Languages CSV...');
  };

  const resetFilters = () => {
    setModuleNameFilter('');
    setSelectedLanguage('all');
    setSortBy('total');
  };

  const filteredModules = languageModules
    .filter(module => {
      if (moduleNameFilter && !module.moduleName.toLowerCase().includes(moduleNameFilter.toLowerCase())) {
        return false;
      }
      return true;
    })
    .filter(module => {
      if (selectedLanguage !== 'all') {
        return module.languages[selectedLanguage] !== null && module.languages[selectedLanguage] !== undefined;
      }
      return true;
    })
    .sort((a, b) => {
      // Default to descending order for better UX
      const multiplier = -1;
      
      if (sortBy === 'moduleName') {
        return a.moduleName.localeCompare(b.moduleName) * multiplier;
      } else if (sortBy === 'total') {
        return (a.total - b.total) * multiplier;
      } else if (sortBy === 'language' && selectedLanguage !== 'all') {
        const aCount = a.languages[selectedLanguage] ?? 0;
        const bCount = b.languages[selectedLanguage] ?? 0;
        return (aCount - bCount) * multiplier;
      }
      return 0;
    });

  return (
    <motion.div
      key="languages"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Filters Card */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Module Name</label>
            <Input 
              placeholder="Filter by module name"
              value={moduleNameFilter}
              onChange={(e) => setModuleNameFilter(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Language</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {languageCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Sort By</label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'moduleName' | 'total' | 'language')}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moduleName">Module Name</SelectItem>
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="language">Selected Language</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-end gap-3">
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
        </div>
      </Card>

      {/* Table */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-600">
            Showing {filteredModules.length} of {languageModules.length} modules
          </p>
          <Button 
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="h-8 px-3 gap-2 text-sm"
          >
            <Download className="h-3.5 w-3.5" />
            Export to Google Sheets
          </Button>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
                    Module Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  {languageCodes.map((code) => (
                    <th key={code} className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[80px]">
                      {code}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredModules.length > 0 ? (
                  filteredModules.map((module) => (
                    <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-200 hover:bg-gray-50">
                        {module.moduleName}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {module.total.toLocaleString()}
                      </td>
                      {languageCodes.map((code) => (
                        <td key={`${module.id}-${code}`} className="py-3 px-4 text-sm text-gray-900">
                          {module.languages[code] !== null && module.languages[code] !== undefined
                            ? module.languages[code]!.toLocaleString()
                            : '—'}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={languageCodes.length + 2} className="py-12 text-center">
                      <p className="text-sm text-gray-600">No modules match the current filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}