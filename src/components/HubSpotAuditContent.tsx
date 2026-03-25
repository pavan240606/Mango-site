import { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  FileCode,
  Package as PackageIcon,
  Database,
  Globe,
  Download,
  RefreshCw,
  ChevronRight,
  Copy,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  Info,
  FileQuestion,
  Check,
  X,
  TrendingUp,
  BarChart3,
  Pencil,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { PropertiesTabContent } from './PropertiesTabContent';
import { LanguagesTabContent } from './LanguagesTabContent';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { motion, AnimatePresence } from 'motion/react';
import { formatGlobalDateTime } from '../utils/dateFormat';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Skeleton } from './ui/skeleton';

type TabType = 'overview' | 'templates' | 'modules' | 'properties' | 'languages' | 'files';
type PropertiesViewType = 'hierarchy' | 'matrix';

interface Template {
  id: string;
  path: string;
  primaryCount: number;
  variantCount: number;
  lastScanAt: string;
}

interface Module {
  id: string;
  moduleId: string;
  name: string;
  folderPath: string;
  lastFoundOn: string;
  connectedToHubDB: boolean;
  primaryCount: number;
  origin: 'local' | 'global';
  visibility: 'visible' | 'hidden';
}

interface Property {
  id: string;
  name: string;
  type: 'group' | 'choice' | 'boolean' | 'text';
  optionsCount: number | null;
  hasChildren: boolean;
  childrenCount?: number;
  usedInModulesCount: number;
  children?: Property[];
}

interface FileAsset {
  id: string;
  fileName: string;
  fileType: string;
  filePath: string;
  usedOn: number;
  primaryPages: number;
  localizedPages: number;
  lastScanAt: string;
}

interface AuditStats {
  modules: number;
  templates: number;
  properties: number;
  languages: number;
  files: number;
  hubdbConnectedModules: number;
  lastCrawled: string | null;
}

interface HubSpotAuditContentProps {
  initialTab?: TabType;
}

