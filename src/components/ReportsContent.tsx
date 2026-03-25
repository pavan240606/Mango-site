import { useState, useMemo } from 'react';
import { Download, RefreshCw, Calendar, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity, Filter, X, Search, ArrowUpDown, ChevronLeft, ChevronRight, Clock, ChevronDown, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatGlobalDateTime } from '../utils/dateFormat';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

type AnalyzeByType = 'language' | 'creator' | 'content-type' | 'publish-date' | 'created-date' | 'status';
type ChartType = 'bar' | 'line' | 'pie' | 'area';
type TimeGrouping = 'day' | 'week' | 'month' | 'year';

interface ContentItem {
  id: number;
  name: string;
  type: string;
  language: string;
  creator: string;
  createdDate: Date;
  publishedDate: Date;
  status: string;
}

export function ReportsContent() {
  // Global Filters
  const [dateRangeFilter, setDateRangeFilter] = useState('all-time');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  
  // Main Chart Configuration
  const [analyzeBy, setAnalyzeBy] = useState<AnalyzeByType>('language');
  const [chartType, setChartType] = useState<ChartType>('pie');
  const [timeGrouping, setTimeGrouping] = useState<TimeGrouping>('month');
  const [yAxisMetric, setYAxisMetric] = useState<'count' | 'percentage'>('count');

  // Advanced Filters
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);

  // Temporary Advanced Filters (for pending changes before Apply)
  const [tempSelectedCreators, setTempSelectedCreators] = useState<string[]>([]);
  const [tempSelectedLanguages, setTempSelectedLanguages] = useState<string[]>([]);
  const [tempSelectedStatuses, setTempSelectedStatuses] = useState<string[]>([]);
  const [tempSelectedContentTypes, setTempSelectedContentTypes] = useState<string[]>([]);

  // Popover open state
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);

  // Advanced Filters Accordion State
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    contentType: false,
    creator: false,
    language: false,
    status: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Table Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof ContentItem>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Generate comprehensive dummy data
  const generateDummyData = (): ContentItem[] => {
    const types = ['Website Page', 'Landing Page', 'Blog Post', 'Blog', 'Tag', 'Author', 'URL Redirect'];
    const languages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese'];
    const creators = ['Admin', 'Sarah Johnson', 'Mike Davis', 'John Smith', 'Emily Brown', 'David Wilson', 'Lisa Anderson', 'Tom Martinez', 'Jessica Lee', 'Chris Taylor'];
    const statuses = ['Published', 'Draft', 'Active', 'Archived', 'Scheduled'];
    
    const websitePages = ['Home', 'About', 'Services', 'Contact', 'Pricing', 'FAQ', 'Careers', 'Team', 'Portfolio', 'Testimonials', 'Privacy Policy', 'Terms of Service', 'Partners', 'Resources', 'Support'];
    const landingPages = ['Product Launch', 'Free Trial', 'Webinar', 'Holiday Sale', 'Beta Program', 'Summer Campaign', 'Black Friday', 'Discount Offer', 'Newsletter Signup', 'Demo Request', 'Case Study Download', 'Ebook Landing', 'Event Registration', 'Product Comparison', 'Seasonal Promotion'];
    const blogPosts = ['Getting Started Guide', 'Marketing Tips', 'SEO Best Practices', 'Email Marketing', 'Content Strategy', 'Social Media Guide', 'Analytics Tutorial', 'Lead Generation', 'Customer Retention', 'Inbound Marketing', 'Automation Guide', 'Growth Hacking', 'Conversion Optimization', 'Brand Building', 'Video Marketing'];
    
    const data: ContentItem[] = [];
    let id = 1;

    // Generate 200+ items to ensure data for all filter combinations
    for (let i = 0; i < 15; i++) {
      // Website Pages
      websitePages.forEach((page, idx) => {
        data.push({
          id: id++,
          name: `${page} ${i > 0 ? `v${i + 1}` : ''}`,
          type: 'Website Page',
          language: languages[idx % languages.length],
          creator: creators[idx % creators.length],
          createdDate: new Date(2024, idx % 12, (idx % 28) + 1),
          publishedDate: new Date(2024, idx % 12, (idx % 28) + 3),
          status: statuses[idx % statuses.length],
        });
      });

      // Landing Pages
      landingPages.forEach((page, idx) => {
        data.push({
          id: id++,
          name: `${page} ${i > 0 ? `Q${i + 1}` : '2024'}`,
          type: 'Landing Page',
          language: languages[(idx + 2) % languages.length],
          creator: creators[(idx + 3) % creators.length],
          createdDate: new Date(2024, (idx + 1) % 12, (idx % 28) + 1),
          publishedDate: new Date(2024, (idx + 1) % 12, (idx % 28) + 5),
          status: statuses[(idx + 1) % statuses.length],
        });
      });

      // Blog Posts
      blogPosts.forEach((post, idx) => {
        data.push({
          id: id++,
          name: `${post} ${i > 0 ? `Part ${i + 1}` : ''}`,
          type: 'Blog Post',
          language: languages[(idx + 4) % languages.length],
          creator: creators[(idx + 5) % creators.length],
          createdDate: new Date(2024, (idx + 2) % 12, (idx % 28) + 1),
          publishedDate: new Date(2024, (idx + 2) % 12, (idx % 28) + 2),
          status: statuses[(idx + 2) % statuses.length],
        });
      });

      // Blogs
      data.push({
        id: id++,
        name: `Company Blog ${i > 0 ? `${i + 1}` : ''}`,
        type: 'Blog',
        language: 'English',
        creator: 'Admin',
        createdDate: new Date(2024, i % 12, 5),
        publishedDate: new Date(2024, i % 12, 5),
        status: 'Active',
      });

      // Tags
      ['Marketing', 'Sales', 'SEO', 'Content', 'Social', 'Email', 'Analytics', 'Design'].forEach((tag, idx) => {
        data.push({
          id: id++,
          name: `${tag} ${i > 0 ? `v${i + 1}` : ''}`,
          type: 'Tag',
          language: languages[idx % languages.length],
          creator: creators[(idx + 2) % creators.length],
          createdDate: new Date(2024, idx % 12, 10),
          publishedDate: new Date(2024, idx % 12, 10),
          status: 'Active',
        });
      });

      // Authors
      creators.forEach((creator, idx) => {
        data.push({
          id: id++,
          name: `${creator} Profile ${i > 0 ? `Updated ${i + 1}` : ''}`,
          type: 'Author',
          language: 'English',
          creator: 'Admin',
          createdDate: new Date(2024, idx % 12, 1),
          publishedDate: new Date(2024, idx % 12, 1),
          status: 'Active',
        });
      });

      // URL Redirects
      ['Old Product', 'Legacy Landing', 'Archive Page', 'Outdated Service', 'Promo Redirect'].forEach((redirect, idx) => {
        data.push({
          id: id++,
          name: `${redirect} Redirect ${i > 0 ? `v${i + 1}` : ''}`,
          type: 'URL Redirect',
          language: 'N/A',
          creator: creators[idx % creators.length],
          createdDate: new Date(2024, (idx + 3) % 12, 15),
          publishedDate: new Date(2024, (idx + 3) % 12, 15),
          status: 'Active',
        });
      });
    }

    return data;
  };

  const hubspotContent = useMemo(() => generateDummyData(), []);

  // Get unique values for filters
  const uniqueCreators = useMemo(() => {
    return Array.from(new Set(hubspotContent.map(item => item.creator))).sort();
  }, []);

  const uniqueLanguages = useMemo(() => {
    return Array.from(new Set(hubspotContent.map(item => item.language))).sort();
  }, []);

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(hubspotContent.map(item => item.status))).sort();
  }, []);

  const uniqueContentTypes = useMemo(() => {
    return Array.from(new Set(hubspotContent.map(item => item.type))).sort();
  }, []);

  // Filter data based on all filters
  const filteredContent = useMemo(() => {
    let filtered = [...hubspotContent];

    // Content type filter
    if (contentTypeFilter !== 'all') {
      const typeMap: { [key: string]: string } = {
        'website-page': 'Website Page',
        'landing-page': 'Landing Page',
        'blog-post': 'Blog Post',
        'blog': 'Blog',
        'tag': 'Tag',
        'author': 'Author',
        'url-redirect': 'URL Redirect',
      };
      const targetType = typeMap[contentTypeFilter];
      filtered = filtered.filter(item => item.type === targetType);
    }

    // Date range filter
    const now = new Date();
    if (dateRangeFilter !== 'all-time') {
      let cutoffDate = new Date();
      if (dateRangeFilter === 'last-30-days') {
        cutoffDate.setDate(now.getDate() - 30);
      } else if (dateRangeFilter === 'last-90-days') {
        cutoffDate.setDate(now.getDate() - 90);
      } else if (dateRangeFilter === 'this-year') {
        cutoffDate = new Date(now.getFullYear(), 0, 1);
      } else if (dateRangeFilter === 'last-year') {
        cutoffDate = new Date(now.getFullYear() - 1, 0, 1);
        const endDate = new Date(now.getFullYear() - 1, 11, 31);
        filtered = filtered.filter(item => item.createdDate >= cutoffDate && item.createdDate <= endDate);
        return filtered;
      }
      filtered = filtered.filter(item => item.createdDate >= cutoffDate);
    }

    // Advanced filters
    if (selectedCreators.length > 0) {
      filtered = filtered.filter(item => selectedCreators.includes(item.creator));
    }

    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(item => selectedLanguages.includes(item.language));
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(item => selectedStatuses.includes(item.status));
    }

    if (selectedContentTypes.length > 0) {
      filtered = filtered.filter(item => selectedContentTypes.includes(item.type));
    }

    return filtered;
  }, [contentTypeFilter, dateRangeFilter, selectedCreators, selectedLanguages, selectedStatuses, selectedContentTypes]);

  // Search and sort for table
  const tableData = useMemo(() => {
    let data = [...filteredContent];

    // Apply search
    if (searchQuery) {
      data = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.creator.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sort
    data.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal instanceof Date && bVal instanceof Date) {
        return sortDirection === 'asc' ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return 0;
    });

    return data;
  }, [filteredContent, searchQuery, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(tableData.length / itemsPerPage);
  const paginatedData = tableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Generate chart data based on analyzeBy selection
  const generateChartData = (analyzeByParam: AnalyzeByType) => {
    const dataMap = new Map<string, number>();
    const colors: { [key: string]: string } = {
      'English': '#3b82f6',
      'Spanish': '#ef4444',
      'French': '#8b5cf6',
      'German': '#f59e0b',
      'Italian': '#ec4899',
      'Portuguese': '#10b981',
      'Chinese': '#06b6d4',
      'Japanese': '#f43f5e',
      'N/A': '#6b7280',
      'Published': '#10b981',
      'Draft': '#f59e0b',
      'Active': '#14b8a6',
      'Archived': '#6b7280',
      'Scheduled': '#8b5cf6',
    };

    if (analyzeByParam === 'language') {
      filteredContent.forEach(item => {
        dataMap.set(item.language, (dataMap.get(item.language) || 0) + 1);
      });
      return Array.from(dataMap.entries())
        .map(([name, value]) => ({ name, value, color: colors[name] || '#6b7280' }))
        .sort((a, b) => b.value - a.value);
    }

    if (analyzeByParam === 'creator') {
      filteredContent.forEach(item => {
        dataMap.set(item.creator, (dataMap.get(item.creator) || 0) + 1);
      });
      return Array.from(dataMap.entries())
        .map(([name, value]) => ({ name, value, color: '#8b5cf6' }))
        .sort((a, b) => b.value - a.value);
    }

    if (analyzeByParam === 'content-type') {
      filteredContent.forEach(item => {
        dataMap.set(item.type, (dataMap.get(item.type) || 0) + 1);
      });
      const typeColors: { [key: string]: string } = {
        'Website Page': '#3b82f6',
        'Landing Page': '#14b8a6',
        'Blog Post': '#8b5cf6',
        'Blog': '#f59e0b',
        'Tag': '#ef4444',
        'Author': '#10b981',
        'URL Redirect': '#6366f1',
      };
      return Array.from(dataMap.entries())
        .map(([name, value]) => ({ name, value, color: typeColors[name] || '#6b7280' }))
        .sort((a, b) => b.value - a.value);
    }

    if (analyzeByParam === 'status') {
      filteredContent.forEach(item => {
        dataMap.set(item.status, (dataMap.get(item.status) || 0) + 1);
      });
      return Array.from(dataMap.entries())
        .map(([name, value]) => ({ name, value, color: colors[name] || '#6b7280' }))
        .sort((a, b) => b.value - a.value);
    }

    // For date-based analysis
    if (analyzeByParam === 'created-date' || analyzeByParam === 'publish-date') {
      const dateField = analyzeByParam === 'created-date' ? 'createdDate' : 'publishedDate';
      
      filteredContent.forEach(item => {
        const date = item[dateField];
        let key: string;

        if (timeGrouping === 'day') {
          key = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        } else if (timeGrouping === 'week') {
          const weekNumber = Math.ceil(date.getDate() / 7);
          key = `Week ${weekNumber} - ${date.toLocaleString('default', { month: 'short', year: 'numeric' })}`;
        } else if (timeGrouping === 'month') {
          key = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        } else {
          key = date.getFullYear().toString();
        }

        dataMap.set(key, (dataMap.get(key) || 0) + 1);
      });

      return Array.from(dataMap.entries())
        .map(([name, value]) => ({ name, value, color: '#14b8a6' }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    return [];
  };

  const chartData = useMemo(() => generateChartData(analyzeBy), [analyzeBy, filteredContent, timeGrouping]);

  // Transform chart data based on Y-axis metric
  const transformedChartData = useMemo(() => {
    if (yAxisMetric === 'percentage') {
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      return chartData.map(item => ({
        ...item,
        value: total > 0 ? Math.round((item.value / total) * 100) : 0,
      }));
    }
    return chartData;
  }, [chartData, yAxisMetric]);

  // Count active advanced filters
  const activeFilterCount = selectedCreators.length + selectedLanguages.length + selectedStatuses.length + selectedContentTypes.length;

  // Check if time grouping should be shown
  const isDateBasedAnalysis = (type: AnalyzeByType) => {
    return type === 'created-date' || type === 'publish-date';
  };

  const handleExportReport = () => {
    console.log('Exporting report...');
  };

  const handleRefresh = () => {
    console.log('Refreshing reports...');
  };

  const handleSort = (field: keyof ContentItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearAllFilters = () => {
    setSelectedCreators([]);
    setSelectedLanguages([]);
    setSelectedStatuses([]);
    setSelectedContentTypes([]);
  };

  // Handle opening the Advanced Filters popover
  const handleOpenAdvancedFilters = (open: boolean) => {
    if (open) {
      // Initialize temp states with current applied filters
      setTempSelectedCreators([...selectedCreators]);
      setTempSelectedLanguages([...selectedLanguages]);
      setTempSelectedStatuses([...selectedStatuses]);
      setTempSelectedContentTypes([...selectedContentTypes]);
    }
    setIsAdvancedFiltersOpen(open);
  };

  // Handle Apply button
  const handleApplyFilters = () => {
    setSelectedCreators([...tempSelectedCreators]);
    setSelectedLanguages([...tempSelectedLanguages]);
    setSelectedStatuses([...tempSelectedStatuses]);
    setSelectedContentTypes([...tempSelectedContentTypes]);
    setIsAdvancedFiltersOpen(false);
  };

  // Handle Cancel button
  const handleCancelFilters = () => {
    setIsAdvancedFiltersOpen(false);
  };

  // Render Chart
  const renderChart = (data: any[], type: ChartType) => {
    if (type === 'pie') {
      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
          />
        </PieChart>
      );
    }

    const commonProps = { data };
    const chartContent = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          stroke="#6b7280" 
          angle={data.length > 5 ? -45 : 0} 
          textAnchor={data.length > 5 ? "end" : "middle"}
          height={data.length > 5 ? 100 : 30}
        />
        <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px 12px'
          }}
        />
      </>
    );

    if (type === 'bar') {
      return (
        <BarChart {...commonProps}>
          {chartContent}
          <Bar dataKey="value" fill="#3b82f6" name="Count">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      );
    }

    if (type === 'line') {
      return (
        <LineChart {...commonProps}>
          {chartContent}
          <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} name="Count" />
        </LineChart>
      );
    }

    if (type === 'area') {
      return (
        <AreaChart {...commonProps}>
          {chartContent}
          <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Count" />
        </AreaChart>
      );
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="max-w-[1600px] mx-auto p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-gray-900">HubSpot Content Analytics</h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={handleExportReport}
                className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
          <p className="text-gray-600">Comprehensive analytics and insights for your HubSpot content</p>
        </div>

        {/* Simplified Filters Row */}
        <Card className="p-4 border border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            {/* Content Type Filter - First */}
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Content Type:</span>
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="website-page">Website Page</SelectItem>
                  <SelectItem value="landing-page">Landing Page</SelectItem>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="tag">Tag</SelectItem>
                  <SelectItem value="author">Author</SelectItem>
                  <SelectItem value="url-redirect">URL Redirect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter - Second */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">Date Range:</span>
              <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chart Type */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Chart Type:</span>
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger className="w-[100px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pie">Pie</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="area">Area</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Filters Button */}
            <Popover open={isAdvancedFiltersOpen} onOpenChange={handleOpenAdvancedFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 ml-auto">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 bg-teal-100 text-teal-700 hover:bg-teal-100">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[420px]" align="end">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs h-7"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>

                  {/* Content Type Filter (Accordion) */}
                  <div className="border border-gray-200 rounded-md">
                    <button
                      onClick={() => toggleSection('contentType')}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">Content Type</span>
                        {selectedContentTypes.length > 0 && (
                          <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
                            {selectedContentTypes.length}
                          </Badge>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform ${
                          openSections.contentType ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openSections.contentType && (
                      <div className="p-3 pt-0 border-t border-gray-200 space-y-1 max-h-[200px] overflow-y-auto">
                        {uniqueContentTypes.map(type => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <Checkbox
                              checked={tempSelectedContentTypes.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setTempSelectedContentTypes([...tempSelectedContentTypes, type]);
                                } else {
                                  setTempSelectedContentTypes(tempSelectedContentTypes.filter(t => t !== type));
                                }
                              }}
                            />
                            <span className="text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Creator Filter (Accordion) */}
                  <div className="border border-gray-200 rounded-md">
                    <button
                      onClick={() => toggleSection('creator')}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">Creator</span>
                        {selectedCreators.length > 0 && (
                          <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
                            {selectedCreators.length}
                          </Badge>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform ${
                          openSections.creator ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openSections.creator && (
                      <div className="p-3 pt-0 border-t border-gray-200 space-y-1 max-h-[200px] overflow-y-auto">
                        {uniqueCreators.map(creator => (
                          <label key={creator} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <Checkbox
                              checked={tempSelectedCreators.includes(creator)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setTempSelectedCreators([...tempSelectedCreators, creator]);
                                } else {
                                  setTempSelectedCreators(tempSelectedCreators.filter(c => c !== creator));
                                }
                              }}
                            />
                            <span className="text-sm">{creator}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Language Filter (Accordion) */}
                  <div className="border border-gray-200 rounded-md">
                    <button
                      onClick={() => toggleSection('language')}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">Language</span>
                        {selectedLanguages.length > 0 && (
                          <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
                            {selectedLanguages.length}
                          </Badge>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform ${
                          openSections.language ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openSections.language && (
                      <div className="p-3 pt-0 border-t border-gray-200 space-y-1 max-h-[200px] overflow-y-auto">
                        {uniqueLanguages.map(language => (
                          <label key={language} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <Checkbox
                              checked={tempSelectedLanguages.includes(language)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setTempSelectedLanguages([...tempSelectedLanguages, language]);
                                } else {
                                  setTempSelectedLanguages(tempSelectedLanguages.filter(l => l !== language));
                                }
                              }}
                            />
                            <span className="text-sm">{language}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status Filter (Accordion) */}
                  <div className="border border-gray-200 rounded-md">
                    <button
                      onClick={() => toggleSection('status')}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">Status</span>
                        {selectedStatuses.length > 0 && (
                          <Badge variant="secondary" className="bg-teal-100 text-teal-700 text-xs">
                            {selectedStatuses.length}
                          </Badge>
                        )}
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform ${
                          openSections.status ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openSections.status && (
                      <div className="p-3 pt-0 border-t border-gray-200 space-y-1">
                        {uniqueStatuses.map(status => (
                          <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <Checkbox
                              checked={tempSelectedStatuses.includes(status)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setTempSelectedStatuses([...tempSelectedStatuses, status]);
                                } else {
                                  setTempSelectedStatuses(tempSelectedStatuses.filter(s => s !== status));
                                }
                              }}
                            />
                            <span className="text-sm">{status}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Apply and Cancel Buttons */}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelFilters}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleApplyFilters}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 flex-wrap">
              <span className="text-xs text-gray-600">Active Filters:</span>
              {selectedCreators.map(creator => (
                <Badge key={creator} variant="secondary" className="gap-1 pr-1">
                  Creator: {creator}
                  <button
                    type="button"
                    className="ml-1 hover:bg-red-100 rounded p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCreators(selectedCreators.filter(c => c !== creator));
                    }}
                  >
                    <X className="h-3 w-3 text-gray-600 hover:text-red-600" />
                  </button>
                </Badge>
              ))}
              {selectedLanguages.map(language => (
                <Badge key={language} variant="secondary" className="gap-1 pr-1">
                  Language: {language}
                  <button
                    type="button"
                    className="ml-1 hover:bg-red-100 rounded p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
                    }}
                  >
                    <X className="h-3 w-3 text-gray-600 hover:text-red-600" />
                  </button>
                </Badge>
              ))}
              {selectedStatuses.map(status => (
                <Badge key={status} variant="secondary" className="gap-1 pr-1">
                  Status: {status}
                  <button
                    type="button"
                    className="ml-1 hover:bg-red-100 rounded p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStatuses(selectedStatuses.filter(s => s !== status));
                    }}
                  >
                    <X className="h-3 w-3 text-gray-600 hover:text-red-600" />
                  </button>
                </Badge>
              ))}
              {selectedContentTypes.map(type => (
                <Badge key={type} variant="secondary" className="gap-1 pr-1">
                  Type: {type}
                  <button
                    type="button"
                    className="ml-1 hover:bg-red-100 rounded p-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedContentTypes(selectedContentTypes.filter(t => t !== type));
                    }}
                  >
                    <X className="h-3 w-3 text-gray-600 hover:text-red-600" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Main Analytics Section */}
        <Card className="p-6 border border-gray-200 mb-6 relative">
          {/* Y-Axis Control - Top Left - Only for Bar/Line */}
          {(chartType === 'bar' || chartType === 'line') && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-white px-[10px] py-[-8px] rounded-md border border-gray-200 shadow-sm z-10">
              <span className="text-xs text-gray-600">Y-Axis:</span>
              <Select value={yAxisMetric} onValueChange={(value: any) => setYAxisMetric(value)}>
                <SelectTrigger className="w-[100px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Chart Display with padding to avoid overlap */}
          <div className={(chartType === 'bar' || chartType === 'line') ? 'pt-10 pb-12' : ''}>
            {chartData.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-gray-500">No data available for selected filters</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                {renderChart(transformedChartData, chartType)}
              </ResponsiveContainer>
            )}
          </div>

          {/* X-Axis Control - Bottom Right - Only for Bar/Line */}
          {(chartType === 'bar' || chartType === 'line') && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white px-[10px] py-[-9px] rounded-md border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-600">X-Axis:</span>
                <Select value={analyzeBy} onValueChange={(value: any) => setAnalyzeBy(value)}>
                  <SelectTrigger className="w-[120px] h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="language">Language</SelectItem>
                    <SelectItem value="creator">Creator</SelectItem>
                    <SelectItem value="content-type">Content Type</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="created-date">Created Date</SelectItem>
                    <SelectItem value="publish-date">Publish Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Time Grouping - Only for date-based X-axis */}
              {isDateBasedAnalysis(analyzeBy) && (
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm">
                  <span className="text-xs text-gray-600">Group By:</span>
                  <Select value={timeGrouping} onValueChange={(value: any) => setTimeGrouping(value)}>
                    <SelectTrigger className="w-[90px] h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}