export function HubSpotAuditContent({ initialTab = 'overview' }: HubSpotAuditContentProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertiesView, setPropertiesView] = useState<PropertiesViewType>('hierarchy');
  const [isLoading, setIsLoading] = useState(true);

  // Update activeTab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [stats, setStats] = useState<AuditStats>({
    modules: 128,
    templates: 24,
    properties: 4298,
    languages: 0,
    files: 245,
    hubdbConnectedModules: 4,
    lastCrawled: 'February 27, 2026 06:32:00'
  });

  // Templates state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatePathFilter, setTemplatePathFilter] = useState('');
  const [templatePrimaryCountFilter, setTemplatePrimaryCountFilter] = useState('');
  const [templateSortBy, setTemplateSortBy] = useState<'sr' | 'path' | 'primaryCount' | 'variantCount' | 'lastScanAt'>('primaryCount');
  const [templateSortOrder, setTemplateSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modules state
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleFilter, setModuleFilter] = useState('');
  const [moduleHubDBFilter, setModuleHubDBFilter] = useState('all');
  const [moduleVisibilityFilter, setModuleVisibilityFilter] = useState('all');
  const [modulePrimaryCountFilter, setModulePrimaryCountFilter] = useState('');
  const [moduleOriginFilter, setModuleOriginFilter] = useState('all');
  const [modulesPage, setModulesPage] = useState(1);
  const [modulesPerPage, setModulesPerPage] = useState(100);
  const [moduleSortBy, setModuleSortBy] = useState<'moduleId' | 'name' | 'folderPath' | 'lastFoundOn' | 'connectedToHubDB' | 'primaryCount' | 'origin' | 'visibility'>('primaryCount');
  const [moduleSortOrder, setModuleSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showModuleColumnSelector, setShowModuleColumnSelector] = useState(false);
  const [visibleModuleColumns, setVisibleModuleColumns] = useState({
    moduleId: true,
    name: true,
    folderPath: true,
    lastFoundOn: true,
    connectedToHubDB: true,
    primaryCount: true,
    origin: true,
    visibility: true
  });

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyNameFilter, setPropertyNameFilter] = useState('');
  const [expandedPropertyIds, setExpandedPropertyIds] = useState<Set<string>>(new Set());
  const [propertySortBy, setPropertySortBy] = useState<'sr' | 'name' | 'optionsCount' | 'type' | 'usedInModulesCount'>('sr');
  const [propertySortOrder, setPropertySortOrder] = useState<'asc' | 'desc'>('asc');

  // Matrix view state
  const [matrixPropertyFilter, setMatrixPropertyFilter] = useState('');
  const [matrixModuleFilter, setMatrixModuleFilter] = useState('');

  // Languages state
  const [languageModuleIdFilter, setLanguageModuleIdFilter] = useState('');
  const [languageLabelFilter, setLanguageLabelFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [languageSortBy, setLanguageSortBy] = useState('totalUsage');
  const [languageSortDirection, setLanguageSortDirection] = useState<'asc' | 'desc'>('desc');

  // Files state
  const [files, setFiles] = useState<FileAsset[]>([]);
  const [fileNameFilter, setFileNameFilter] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [fileUsedOnFilter, setFileUsedOnFilter] = useState('');
  const [fileSortBy, setFileSortBy] = useState<'sr' | 'fileName' | 'fileType' | 'usedOn' | 'primaryPages' | 'localizedPages'>('usedOn');
  const [fileSortOrder, setFileSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    
    // Simulate loading audit data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Real template data
    const realTemplates: Template[] = [
      { id: 't1', path: 'Themes/Remote 2025/templates/CE - Products.html', primaryCount: 549, variantCount: 9677, lastScanAt: '2026-02-27 06:32' },
      { id: 't2', path: 'Themes/Remote 2025/templates/CE - Benefits Detail.html', primaryCount: 434, variantCount: 4340, lastScanAt: '2026-02-27 06:32' },
      { id: 't3', path: 'Themes/Remote 2025/templates/CE - Grow your team.html', primaryCount: 326, variantCount: 6569, lastScanAt: '2026-02-27 06:32' },
      { id: 't4', path: 'Themes/Remote 2025/templates/CE - Employment Termination.html', primaryCount: 285, variantCount: 5254, lastScanAt: '2026-02-27 06:32' },
      { id: 't5', path: 'Themes/Remote 2025/templates/Remote - Informational Subpage.html', primaryCount: 152, variantCount: 2430, lastScanAt: '2026-02-27 06:32' },
      ...Array.from({ length: 19 }, (_, i) => ({
        id: `t${i + 6}`,
        path: `Themes/Remote 2025/templates/Template-${i + 1}.html`,
        primaryCount: Math.floor(Math.random() * 150) + 10,
        variantCount: Math.floor(Math.random() * 2000) + 100,
        lastScanAt: '2026-02-27 06:32'
      }))
    ];
    
    // Real module data
    const realModules: Module[] = [
      { id: 'm1', moduleId: '186916209439', name: 'Remote - Page Setting.module', folderPath: '/theme-assets/Remote 2025/modules/Remote - Page Setting.module', lastFoundOn: 'https://7405301.hs-sites.com/en/psp-retargeting', connectedToHubDB: false, primaryCount: 2151, origin: 'local', visibility: 'visible' },
      { id: 'm2', moduleId: '187845998124', name: 'Remote - Page Schema.module', folderPath: '/theme-assets/Remote 2025/modules/Remote - Page Schema.module', lastFoundOn: 'https://7405301.hs-sites.com/en/psp-retargeting', connectedToHubDB: false, primaryCount: 1996, origin: 'local', visibility: 'visible' },
      { id: 'm3', moduleId: '186388951442', name: 'Remote - Unique Page ID.module', folderPath: '/theme-assets/Remote 2025/modules/Remote - Unique Page ID.module', lastFoundOn: 'https://remote.com/de-de/events/hrex-2026', connectedToHubDB: false, primaryCount: 1852, origin: 'local', visibility: 'visible' },
      { id: 'm4', moduleId: '186531534596', name: 'Remote - Hero - Expanded', folderPath: '/theme-assets/Remote 2025/modules/Remote - Hero - Expanded.module', lastFoundOn: 'https://remote.com/country-explorer/denmark/benefits-guide/wellness-1', connectedToHubDB: true, primaryCount: 1752, origin: 'local', visibility: 'visible' },
      { id: 'm5', moduleId: '187067147357', name: 'Remote - Side Navigation', folderPath: '/theme-assets/Remote 2025/modules/Remote - Side Navigation.module', lastFoundOn: 'https://remote.com/country-explorer/denmark/benefits-guide/wellness-1', connectedToHubDB: false, primaryCount: 1744, origin: 'local', visibility: 'visible' },
      ...Array.from({ length: 123 }, (_, i) => ({
        id: `m${i + 6}`,
        moduleId: `${180000000000 + Math.floor(Math.random() * 10000000000)}`,
        name: `Module ${i + 6}`,
        folderPath: `/theme-assets/Remote 2025/modules/Module-${i + 6}.module`,
        lastFoundOn: `https://remote.com/sample-page-${i + 6}`,
        connectedToHubDB: i < 4,
        primaryCount: Math.floor(Math.random() * 1700) + 10,
        origin: (Math.random() > 0.3 ? 'local' : 'global') as 'local' | 'global',
        visibility: (Math.random() > 0.2 ? 'visible' : 'hidden') as 'visible' | 'hidden'
      }))
    ];
    
    // Real property data for hierarchy view
    const realProperties: Property[] = [
      { id: 'p1', name: 'Style', type: 'group', optionsCount: null, hasChildren: true, childrenCount: 355, usedInModulesCount: 68, children: [] },
      { id: 'p2', name: 'Heading Area', type: 'group', optionsCount: null, hasChildren: true, childrenCount: 397, usedInModulesCount: 46, children: [] },
      { id: 'p3', name: 'Style', type: 'group', optionsCount: null, hasChildren: true, childrenCount: 76, usedInModulesCount: 19, children: [] },
      { id: 'p4', name: 'Grid Items', type: 'group', optionsCount: null, hasChildren: true, childrenCount: 68, usedInModulesCount: 18, children: [] },
      { id: 'p5', name: 'Grid Columns Type', type: 'choice', optionsCount: 0, hasChildren: false, usedInModulesCount: 14, children: [] },
      { id: 'p6', name: 'CTAs', type: 'group', optionsCount: null, hasChildren: true, childrenCount: 104, usedInModulesCount: 13, children: [] },
      ...Array.from({ length: 724 }, (_, i) => ({
        id: `p${i + 7}`,
        name: `Property ${i + 7}`,
        type: (['group', 'choice', 'boolean', 'text'][Math.floor(Math.random() * 4)]) as 'group' | 'choice' | 'boolean' | 'text',
        optionsCount: Math.random() > 0.3 ? Math.floor(Math.random() * 100) : null,
        hasChildren: Math.random() > 0.7,
        childrenCount: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 1 : undefined,
        usedInModulesCount: Math.floor(Math.random() * 70) + 1,
        children: []
      }))
    ];
    
    // Real files data
    const realFiles: FileAsset[] = [
      { id: 'f1', fileName: 'hero-banner.jpg', fileType: 'Image', filePath: 'https://cdn.hubspot.com/images/hero-banner.jpg', usedOn: 24, primaryPages: 18, localizedPages: 6, lastScanAt: '2026-02-27 06:32' },
      { id: 'f2', fileName: 'company-logo.svg', fileType: 'Image', filePath: 'https://cdn.hubspot.com/images/company-logo.svg', usedOn: 156, primaryPages: 124, localizedPages: 32, lastScanAt: '2026-02-27 06:32' },
      { id: 'f3', fileName: 'product-demo.mp4', fileType: 'Video', filePath: 'https://cdn.hubspot.com/videos/product-demo.mp4', usedOn: 8, primaryPages: 8, localizedPages: 0, lastScanAt: '2026-02-27 06:32' },
      { id: 'f4', fileName: 'whitepaper-2025.pdf', fileType: 'PDF', filePath: 'https://cdn.hubspot.com/documents/whitepaper-2025.pdf', usedOn: 12, primaryPages: 12, localizedPages: 0, lastScanAt: '2026-02-27 06:32' },
      { id: 'f5', fileName: 'icon-check.svg', fileType: 'Image', filePath: 'https://cdn.hubspot.com/icons/icon-check.svg', usedOn: 89, primaryPages: 67, localizedPages: 22, lastScanAt: '2026-02-27 06:32' },
      { id: 'f6', fileName: 'testimonial-bg.jpg', fileType: 'Image', filePath: 'https://cdn.hubspot.com/images/testimonial-bg.jpg', usedOn: 45, primaryPages: 32, localizedPages: 13, lastScanAt: '2026-02-27 06:32' },
      { id: 'f7', fileName: 'datasheet-q1.pdf', fileType: 'PDF', filePath: 'https://cdn.hubspot.com/documents/datasheet-q1.pdf', usedOn: 19, primaryPages: 19, localizedPages: 0, lastScanAt: '2026-02-27 06:32' },
      ...Array.from({ length: 238 }, (_, i) => ({
        id: `f${i + 8}`,
        fileName: `file-${i + 8}.${['jpg', 'png', 'svg', 'pdf', 'mp4'][Math.floor(Math.random() * 5)]}`,
        fileType: (['Image', 'PDF', 'Video'][Math.floor(Math.random() * 3)]),
        filePath: `https://cdn.hubspot.com/files/file-${i + 8}`,
        usedOn: Math.floor(Math.random() * 150) + 1,
        primaryPages: Math.floor(Math.random() * 100) + 1,
        localizedPages: Math.floor(Math.random() * 30),
        lastScanAt: '2026-02-27 06:32'
      }))
    ];
    
    setTemplates(realTemplates);
    setModules(realModules);
    setProperties(realProperties);
    setFiles(realFiles);
    setIsLoading(false);
  };

  const handleRunCrawl = async () => {
    toast.info('Crawl started...', {
      description: 'Analyzing your HubSpot portal. This may take a few minutes.'
    });
    
    setIsLoadingTable(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCrawlTime = formatGlobalDateTime(new Date());
    setStats(prev => ({ ...prev, lastCrawled: newCrawlTime }));
    setIsLoadingTable(false);
    
    toast.success('Crawl completed', {
      description: 'Your portal data has been updated.'
    });
  };

  const handleExportCSV = (section: string) => {
    toast.success('CSV exported successfully', {
      description: `${section} data has been downloaded.`
    });
  };

  const handleExportAllCSV = () => {
    toast.success('All data exported successfully', {
      description: 'Complete audit data has been downloaded.'
    });
  };

  const handleCopyModuleId = (moduleId: string) => {
    navigator.clipboard.writeText(moduleId);
    toast.success('Module ID copied to clipboard');
  };

  const resetTemplateFilters = () => {
    setTemplatePathFilter('');
    setTemplatePrimaryCountFilter('');
    toast.info('Filters reset');
  };

  const resetModuleFilters = () => {
    setModuleFilter('');
    setModuleHubDBFilter('all');
    setModuleVisibilityFilter('all');
    setModulePrimaryCountFilter('');
    setModuleOriginFilter('all');
    toast.info('Filters reset');
  };

  const resetLanguageFilters = () => {
    setLanguageModuleIdFilter('');
    setLanguageLabelFilter('');
    setLanguageFilter('all');
    setLanguageSortBy('totalUsage');
    setLanguageSortDirection('desc');
    toast.info('Filters reset');
  };

  const resetFilesFilters = () => {
    setFileNameFilter('');
    setFileTypeFilter('all');
    setFileUsedOnFilter('');
    toast.info('Filters reset');
  };

  const togglePropertyExpanded = (id: string) => {
    setExpandedPropertyIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Sort and filter templates
  const filteredAndSortedTemplates = templates
    .filter(t => {
      if (templatePathFilter && !t.path.toLowerCase().includes(templatePathFilter.toLowerCase())) return false;
      if (templatePrimaryCountFilter && t.primaryCount !== parseInt(templatePrimaryCountFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      const multiplier = templateSortOrder === 'asc' ? 1 : -1;
      if (templateSortBy === 'sr') return 0;
      if (templateSortBy === 'path') return a.path.localeCompare(b.path) * multiplier;
      if (templateSortBy === 'primaryCount') return (a.primaryCount - b.primaryCount) * multiplier;
      if (templateSortBy === 'variantCount') return (a.variantCount - b.variantCount) * multiplier;
      if (templateSortBy === 'lastScanAt') return a.lastScanAt.localeCompare(b.lastScanAt) * multiplier;
      return 0;
    });

  // Filter and sort modules
  const filteredModules = modules.filter(m => {
    if (moduleFilter && !(m.moduleId.includes(moduleFilter) || m.name.toLowerCase().includes(moduleFilter.toLowerCase()))) return false;
    if (moduleHubDBFilter === 'yes' && !m.connectedToHubDB) return false;
    if (moduleHubDBFilter === 'no' && m.connectedToHubDB) return false;
    if (moduleVisibilityFilter === 'visible' && m.visibility !== 'visible') return false;
    if (moduleVisibilityFilter === 'hidden' && m.visibility !== 'hidden') return false;
    if (modulePrimaryCountFilter && m.primaryCount !== parseInt(modulePrimaryCountFilter)) return false;
    if (moduleOriginFilter !== 'all' && m.origin !== moduleOriginFilter) return false;
    return true;
  }).sort((a, b) => {
    const multiplier = moduleSortOrder === 'asc' ? 1 : -1;
    if (moduleSortBy === 'moduleId') return a.moduleId.localeCompare(b.moduleId) * multiplier;
    if (moduleSortBy === 'name') return a.name.localeCompare(b.name) * multiplier;
    if (moduleSortBy === 'folderPath') return a.folderPath.localeCompare(b.folderPath) * multiplier;
    if (moduleSortBy === 'lastFoundOn') return a.lastFoundOn.localeCompare(b.lastFoundOn) * multiplier;
    if (moduleSortBy === 'connectedToHubDB') return (Number(a.connectedToHubDB) - Number(b.connectedToHubDB)) * multiplier;
    if (moduleSortBy === 'primaryCount') return (a.primaryCount - b.primaryCount) * multiplier;
    if (moduleSortBy === 'origin') return a.origin.localeCompare(b.origin) * multiplier;
    if (moduleSortBy === 'visibility') return a.visibility.localeCompare(b.visibility) * multiplier;
    return 0;
  });

  const paginatedModules = filteredModules.slice(
    (modulesPage - 1) * modulesPerPage,
    modulesPage * modulesPerPage
  );

  const totalModulesPages = Math.ceil(filteredModules.length / modulesPerPage);

  // Filter and sort properties
  const filteredAndSortedProperties = properties
    .filter(p => {
      if (propertyNameFilter && !p.name.toLowerCase().includes(propertyNameFilter.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      const multiplier = propertySortOrder === 'asc' ? 1 : -1;
      if (propertySortBy === 'sr') return 0;
      if (propertySortBy === 'name') return a.name.localeCompare(b.name) * multiplier;
      if (propertySortBy === 'optionsCount') {
        const aVal = a.optionsCount ?? (a.hasChildren ? 999999 : -1);
        const bVal = b.optionsCount ?? (b.hasChildren ? 999999 : -1);
        return (aVal - bVal) * multiplier;
      }
      if (propertySortBy === 'type') return a.type.localeCompare(b.type) * multiplier;
      if (propertySortBy === 'usedInModulesCount') return (a.usedInModulesCount - b.usedInModulesCount) * multiplier;
      return 0;
    });

  // Matrix view filtering
  const filteredMatrixProperties = properties.filter(p => 
    !matrixPropertyFilter || p.name.toLowerCase().includes(matrixPropertyFilter.toLowerCase())
  );
  
  const filteredMatrixModules = modules.filter(m => 
    !matrixModuleFilter || m.name.toLowerCase().includes(matrixModuleFilter.toLowerCase())
  ).slice(0, 20); // Show first 20 modules for performance

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter(f => {
      if (fileNameFilter && !f.fileName.toLowerCase().includes(fileNameFilter.toLowerCase())) return false;
      if (fileTypeFilter !== 'all') {
        const typeMap: { [key: string]: string[] } = {
          'images': ['Image'],
          'videos': ['Video'],
          'pdfs': ['PDF'],
          'documents': ['Document']
        };
        const validTypes = typeMap[fileTypeFilter] || [];
        if (!validTypes.includes(f.fileType)) return false;
      }
      if (fileUsedOnFilter && f.usedOn !== parseInt(fileUsedOnFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      const multiplier = fileSortOrder === 'asc' ? 1 : -1;
      if (fileSortBy === 'sr') return 0;
      if (fileSortBy === 'fileName') return a.fileName.localeCompare(b.fileName) * multiplier;
      if (fileSortBy === 'fileType') return a.fileType.localeCompare(b.fileType) * multiplier;
      if (fileSortBy === 'usedOn') return (a.usedOn - b.usedOn) * multiplier;
      if (fileSortBy === 'primaryPages') return (a.primaryPages - b.primaryPages) * multiplier;
      if (fileSortBy === 'localizedPages') return (a.localizedPages - b.localizedPages) * multiplier;
      return 0;
    });

  const renderSortIcon = (column: string, currentSort: string, currentOrder: 'asc' | 'desc') => {
    if (column !== currentSort) {
      return <ArrowUpDown className="h-3 w-3" />;
    }
    return currentOrder === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />;
  };

  const handleSort = (column: string, setter: any, currentSort: string, orderSetter: any, currentOrder: 'asc' | 'desc') => {
    if (column === currentSort) {
      orderSetter(currentOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setter(column);
      orderSetter('desc');
    }
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
          
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">HubSpot Scan</h1>
              <p className="text-sm text-gray-600">Scan your HubSpot portal before migration. Analyze modules, templates, properties, and languages.</p>
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="p-6 bg-white border-gray-200">
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab('templates')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'templates'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    Templates
                  </button>
                  <button
                    onClick={() => setActiveTab('modules')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'modules'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    Modules
                  </button>
                  <button
                    onClick={() => setActiveTab('properties')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'properties'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    Properties
                  </button>
                  <button
                    onClick={() => setActiveTab('languages')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'languages'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    Languages
                  </button>
                  <button
                    onClick={() => setActiveTab('files')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'files'
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    Files
                  </button>
                </div>
              </div>

              {/* Content based on activeTab */}
              <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Last scan at */}
                {stats.lastCrawled && (
                  <div className="flex justify-end">
                    <p className="text-gray-500 text-sm">Last scan at: {stats.lastCrawled}</p>
                  </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card className="p-8 bg-white border-gray-200 hover:border-teal-200 transition-colors cursor-help">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                              <PackageIcon className="h-8 w-8 text-teal-600" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Modules</p>
                              <p className="text-3xl font-bold text-gray-900 mt-1.5">{stats.modules}</p>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total modules found in your portal</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card className="p-8 bg-white border-gray-200 hover:border-teal-200 transition-colors cursor-help">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                              <FileCode className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Templates</p>
                              <p className="text-3xl font-bold text-gray-900 mt-1.5">{stats.templates}</p>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total templates in your theme</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card className="p-8 bg-white border-gray-200 hover:border-teal-200 transition-colors cursor-help">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                              <Database className="h-8 w-8 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Properties</p>
                              <p className="text-3xl font-bold text-gray-900 mt-1.5">{stats.properties}</p>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total module properties</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card className="p-8 bg-white border-gray-200 hover:border-teal-200 transition-colors cursor-help">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                              <Globe className="h-8 w-8 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Languages</p>
                              <p className="text-3xl font-bold text-gray-900 mt-1.5">{stats.languages}</p>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Multi-language variations configured</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card className="p-8 bg-white border-gray-200 hover:border-teal-200 transition-colors cursor-help">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                              <Database className="h-8 w-8 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">HubDB Connected</p>
                              <p className="text-3xl font-bold text-gray-900 mt-1.5">{stats.hubdbConnectedModules}</p>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Modules connected to HubDB</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Filters */}
                <Card className="p-6 bg-white border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Template Path</label>
                      <Input 
                        placeholder="e.g. custom/page"
                        value={templatePathFilter}
                        onChange={(e) => setTemplatePathFilter(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="w-48">
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Primary Count</label>
                      <Input 
                        placeholder="Exact count"
                        type="number"
                        value={templatePrimaryCountFilter}
                        onChange={(e) => setTemplatePrimaryCountFilter(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
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
                        onClick={resetTemplateFilters}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Table */}
                <Card className="p-6 bg-white border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-gray-900">Total Templates: {filteredAndSortedTemplates.length}</p>
                    <Button 
                      onClick={() => handleExportCSV('Templates')}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 gap-2 text-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export to Google Sheets
                    </Button>
                  </div>
                  
                  {isLoadingTable ? renderLoadingSkeleton() : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                            <tr>
                              <th 
                                className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('path', setTemplateSortBy, templateSortBy, setTemplateSortOrder, templateSortOrder)}
                              >
                                <div className="flex items-center gap-1">
                                  Template Path
                                  {renderSortIcon('path', templateSortBy, templateSortOrder)}
                                </div>
                              </th>
                              <th 
                                className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('primaryCount', setTemplateSortBy, templateSortBy, setTemplateSortOrder, templateSortOrder)}
                              >
                                <div className="flex items-center gap-1">
                                  Primary Count
                                  {renderSortIcon('primaryCount', templateSortBy, templateSortOrder)}
                                </div>
                              </th>
                              <th 
                                className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('variantCount', setTemplateSortBy, templateSortBy, setTemplateSortOrder, templateSortOrder)}
                              >
                                <div className="flex items-center gap-1">
                                  Variant Count
                                  {renderSortIcon('variantCount', templateSortBy, templateSortOrder)}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAndSortedTemplates.map((template, index) => (
                              <tr 
                                key={template.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">{template.path}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{template.primaryCount}</td>
                                <td className="py-3 px-4 text-sm text-gray-900">{template.variantCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {activeTab === 'modules' && (
              <motion.div
                key="modules"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Filters */}
                <Card className="p-6 bg-white border-gray-200">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Module UID / Label</label>
                      <Input 
                        placeholder="Search..."
                        value={moduleFilter}
                        onChange={(e) => setModuleFilter(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Connected to HubDB</label>
                      <Select value={moduleHubDBFilter} onValueChange={setModuleHubDBFilter}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Visibility</label>
                      <Select value={moduleVisibilityFilter} onValueChange={setModuleVisibilityFilter}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="visible">Visible</SelectItem>
                          <SelectItem value="hidden">Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Primary Count</label>
                      <Input 
                        placeholder="Exact count"
                        type="number"
                        value={modulePrimaryCountFilter}
                        onChange={(e) => setModulePrimaryCountFilter(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Origin</label>
                      <Select value={moduleOriginFilter} onValueChange={setModuleOriginFilter}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="local">Local</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      className="bg-teal-600 hover:bg-teal-700 text-white h-9 px-4 rounded-lg font-medium text-sm"
                    >
                      <Filter className="h-3.5 w-3.5 mr-2" />
                      Apply Filters
                    </Button>
                    <Button 
                      variant="ghost"
                      className="h-9 px-4 text-gray-600 text-sm"
                      onClick={resetModuleFilters}
                    >
                      Reset
                    </Button>
                  </div>
                </Card>

                {/* Table */}
                <Card className="p-6 bg-white border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-600">Total Modules: {filteredModules.length}</p>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => setShowModuleColumnSelector(!showModuleColumnSelector)}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 gap-2 text-sm"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Columns
                      </Button>
                      <Button 
                        onClick={() => handleExportCSV('Modules')}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 gap-2 text-sm"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Export to Google Sheets
                      </Button>
                    </div>
                  </div>
                  
                  {/* Column Selector */}
                  {showModuleColumnSelector && (
                    <Card className="p-4 mb-4 bg-gray-50 border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-3">Select Columns to Display</p>
                      <div className="grid grid-cols-4 gap-3">
                        {Object.entries(visibleModuleColumns).map(([column, isVisible]) => (
                          <label key={column} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isVisible}
                              onChange={(e) => setVisibleModuleColumns(prev => ({
                                ...prev,
                                [column]: e.target.checked
                              }))}
                              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                              {column === 'moduleId' ? 'Module ID' : 
                               column === 'folderPath' ? 'Folder Path' :
                               column === 'lastFoundOn' ? 'Last Found On' :
                               column === 'connectedToHubDB' ? 'Connected to HubDB' :
                               column === 'primaryCount' ? 'Primary Count' :
                               column.charAt(0).toUpperCase() + column.slice(1)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </Card>
                  )}
                  
                  {isLoadingTable ? renderLoadingSkeleton() : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                            <tr>
                              {visibleModuleColumns.moduleId && (
                                <th 
                                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSort('moduleId', setModuleSortBy, moduleSortBy, setModuleSortOrder, moduleSortOrder)}
                                >
                                  <div className="flex items-center gap-1">
                                    Module ID
                                    {renderSortIcon('moduleId', moduleSortBy, moduleSortOrder)}
                                  </div>
                                </th>
                              )}
                              {visibleModuleColumns.name && (
                                <th 
                                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSort('name', setModuleSortBy, moduleSortBy, setModuleSortOrder, moduleSortOrder)}
                                >
                                  <div className="flex items-center gap-1">
                                    Name
                                    {renderSortIcon('name', moduleSortBy, moduleSortOrder)}
                                  </div>
                                </th>
                              )}
                              {visibleModuleColumns.folderPath && (
                                <th 
                                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSort('folderPath', setModuleSortBy, moduleSortBy, setModuleSortOrder, moduleSortOrder)}
                                >
                                  <div className="flex items-center gap-1">
                                    Folder Path
                                    {renderSortIcon('folderPath', moduleSortBy, moduleSortOrder)}
                                  </div>
                                </th>
                              )}
                              {visibleModuleColumns.lastFoundOn && (
                                <th 
                                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSort('lastFoundOn', setModuleSortBy, moduleSortBy, setModuleSortOrder, moduleSortOrder)}
                                >
                                  <div className="flex items-center gap-1">
                                    Last Found On
                                    {renderSortIcon('lastFoundOn', moduleSortBy, moduleSortOrder)}
                                  </div>
                                </th>
                              )}
                              {visibleModuleColumns.connectedToHubDB && (
                                <th 
                                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSort('connectedToHubDB', setModuleSortBy, moduleSortBy, setModuleSortOrder, moduleSortOrder)}
                                >
                                  <div className="flex items-center gap-1">
                                    Connected to Hub DB
                                    {renderSortIcon('connectedToHubDB', moduleSortBy, moduleSortOrder)}
                                  </div>
                                </th>
                              )}
                              {visibleModuleColumns.primaryCount && (
                                <th 
                                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSort('primaryCount', setModuleSortBy, moduleSortBy, setModuleSortOrder, moduleSortOrder)}
                                >
                                  <div className="flex items-center gap-1">
                                    Primary Count
                                    {renderSortIcon('primaryCount', moduleSortBy, moduleSortOrder)}
                                  </div>
                                </th>
                              )}
                              {visibleModuleColumns.origin && (
                                <th 
                                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSort('origin', setModuleSortBy, moduleSortBy, setModuleSortOrder, moduleSortOrder)}
                                >
                                  <div className="flex items-center gap-1">
                                    Origin
                                    {renderSortIcon('origin', moduleSortBy, moduleSortOrder)}
                                  </div>
                                </th>
                              )}
                              {visibleModuleColumns.visibility && (
                                <th 
                                  className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleSort('visibility', setModuleSortBy, moduleSortBy, setModuleSortOrder, moduleSortOrder)}
                                >
                                  <div className="flex items-center gap-1">
                                    Visibility
                                    {renderSortIcon('visibility', moduleSortBy, moduleSortOrder)}
                                  </div>
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedModules.map((module, index) => (
                              <tr 
                                key={module.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                              >
                                {visibleModuleColumns.moduleId && (
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <code className="text-xs font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded">{module.moduleId}</code>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyModuleId(module.moduleId);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Copy className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                                      </button>
                                    </div>
                                  </td>
                                )}
                                {visibleModuleColumns.name && (
                                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{module.name}</td>
                                )}
                                {visibleModuleColumns.folderPath && (
                                  <td className="py-3 px-4 text-sm text-gray-700">{module.folderPath}</td>
                                )}
                                {visibleModuleColumns.lastFoundOn && (
                                  <td className="py-3 px-4">
                                    <a 
                                      href={module.lastFoundOn} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      {module.lastFoundOn}
                                    </a>
                                  </td>
                                )}
                                {visibleModuleColumns.connectedToHubDB && (
                                  <td className="py-3 px-4">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center ${module.connectedToHubDB ? 'bg-green-50' : 'bg-red-50'}`}>
                                      {module.connectedToHubDB ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                      ) : (
                                        <X className="h-4 w-4 text-red-600" />
                                      )}
                                    </div>
                                  </td>
                                )}
                                {visibleModuleColumns.primaryCount && (
                                  <td className="py-3 px-4 text-sm text-gray-900">{module.primaryCount}</td>
                                )}
                                {visibleModuleColumns.origin && (
                                  <td className="py-3 px-4 text-sm text-gray-700 capitalize">{module.origin}</td>
                                )}
                                {visibleModuleColumns.visibility && (
                                  <td className="py-3 px-4">
                                    <Badge 
                                      variant="outline"
                                      className={module.visibility === 'visible' ? 'border-green-200 bg-green-50 text-green-700 text-xs' : 'border-gray-200 bg-gray-50 text-gray-700 text-xs'}
                                    >
                                      {module.visibility === 'visible' ? 'Visible' : 'Hidden'}
                                    </Badge>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                      Showing {(modulesPage - 1) * modulesPerPage + 1} to {Math.min(modulesPage * modulesPerPage, filteredModules.length)} of {filteredModules.length} results
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModulesPage(Math.max(1, modulesPage - 1))}
                        disabled={modulesPage === 1}
                        className="h-8 px-3 text-sm"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalModulesPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={page === modulesPage ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setModulesPage(page)}
                              className={`h-8 w-8 text-sm ${page === modulesPage ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModulesPage(Math.min(totalModulesPages, modulesPage + 1))}
                        disabled={modulesPage === totalModulesPages}
                        className="h-8 px-3 text-sm"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'properties' && (
              <PropertiesTabContent isLoadingTable={isLoadingTable} />
            )}

            {activeTab === 'languages' && (
              <LanguagesTabContent isLoadingTable={isLoadingTable} />
            )}

            {activeTab === 'files' && (
              <motion.div
                key="files"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Filters */}
                <Card className="p-6 bg-white border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">File Name</label>
                      <Input 
                        placeholder="Search files..."
                        value={fileNameFilter}
                        onChange={(e) => setFileNameFilter(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="w-48">
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
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-48">
                      <label className="text-xs font-medium text-gray-700 mb-1.5 block">Used On (Pages)</label>
                      <Input 
                        placeholder="Exact count"
                        type="number"
                        value={fileUsedOnFilter}
                        onChange={(e) => setFileUsedOnFilter(e.target.value)}
                        className="h-9 text-sm"
                      />
                    </div>
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
                        onClick={resetFilesFilters}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Table */}
                <Card className="p-6 bg-white border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-gray-900">Total Files: {filteredAndSortedFiles.length}</p>
                    <Button 
                      onClick={() => handleExportCSV('Files')}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 gap-2 text-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export to Google Sheets
                    </Button>
                  </div>
                  
                  {isLoadingTable ? renderLoadingSkeleton() : (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                            <tr>
                              <th 
                                className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('fileName', setFileSortBy, fileSortBy, setFileSortOrder, fileSortOrder)}
                              >
                                <div className="flex items-center gap-1">
                                  File Name
                                  {renderSortIcon('fileName', fileSortBy, fileSortOrder)}
                                </div>
                              </th>
                              <th 
                                className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('fileType', setFileSortBy, fileSortBy, setFileSortOrder, fileSortOrder)}
                              >
                                <div className="flex items-center gap-1">
                                  File Type
                                  {renderSortIcon('fileType', fileSortBy, fileSortOrder)}
                                </div>
                              </th>
                              <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                                File URL / Path
                              </th>
                              <th 
                                className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('usedOn', setFileSortBy, fileSortBy, setFileSortOrder, fileSortOrder)}
                              >
                                <div className="flex items-center gap-1">
                                  Used On
                                  {renderSortIcon('usedOn', fileSortBy, fileSortOrder)}
                                </div>
                              </th>
                              <th 
                                className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('primaryPages', setFileSortBy, fileSortBy, setFileSortOrder, fileSortOrder)}
                              >
                                <div className="flex items-center gap-1">
                                  Primary Pages
                                  {renderSortIcon('primaryPages', fileSortBy, fileSortOrder)}
                                </div>
                              </th>
                              <th 
                                className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('localizedPages', setFileSortBy, fileSortBy, setFileSortOrder, fileSortOrder)}
                              >
                                <div className="flex items-center gap-1">
                                  Localized Pages
                                  {renderSortIcon('localizedPages', fileSortBy, fileSortOrder)}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAndSortedFiles.map((file, index) => (
                              <tr 
                                key={file.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                              >
                                <td className="py-3 px-4 text-sm font-medium text-gray-900">{file.fileName}</td>
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}