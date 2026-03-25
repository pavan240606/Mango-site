import { useState, useEffect } from 'react';
import { RefreshCw, Download, Calendar, Upload, Loader2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Replace, MoreHorizontal, FileText, Search, Info, GripVertical, ArrowUpDown, Edit, Save, Bookmark, X, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { formatGlobalDateTime, formatTableDateTime } from '../utils/dateFormat';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

import { PreviewModal } from './PreviewModal';
import { FindAndReplaceModal } from './FindAndReplaceModal';
import { ExportModal } from './ExportModal';
import { BulkEditModal } from './BulkEditModal';
import { LastUpdatedBar } from './LastUpdatedBar';
import { ColumnReorderModal } from './ColumnReorderModal';
import { SaveFilterModal } from './SaveFilterModal';
import { SmartSelectionBar } from './SmartSelectionBar';
import { AIAssistantModal } from './AIAssistantModal';
import { FetchingStatusTray } from './FetchingStatusTray';
import { useColumnPreferences, ContentType } from './ColumnPreferencesContext';
import { AdvancedFilterDropdown } from './AdvancedFilterDropdown';
import { FilterSelectionModal } from './FilterSelectionModal';
import { useNotifications } from './NotificationContext';
import { useFetchingStatus } from './FetchingStatusContext';
import { useBypass } from './BypassContext';
import { useSavedFilters } from './SavedFiltersContext';
import { ExpandableTextCell } from './ExpandableTextCell';
import { 
  authorNameOptions, 
  campaignOptions, 
  domainOptions, 
  htmlTitleOptions, 
  languageOptions, 
  nameOptions, 
  slugOptions, 
  stateOptions 
} from './landingPageFilterData';

// Content type configurations (keeping all existing configurations)
const contentTypeConfigs = {
  'website-page': {
    label: 'Website Page',
    searchOptions: [
      { value: 'name', label: 'Search by Name' },
      { value: 'slug', label: 'Search by Slug' },
      { value: 'url', label: 'Search by URL' },
      { value: 'htmlTitle', label: 'Search by HTML Title' },
      { value: 'authorName', label: 'Search by Author Name' },
      { value: 'metaDescription', label: 'Search by Meta Description' },
      { value: 'domain', label: 'Search by Domain' },
      { value: 'content', label: 'Search by Content' }
    ],
    tableHeaders: ['Name', 'Archived At', 'Archived In Dashboard', 'Attached Stylesheets', 'Author Name', 'Campaign', 'Layout'],
    sortableColumns: ['name', 'archivedAt', 'archivedInDashboard', 'attachedStylesheets', 'authorName', 'campaign'],
    bulkEditFields: [
      { 
        key: 'archivedInDashboard', 
        label: 'Archived In Dashboard',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'domain', 
        label: 'Domain',
        type: 'select',
        options: [
          { value: 'www.company.com', label: 'www.company.com' },
          { value: 'blog.company.com', label: 'blog.company.com' },
          { value: 'docs.company.com', label: 'docs.company.com' },
          { value: 'support.company.com', label: 'support.company.com' },
          { value: 'partners.company.com', label: 'partners.company.com' },
          { value: 'developers.company.com', label: 'developers.company.com' },
          { value: 'careers.company.com', label: 'careers.company.com' },
          { value: 'community.company.com', label: 'community.company.com' }
        ]
      },
      { 
        key: 'publishDate', 
        label: 'Publish Date',
        type: 'datetime'
      },
      { 
        key: 'state', 
        label: 'State',
        type: 'select',
        options: [
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'archived', label: 'Archived' }
        ]
      },
      { 
        key: 'useFeaturedImage', 
        label: 'Use Featured Image',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'subcategory', 
        label: 'Subcategory',
        type: 'select',
        options: [
          { value: 'product-pages', label: 'Product Pages' },
          { value: 'service-pages', label: 'Service Pages' },
          { value: 'company-info', label: 'Company Info' },
          { value: 'support-docs', label: 'Support Documentation' },
          { value: 'legal-pages', label: 'Legal Pages' }
        ]
      }
    ]
  },
  'landing-page': {
    label: 'Landing Pages',
    searchOptions: [
      { value: 'name', label: 'Search by Name' },
      { value: 'slug', label: 'Search by Slug' },
      { value: 'htmlTitle', label: 'Search by HTML Title' },
      { value: 'domain', label: 'Search by Domain' },
      { value: 'authorName', label: 'Search by Author Name' },
      { value: 'campaign', label: 'Search by Campaign' }
    ],
    tableHeaders: ['Name', 'Archived At', 'Archived In Dashboard', 'Attached Stylesheets', 'Author Name', 'Campaign', 'Layout'],
    sortableColumns: ['name', 'archivedAt', 'archivedInDashboard', 'attachedStylesheets', 'authorName', 'campaign'],
    bulkEditFields: [
      { 
        key: 'campaign', 
        label: 'Campaign',
        type: 'select',
        options: [
          { value: 'q1-2024-promo', label: 'Q1 2024 Promotion' },
          { value: 'product-launch-2024', label: 'Product Launch 2024' },
          { value: 'webinar-series', label: 'Webinar Series' },
          { value: 'lead-generation', label: 'Lead Generation Campaign' },
          { value: 'holiday-sale-2024', label: 'Holiday Sale 2024' },
          { value: 'beta-testing', label: 'Beta Testing Program' },
          { value: 'summer-campaign', label: 'Summer Campaign' },
          { value: 'back-to-school', label: 'Back to School' },
          { value: 'black-friday', label: 'Black Friday Special' },
          { value: 'year-end-push', label: 'Year End Push' }
        ]
      },
      { 
        key: 'pageExpiryEnabled', 
        label: 'Page Expiry Enabled',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'archivedInDashboard', 
        label: 'Archived In Dashboard',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'domain', 
        label: 'Domain',
        type: 'select',
        options: [
          { value: 'landing.company.com', label: 'landing.company.com' },
          { value: 'campaigns.company.com', label: 'campaigns.company.com' },
          { value: 'promo.company.com', label: 'promo.company.com' },
          { value: 'events.company.com', label: 'events.company.com' },
          { value: 'offers.company.com', label: 'offers.company.com' },
          { value: 'webinars.company.com', label: 'webinars.company.com' },
          { value: 'demo.company.com', label: 'demo.company.com' },
          { value: 'trial.company.com', label: 'trial.company.com' }
        ]
      },
      { 
        key: 'publishDate', 
        label: 'Publish Date',
        type: 'datetime'
      },
      { 
        key: 'state', 
        label: 'State',
        type: 'select',
        options: [
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'archived', label: 'Archived' }
        ]
      },
      { 
        key: 'useFeaturedImage', 
        label: 'Use Featured Image',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'subcategory', 
        label: 'Subcategory',
        type: 'select',
        options: [
          { value: 'lead-generation', label: 'Lead Generation' },
          { value: 'product-launch', label: 'Product Launch' },
          { value: 'event-registration', label: 'Event Registration' },
          { value: 'free-trial', label: 'Free Trial' },
          { value: 'webinar', label: 'Webinar' },
          { value: 'ebook-download', label: 'eBook Download' }
        ]
      }
    ]
  },
  'blog-post': {
    label: 'Blog Post',
    searchOptions: [
      { value: 'slug', label: 'Search by Slug' },
      { value: 'name', label: 'Search by Name' },
      { value: 'language', label: 'Search by Language' },
      { value: 'htmlTitle', label: 'Search by HTML Title' },
      { value: 'state', label: 'Search by State' },
      { value: 'publishDate', label: 'Search by Publish Date' },
      { value: 'domain', label: 'Search by Domain' },
      { value: 'authorName', label: 'Search by Author Name' },
      { value: 'metaDescription', label: 'Search by Meta Description' },
      { value: 'tagIds', label: 'Search by Tag IDs' }
    ],
    tableHeaders: ['Name', 'Archived At', 'Archived In Dashboard', 'Attached Stylesheets', 'Author Name', 'Campaign'],
    sortableColumns: ['name', 'archivedAt', 'archivedInDashboard', 'attachedStylesheets', 'authorName', 'campaign'],
    bulkEditFields: [
      { 
        key: 'blogAuthorId', 
        label: 'Blog Author ID',
        type: 'select',
        options: [
          { value: 'author_001', label: 'Umer Aslam (author_001)' },
          { value: 'author_002', label: 'Jane Smith (author_002)' },
          { value: 'author_003', label: 'John Doe (author_003)' },
          { value: 'author_004', label: 'Mike Johnson (author_004)' },
          { value: 'author_005', label: 'Sarah Wilson (author_005)' },
          { value: 'author_006', label: 'Alex Brown (author_006)' },
          { value: 'author_007', label: 'Emma Davis (author_007)' },
          { value: 'author_008', label: 'David Miller (author_008)' }
        ]
      },
      { 
        key: 'enableGoogleAmpOutputOverride', 
        label: 'Enable Google AMP Output Override',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'tagIds', 
        label: 'Tag IDs',
        type: 'select',
        options: [
          { value: 'tag_marketing_001', label: 'Marketing (tag_marketing_001)' },
          { value: 'tag_saas_002', label: 'SaaS (tag_saas_002)' },
          { value: 'tag_seo_003', label: 'SEO (tag_seo_003)' },
          { value: 'tag_content_004', label: 'Content Marketing (tag_content_004)' },
          { value: 'tag_social_005', label: 'Social Media (tag_social_005)' },
          { value: 'tag_analytics_006', label: 'Analytics (tag_analytics_006)' },
          { value: 'tag_sales_007', label: 'Sales (tag_sales_007)' },
          { value: 'tag_ai_008', label: 'AI (tag_ai_008)' }
        ]
      },
      { 
        key: 'language', 
        label: 'Language',
        type: 'select',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'it', label: 'Italian' },
          { value: 'pt', label: 'Portuguese' },
          { value: 'zh', label: 'Chinese' },
          { value: 'ja', label: 'Japanese' }
        ]
      },
      { 
        key: 'archivedInDashboard', 
        label: 'Archived In Dashboard',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'domain', 
        label: 'Domain',
        type: 'select',
        options: [
          { value: 'blog.company.com', label: 'blog.company.com' },
          { value: 'insights.company.com', label: 'insights.company.com' },
          { value: 'news.company.com', label: 'news.company.com' },
          { value: 'updates.company.com', label: 'updates.company.com' },
          { value: 'resources.company.com', label: 'resources.company.com' },
          { value: 'learn.company.com', label: 'learn.company.com' },
          { value: 'stories.company.com', label: 'stories.company.com' },
          { value: 'trends.company.com', label: 'trends.company.com' }
        ]
      },
      { 
        key: 'publishDate', 
        label: 'Publish Date',
        type: 'datetime'
      },
      { 
        key: 'state', 
        label: 'State',
        type: 'select',
        options: [
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'archived', label: 'Archived' }
        ]
      },
      { 
        key: 'useFeaturedImage', 
        label: 'Use Featured Image',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      }
    ]
  },
  'blogs': {
    label: 'Blogs',
    searchOptions: [
      { value: 'slug', label: 'Search by Slug' },
      { value: 'name', label: 'Search by Blog Name' },
      { value: 'language', label: 'Search by Language' },
      { value: 'htmlTitle', label: 'Search by HTML Title' },
      { value: 'publicTitle', label: 'Search by Public Title' },
      { value: 'description', label: 'Search by Description' }
    ],
    tableHeaders: ['Name', 'Description', 'Created Date', 'Posts Count', 'Status'],
    sortableColumns: ['name', 'description', 'createdDate', 'postsCount', 'status'],
    bulkEditFields: [
      { 
        key: 'allowComments', 
        label: 'Allow Comments',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'language', 
        label: 'Language',
        type: 'select',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'it', label: 'Italian' },
          { value: 'pt', label: 'Portuguese' },
          { value: 'zh', label: 'Chinese' },
          { value: 'ja', label: 'Japanese' }
        ]
      }
    ]
  },
  'tags': {
    label: 'Tags',
    searchOptions: [
      { value: 'slug', label: 'Search by Slug' },
      { value: 'name', label: 'Search by Tag Name' },
      { value: 'language', label: 'Search by Language' }
    ],
    tableHeaders: ['Name', 'Archived At', 'Archived In Dashboard', 'Attached Stylesheets', 'Author Name', 'Campaign'],
    sortableColumns: ['name', 'archivedAt', 'archivedInDashboard', 'attachedStylesheets', 'authorName', 'campaign'],
    bulkEditFields: [
      { 
        key: 'language', 
        label: 'Language',
        type: 'select',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'it', label: 'Italian' },
          { value: 'pt', label: 'Portuguese' },
          { value: 'zh', label: 'Chinese' },
          { value: 'ja', label: 'Japanese' }
        ]
      }
    ]
  },
  'authors': {
    label: 'Authors',
    searchOptions: [
      { value: 'slug', label: 'Search by Slug' },
      { value: 'name', label: 'Search by Name' },
      { value: 'language', label: 'Search by Language' }
    ],
    tableHeaders: ['Name', 'Archived At', 'Archived In Dashboard', 'Attached Stylesheets', 'Author Name', 'Campaign'],
    sortableColumns: ['name', 'archivedAt', 'archivedInDashboard', 'attachedStylesheets', 'authorName', 'campaign'],
    bulkEditFields: [
      { 
        key: 'language', 
        label: 'Language',
        type: 'select',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'it', label: 'Italian' },
          { value: 'pt', label: 'Portuguese' },
          { value: 'zh', label: 'Chinese' },
          { value: 'ja', label: 'Japanese' }
        ]
      }
    ]
  },
  'url-redirects': {
    label: 'URL Redirects',
    searchOptions: [
      { value: 'routePrefix', label: 'Search by Route Prefix' },
      { value: 'redirectStyle', label: 'Search by Redirect Style' },
      { value: 'destination', label: 'Search by Destination URL' }
    ],
    tableHeaders: ['Name', 'Archived At', 'Archived In Dashboard', 'Attached Stylesheets', 'Author Name', 'Campaign'],
    sortableColumns: ['name', 'archivedAt', 'archivedInDashboard', 'attachedStylesheets', 'authorName', 'campaign'],
    bulkEditFields: [
      { 
        key: 'isMatchFullUrl', 
        label: 'Match Full URL',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'isMatchQueryString', 
        label: 'Match Query String',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'isOnlyAfterNotFound', 
        label: 'Only After Not Found',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'isPattern', 
        label: 'Is Pattern',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'isProtocolAgnostic', 
        label: 'Protocol Agnostic',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'isTrailingSlashOptional', 
        label: 'Trailing Slash Optional',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'precedence', 
        label: 'Precedence',
        type: 'select',
        options: [
          { value: '1', label: 'Highest Priority (1)' },
          { value: '2', label: 'High Priority (2)' },
          { value: '3', label: 'Medium Priority (3)' },
          { value: '4', label: 'Low Priority (4)' },
          { value: '5', label: 'Lowest Priority (5)' },
          { value: '10', label: 'Very Low Priority (10)' },
          { value: '50', label: 'Default Priority (50)' },
          { value: '100', label: 'Fallback Priority (100)' }
        ]
      },
      { 
        key: 'redirectStyle', 
        label: 'Redirect Style',
        type: 'select',
        options: [
          { value: '301', label: 'Permanent Redirect (301)' },
          { value: '302', label: 'Temporary Redirect (302)' },
          { value: '303', label: 'See Other (303)' },
          { value: '307', label: 'Temporary Redirect (307)' },
          { value: '308', label: 'Permanent Redirect (308)' }
        ]
      }
    ]
  },
  'hubdb-tables': {
    label: 'HubDB Tables',
    searchOptions: [
      { value: 'name', label: 'Search by Table Name' }
    ],
    tableHeaders: ['Name', 'Archived At', 'Archived In Dashboard', 'Attached Stylesheets', 'Author Name', 'Campaign'],
    sortableColumns: ['name', 'archivedAt', 'archivedInDashboard', 'attachedStylesheets', 'authorName', 'campaign'],
    bulkEditFields: [
      { 
        key: 'allowChildTables', 
        label: 'Allow Child Tables',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'allowPublicApiAccess', 
        label: 'Allow Public API Access',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'dynamicMetaTags', 
        label: 'Dynamic Meta Tags',
        type: 'select',
        options: [
          { value: 'basic_seo', label: 'Basic SEO Tags' },
          { value: 'social_media', label: 'Social Media Tags' },
          { value: 'product_schema', label: 'Product Schema Tags' },
          { value: 'article_schema', label: 'Article Schema Tags' },
          { value: 'local_business', label: 'Local Business Schema' },
          { value: 'ecommerce', label: 'E-commerce Tags' },
          { value: 'blog_post', label: 'Blog Post Tags' },
          { value: 'custom_config', label: 'Custom Configuration' }
        ]
      },
      { 
        key: 'enableChildTablePages', 
        label: 'Enable Child Table Pages',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      },
      { 
        key: 'useForPages', 
        label: 'Use For Pages',
        type: 'boolean',
        options: [
          { value: 'true', label: 'True' },
          { value: 'false', label: 'False' }
        ]
      }
    ]
  }
};

// Comprehensive mock data matching ColumnPreferencesContext structure
const mockDataByType = {
  'landing-page': [
    {
      id: 1,
      name: 'Product Launch 2024',
      createdDate: '2024-12-15T14:30:45Z',
      updatedDate: '2024-12-18T09:15:22Z',
      status: 'Published',
      campaign: 'Product Launch Q4',
      leadGeneration: 'High',
      conversionRate: '12.5%',
      layout: 'Widget: Hero Section | Widget: Product Showcase | Widget: Lead Form'
    },
    {
      id: 2,
      name: 'Free Trial Landing',
      createdDate: '2024-11-28T09:15:22Z',
      updatedDate: '2024-12-01T16:42:33Z',
      status: 'Published',
      campaign: 'Lead Generation Campaign',
      leadGeneration: 'Medium',
      conversionRate: '8.3%',
      layout: 'Widget: Benefits List | Widget: Signup Form | Widget: Trust Badges'
    },
    {
      id: 3,
      name: 'Webinar Registration',
      createdDate: '2024-10-22T16:42:33Z',
      updatedDate: '2024-11-05T11:22:11Z',
      status: 'Draft',
      campaign: 'Educational Webinar Series',
      leadGeneration: 'High',
      conversionRate: '15.7%',
      layout: 'Widget: Event Details | Widget: Registration Form | Widget: Speaker Bios'
    },
    {
      id: 4,
      name: 'Holiday Sale 2024',
      createdDate: '2024-09-18T11:22:11Z',
      updatedDate: '2024-11-20T08:47:55Z',
      status: 'Published',
      campaign: 'Holiday Promotions',
      leadGeneration: 'Very High',
      conversionRate: '22.1%'
    },
    {
      id: 5,
      name: 'Beta Testing Program',
      createdDate: '2024-08-05T08:47:55Z',
      updatedDate: '2024-08-15T19:33:28Z',
      status: 'Archived',
      campaign: 'Beta Launch Initiative',
      leadGeneration: 'Low',
      conversionRate: '4.2%'
    },
    {
      id: 6,
      name: 'Summer Campaign Launch',
      createdDate: '2024-07-12T19:33:28Z',
      updatedDate: '2024-07-25T13:55:17Z',
      status: 'Published',
      campaign: 'Summer 2024 Campaign',
      leadGeneration: 'Medium',
      conversionRate: '9.8%'
    },
    {
      id: 7,
      name: 'Back to School Promo',
      createdDate: '2024-06-20T13:55:17Z',
      updatedDate: '2024-08-01T16:41:29Z',
      status: 'Published',
      campaign: 'Education Marketing',
      leadGeneration: 'High',
      conversionRate: '14.3%'
    },
    {
      id: 8,
      name: 'Black Friday Special',
      createdDate: '2024-05-15T16:41:29Z',
      updatedDate: '2024-11-15T12:17:33Z',
      status: 'Published',
      campaign: 'Black Friday 2024',
      leadGeneration: 'Very High',
      conversionRate: '28.9%'
    },
    {
      id: 9,
      name: 'Customer Success Stories',
      createdDate: '2024-04-28T12:17:33Z',
      updatedDate: '2024-05-10T09:52:44Z',
      status: 'Published',
      campaign: 'Social Proof Campaign',
      leadGeneration: 'High',
      conversionRate: '16.7%'
    },
    {
      id: 10,
      name: 'Q1 Growth Initiative',
      createdDate: '2024-03-14T09:52:44Z',
      updatedDate: '2024-03-30T14:25:18Z',
      status: 'Archived',
      campaign: 'Q1 2024 Growth',
      leadGeneration: 'Medium',
      conversionRate: '7.1%'
    },
    {
      id: 11,
      name: 'Enterprise Solution Demo',
      createdDate: '2024-02-20T15:30:22Z',
      updatedDate: '2024-03-05T11:45:18Z',
      status: 'Published',
      campaign: 'Enterprise Sales 2024',
      leadGeneration: 'Very High',
      conversionRate: '25.4%'
    },
    {
      id: 12,
      name: 'Mobile App Launch',
      createdDate: '2024-01-18T10:22:15Z',
      updatedDate: '2024-02-12T14:33:42Z',
      status: 'Published',
      campaign: 'Mobile First Initiative',
      leadGeneration: 'High',
      conversionRate: '18.2%'
    },
    {
      id: 13,
      name: 'Partner Program Signup',
      createdDate: '2024-12-05T08:15:33Z',
      updatedDate: '2024-12-20T16:28:55Z',
      status: 'Published',
      campaign: 'Partner Network Expansion',
      leadGeneration: 'Medium',
      conversionRate: '10.5%'
    },
    {
      id: 14,
      name: 'Annual Conference 2024',
      createdDate: '2024-11-10T13:40:28Z',
      updatedDate: '2024-11-28T09:22:17Z',
      status: 'Published',
      campaign: 'Conference Marketing',
      leadGeneration: 'Very High',
      conversionRate: '31.8%'
    },
    {
      id: 15,
      name: 'API Documentation Landing',
      createdDate: '2024-10-05T17:25:44Z',
      updatedDate: '2024-10-22T12:18:30Z',
      status: 'Published',
      campaign: 'Developer Outreach',
      leadGeneration: 'Low',
      conversionRate: '5.7%'
    },
    {
      id: 16,
      name: 'Cyber Monday Deal',
      createdDate: '2024-09-28T11:33:19Z',
      updatedDate: '2024-11-27T15:42:28Z',
      status: 'Published',
      campaign: 'Cyber Monday 2024',
      leadGeneration: 'Very High',
      conversionRate: '26.3%'
    },
    {
      id: 17,
      name: 'White Paper Download',
      createdDate: '2024-08-22T14:28:37Z',
      updatedDate: '2024-09-10T10:15:22Z',
      status: 'Published',
      campaign: 'Thought Leadership',
      leadGeneration: 'High',
      conversionRate: '13.9%'
    },
    {
      id: 18,
      name: 'Startup Package Offer',
      createdDate: '2024-07-30T09:45:11Z',
      updatedDate: '2024-08-18T16:33:45Z',
      status: 'Published',
      campaign: 'Startup Growth Program',
      leadGeneration: 'Medium',
      conversionRate: '11.2%'
    },
    {
      id: 19,
      name: 'Customer Referral Program',
      createdDate: '2024-06-15T16:20:55Z',
      updatedDate: '2024-07-08T13:27:18Z',
      status: 'Published',
      campaign: 'Referral Marketing',
      leadGeneration: 'High',
      conversionRate: '19.6%'
    },
    {
      id: 20,
      name: 'Industry Report 2024',
      createdDate: '2024-05-28T12:55:42Z',
      updatedDate: '2024-06-12T09:18:33Z',
      status: 'Archived',
      campaign: 'Research & Insights',
      leadGeneration: 'Medium',
      conversionRate: '8.4%'
    }
  ],
  'website-page': [
    {
      id: 1,
      name: 'Home Page',
      createdDate: '2024-12-10T07:25:42Z',
      updatedDate: '2024-12-18T10:30:15Z',
      status: 'Published',
      url: '/home',
      metaTitle: 'Welcome to Smuves - HubSpot Content Management',
      metaDescription: 'Streamline your HubSpot content management with powerful tools for editing, exporting, and optimizing your digital assets.',
      layout: 'Widget: Hero Banner | Widget: Feature Grid | Widget: CTA Section'
    },
    {
      id: 2,
      name: 'About Us',
      createdDate: '2024-11-25T14:20:30Z',
      updatedDate: '2024-12-05T09:45:22Z',
      status: 'Published',
      url: '/about',
      metaTitle: 'About Smuves - Your HubSpot Content Partner',
      metaDescription: 'Learn about our mission to simplify HubSpot content management and help businesses optimize their digital presence.',
      layout: 'Widget: Header Text | Widget: Team Grid | Widget: Timeline'
    },
    {
      id: 3,
      name: 'Contact',
      createdDate: '2024-10-15T11:15:45Z',
      updatedDate: '2024-11-30T16:20:33Z',
      status: 'Published',
      url: '/contact',
      metaTitle: 'Contact Smuves - Get in Touch',
      metaDescription: 'Reach out to our team for support, questions, or to learn more about our HubSpot content management solutions.',
      layout: 'Widget: Contact Form | Widget: Office Locations | Widget: Social Links'
    },
    {
      id: 4,
      name: 'Pricing',
      createdDate: '2024-09-20T13:30:12Z',
      updatedDate: '2024-12-01T08:15:44Z',
      status: 'Published',
      url: '/pricing',
      metaTitle: 'Smuves Pricing - Affordable HubSpot Tools',
      metaDescription: 'Discover our flexible pricing plans designed to fit businesses of all sizes. Start optimizing your HubSpot content today.',
      layout: 'Widget: Pricing Table | Widget: Feature Comparison | Widget: FAQ Accordion'
    },
    {
      id: 5,
      name: 'Features',
      createdDate: '2024-08-10T09:45:30Z',
      updatedDate: '2024-11-15T14:30:55Z',
      status: 'Published',
      url: '/features',
      metaTitle: 'Powerful Features for HubSpot Content Management',
      metaDescription: 'Explore our comprehensive suite of tools including bulk editing, content export, backup solutions, and more.',
      layout: 'Widget: Feature Cards | Widget: Video Player | Widget: Testimonial Slider'
    },
    {
      id: 6,
      name: 'Privacy Policy',
      createdDate: '2024-07-05T16:20:18Z',
      updatedDate: '2024-10-20T11:40:22Z',
      status: 'Published',
      url: '/privacy',
      metaTitle: 'Privacy Policy - Smuves',
      metaDescription: 'Our commitment to protecting your privacy and how we handle your data when using our HubSpot management tools.'
    },
    {
      id: 7,
      name: 'Terms of Service',
      createdDate: '2024-06-12T12:10:45Z',
      updatedDate: '2024-09-30T15:25:30Z',
      status: 'Published',
      url: '/terms',
      metaTitle: 'Terms of Service - Smuves',
      metaDescription: 'Review our terms of service for using Smuves HubSpot content management platform and related services.'
    },
    {
      id: 8,
      name: 'Documentation',
      createdDate: '2024-05-18T10:35:20Z',
      updatedDate: '2024-12-10T13:45:10Z',
      status: 'Published',
      url: '/docs',
      metaTitle: 'Documentation - Smuves Help Center',
      metaDescription: 'Comprehensive guides and documentation to help you make the most of your Smuves HubSpot management tools.'
    }
  ],
  'blog-post': [
    {
      id: 1,
      title: 'How to Optimize Your HubSpot Landing Pages for Maximum Conversions',
      author: 'Sarah Johnson',
      publishedDate: '2024-12-15T09:30:45Z',
      updatedDate: '2024-12-16T14:20:12Z',
      status: 'Published',
      tags: 'Conversion Optimization, Landing Pages, HubSpot',
      views: '2,847',
      comments: '23'
    },
    {
      id: 2,
      title: 'The Complete Guide to HubSpot Content Management',
      author: 'Mike Chen',
      publishedDate: '2024-12-10T11:15:30Z',
      updatedDate: '2024-12-12T16:45:22Z',
      status: 'Published',
      tags: 'Content Management, HubSpot, Best Practices',
      views: '1,923',
      comments: '18'
    },
    {
      id: 3,
      title: 'Bulk Editing Your HubSpot Content: Tips and Tricks',
      author: 'Emma Davis',
      publishedDate: '2024-12-05T14:22:18Z',
      updatedDate: '2024-12-06T09:30:44Z',
      status: 'Published',
      tags: 'Bulk Editing, Productivity, HubSpot',
      views: '3,156',
      comments: '31'
    },
    {
      id: 4,
      title: 'Automating Your Content Workflow with Smuves',
      author: 'Alex Rodriguez',
      publishedDate: '2024-11-28T16:40:55Z',
      updatedDate: '2024-11-30T11:15:33Z',
      status: 'Published',
      tags: 'Automation, Workflow, Content Strategy',
      views: '1,734',
      comments: '14'
    },
    {
      id: 5,
      title: 'Content Backup Strategies for HubSpot Users',
      author: 'Lisa Wang',
      publishedDate: '2024-11-20T10:25:40Z',
      updatedDate: '2024-11-22T15:30:18Z',
      status: 'Published',
      tags: 'Backup, Data Security, HubSpot',
      views: '2,489',
      comments: '27'
    },
    {
      id: 6,
      title: 'SEO Best Practices for HubSpot Blog Posts',
      author: 'David Miller',
      publishedDate: '2024-11-15T13:45:22Z',
      updatedDate: '2024-11-16T08:20:15Z',
      status: 'Published',
      tags: 'SEO, Blog Optimization, HubSpot',
      views: '4,102',
      comments: '42'
    },
    {
      id: 7,
      title: 'Integrating Google Sheets with Your HubSpot Content',
      author: 'Jennifer Brown',
      publishedDate: '2024-11-08T09:15:30Z',
      updatedDate: '2024-11-10T12:40:55Z',
      status: 'Draft',
      tags: 'Integration, Google Sheets, Data Management',
      views: '856',
      comments: '8'
    },
    {
      id: 8,
      title: 'Advanced HubSpot Reporting for Content Managers',
      author: 'Tom Anderson',
      publishedDate: '2024-10-30T15:20:18Z',
      updatedDate: '2024-11-01T10:35:42Z',
      status: 'Published',
      tags: 'Reporting, Analytics, Content Management',
      views: '1,667',
      comments: '19'
    }
  ],
  'blogs': [
    {
      id: 1,
      name: 'Marketing Insights Hub',
      description: 'Latest trends and strategies in digital marketing including social media marketing, email campaigns, content marketing, SEO optimization, and paid advertising. Our comprehensive blog covers everything from beginner basics to advanced marketing automation techniques.',
      createdDate: '2024-10-08T12:03:14Z',
      postsCount: '45',
      status: 'Active'
    },
    {
      id: 2,
      name: 'HubSpot Mastery Blog',
      description: 'Tips, tricks, and best practices for HubSpot users looking to maximize their CRM investment. Learn how to leverage HubSpot\'s powerful tools for sales automation, marketing workflows, customer service excellence, and detailed analytics reporting. Perfect for both beginners and experienced users who want to take their HubSpot skills to the next level.',
      createdDate: '2024-09-15T14:20:30Z',
      postsCount: '32',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Content Strategy Central',
      description: 'Everything about content creation and optimization',
      createdDate: '2024-08-22T11:45:18Z',
      postsCount: '28',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Automation Chronicles',
      description: 'Exploring marketing automation and workflows to help businesses streamline their operations and improve efficiency. Discover how to build smart automation sequences, create effective nurture campaigns, set up behavioral triggers, and integrate various marketing tools to create a seamless customer experience from first touch to loyal advocate.',
      createdDate: '2024-07-10T16:30:45Z',
      postsCount: '19',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Data & Analytics Corner',
      description: 'Insights on data analysis and reporting for modern marketing teams. Learn how to build custom dashboards, track KPIs that matter, create attribution models, analyze customer behavior patterns, and turn raw data into actionable insights that drive business growth and improve ROI.',
      createdDate: '2024-06-05T09:15:22Z',
      postsCount: '23',
      status: 'Archived'
    },
    {
      id: 6,
      name: 'Lead Generation Lab',
      description: 'Strategies for effective lead generation',
      createdDate: '2024-05-18T13:40:55Z',
      postsCount: '37',
      status: 'Active'
    }
  ],
  'tags': [
    {
      id: 1,
      name: 'Marketing',
      description: 'General marketing topics and strategies',
      createdDate: '2024-09-22T10:45:33Z',
      usageCount: '127',
      associatedContent: 'Blog Posts, Landing Pages'
    },
    {
      id: 2,
      name: 'HubSpot',
      description: 'HubSpot platform tips and features',
      createdDate: '2024-08-15T14:20:18Z',
      usageCount: '98',
      associatedContent: 'Blog Posts, Website Pages'
    },
    {
      id: 3,
      name: 'Conversion Optimization',
      description: 'Techniques for improving conversion rates',
      createdDate: '2024-07-30T11:35:45Z',
      usageCount: '64',
      associatedContent: 'Landing Pages, Blog Posts'
    },
    {
      id: 4,
      name: 'Content Management',
      description: 'Content creation and management strategies',
      createdDate: '2024-06-12T16:50:22Z',
      usageCount: '85',
      associatedContent: 'Blog Posts, Website Pages'
    },
    {
      id: 5,
      name: 'SEO',
      description: 'Search engine optimization best practices',
      createdDate: '2024-05-25T09:25:30Z',
      usageCount: '73',
      associatedContent: 'Blog Posts, Website Pages'
    },
    {
      id: 6,
      name: 'Lead Generation',
      description: 'Strategies for generating quality leads',
      createdDate: '2024-04-18T13:15:45Z',
      usageCount: '91',
      associatedContent: 'Landing Pages, Blog Posts'
    },
    {
      id: 7,
      name: 'Automation',
      description: 'Marketing automation and workflow optimization',
      createdDate: '2024-03-08T15:40:18Z',
      usageCount: '56',
      associatedContent: 'Blog Posts, Landing Pages'
    },
    {
      id: 8,
      name: 'Analytics',
      description: 'Data analysis and performance tracking',
      createdDate: '2024-02-20T12:30:55Z',
      usageCount: '42',
      associatedContent: 'Blog Posts, Website Pages'
    }
  ],
  'authors': [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@smuves.com',
      bio: 'Senior Content Strategist with 8 years of experience in digital marketing and HubSpot optimization.',
      createdDate: '2024-08-14T16:20:08Z',
      postsCount: '23',
      socialLinks: 'LinkedIn, Twitter'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@smuves.com',
      bio: 'Technical Content Writer specializing in HubSpot integrations and automation workflows.',
      createdDate: '2024-07-22T11:45:30Z',
      postsCount: '18',
      socialLinks: 'LinkedIn, GitHub'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@smuves.com',
      bio: 'Marketing Operations Manager focused on content efficiency and process optimization.',
      createdDate: '2024-06-15T14:30:45Z',
      postsCount: '15',
      socialLinks: 'LinkedIn, Medium'
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@smuves.com',
      bio: 'Growth Marketing Specialist with expertise in conversion optimization and A/B testing.',
      createdDate: '2024-05-10T09:15:22Z',
      postsCount: '12',
      socialLinks: 'LinkedIn, Twitter'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      email: 'lisa.wang@smuves.com',
      bio: 'Data Analyst and Content Performance Expert helping teams make data-driven decisions.',
      createdDate: '2024-04-03T13:50:18Z',
      postsCount: '19',
      socialLinks: 'LinkedIn, Twitter'
    },
    {
      id: 6,
      name: 'David Miller',
      email: 'david.miller@smuves.com',
      bio: 'SEO Specialist and Content Optimization Expert with proven track record in organic growth.',
      createdDate: '2024-03-18T16:25:45Z',
      postsCount: '21',
      socialLinks: 'LinkedIn, Twitter, SEMrush'
    }
  ],
  'url-redirects': [
    {
      id: 1,
      sourceUrl: '/old-landing-page',
      destinationUrl: '/new-landing-page',
      type: '301 Permanent',
      createdDate: '2024-07-30T09:12:55Z',
      status: 'Active',
      hitCount: '1,247'
    },
    {
      id: 2,
      sourceUrl: '/legacy-blog',
      destinationUrl: '/blog',
      type: '301 Permanent',
      createdDate: '2024-08-15T14:35:22Z',
      status: 'Active',
      hitCount: '892'
    },
    {
      id: 3,
      sourceUrl: '/old-contact',
      destinationUrl: '/contact',
      type: '301 Permanent',
      createdDate: '2024-09-10T11:20:45Z',
      status: 'Active',
      hitCount: '334'
    },
    {
      id: 4,
      sourceUrl: '/product-demo',
      destinationUrl: '/demo',
      type: '302 Temporary',
      createdDate: '2024-10-05T16:45:30Z',
      status: 'Active',
      hitCount: '567'
    },
    {
      id: 5,
      sourceUrl: '/pricing-old',
      destinationUrl: '/pricing',
      type: '301 Permanent',
      createdDate: '2024-11-12T10:30:18Z',
      status: 'Active',
      hitCount: '723'
    },
    {
      id: 6,
      sourceUrl: '/features-v1',
      destinationUrl: '/features',
      type: '301 Permanent',
      createdDate: '2024-12-01T13:15:42Z',
      status: 'Active',
      hitCount: '156'
    },
    {
      id: 7,
      sourceUrl: '/support-center',
      destinationUrl: '/help',
      type: '301 Permanent',
      createdDate: '2024-06-20T15:40:25Z',
      status: 'Inactive',
      hitCount: '2,134'
    }
  ],
  'hubdb-tables': [
    {
      id: 1,
      name: 'Product Catalog',
      description: 'Complete inventory of all products with specifications',
      createdDate: '2024-06-18T14:38:22Z',
      updatedDate: '2024-12-15T09:25:30Z',
      rowsCount: '1,247',
      columnsCount: '12'
    },
    {
      id: 2,
      name: 'Customer Directory',
      description: 'Customer information and contact details database',
      createdDate: '2024-07-25T11:15:45Z',
      updatedDate: '2024-12-10T16:40:18Z',
      rowsCount: '3,892',
      columnsCount: '8'
    },
    {
      id: 3,
      name: 'Event Calendar',
      description: 'Upcoming events, webinars, and important dates',
      createdDate: '2024-08-10T16:30:12Z',
      updatedDate: '2024-12-08T11:20:45Z',
      rowsCount: '156',
      columnsCount: '6'
    },
    {
      id: 4,
      name: 'Team Members',
      description: 'Employee directory with roles and contact information',
      createdDate: '2024-09-05T09:45:30Z',
      updatedDate: '2024-11-30T14:15:22Z',
      rowsCount: '67',
      columnsCount: '10'
    },
    {
      id: 5,
      name: 'Resource Library',
      description: 'Digital assets, documents, and downloadable resources',
      createdDate: '2024-10-12T13:20:18Z',
      updatedDate: '2024-12-05T10:35:55Z',
      rowsCount: '234',
      columnsCount: '7'
    },
    {
      id: 6,
      name: 'Testimonials Database',
      description: 'Customer reviews and testimonials database',
      createdDate: '2024-11-08T15:50:45Z',
      updatedDate: '2024-12-12T08:45:30Z',
      rowsCount: '89',
      columnsCount: '5'
    }
  ]
};

interface ExportsContentProps {
  onShowLogs: () => void;
  onShowProfile?: (defaultTab?: 'profile' | 'columns') => void;
}

export function ExportsContent({ onShowLogs, onShowProfile }: ExportsContentProps) {
  const { getColumnPreferences, updateColumnPreferences, getAvailableColumns } = useColumnPreferences();
  const { addNotification } = useNotifications();
  const { startFetch, fetchingProgresses } = useFetchingStatus();
  const { savedFilters, addSavedFilter, removeSavedFilter, getSavedFiltersByContentType } = useSavedFilters();
  
  // Set default content type to 'landing-page'
  const [selectedContentType, setSelectedContentType] = useState<string>('landing-page');
  const [selectedSearchType, setSelectedSearchType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFindReplaceModal, setShowFindReplaceModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showBulkEditModal, setShowBulkEditModal] = useState(false);
  const [showColumnReorderModal, setShowColumnReorderModal] = useState(false);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [showAIAssistantModal, setShowAIAssistantModal] = useState(false);
  const [showFetchingModal, setShowFetchingModal] = useState(false);
  const { isBypassEnabled } = useBypass();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [allPagesSelected, setAllPagesSelected] = useState(false);
  const [bulkEditValues, setBulkEditValues] = useState<Record<string, any>>({});
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [lastUpdated] = useState(new Date());
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  
  // Fetching states
  const [shouldShowFailure, setShouldShowFailure] = useState(false); // Toggle between success and failure
  
  // Filter states for landing pages
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState<string>('');
  const [filtersExpanded, setFiltersExpanded] = useState(false); // Collapsed by default
  const [selectedFilters, setSelectedFilters] = useState({
    authorName: [] as string[],
    campaign: [] as string[],
    domain: [] as string[],
    htmlTitle: [] as string[],
    language: [] as string[],
    name: [] as string[],
    slug: [] as string[],
    state: [] as string[],
    publishDate: null as Date | null
  });

  // Map content type keys to display names for column preferences
  const getContentTypeDisplayName = (contentTypeKey: string): ContentType => {
    const mapping: { [key: string]: ContentType } = {
      'website-page': 'Website Page',
      'landing-page': 'Landing Page',
      'blog-post': 'Blog Post',
      'blogs': 'Blogs',
      'tags': 'Tags',
      'authors': 'Authors',
      'url-redirects': 'URL Redirects',
      'hubdb-tables': 'HubDB Tables'
    };
    return mapping[contentTypeKey] || 'Website Page';
  };

  // Get current config based on selected content type
  const currentConfig = selectedContentType ? contentTypeConfigs[selectedContentType as keyof typeof contentTypeConfigs] : null;
  const currentData = selectedContentType ? mockDataByType[selectedContentType as keyof typeof mockDataByType] || [] : [];

  // Initialize column order when content type changes
  useEffect(() => {
    if (selectedContentType) {
      const contentTypeDisplayName = getContentTypeDisplayName(selectedContentType);
      const preferredColumns = getColumnPreferences(contentTypeDisplayName);
      setColumnOrder(preferredColumns);
      // Clear selections when content type changes
      setSelectedRows(new Set());
      setAllPagesSelected(false);
      setCurrentPage(1);
    }
  }, [selectedContentType, getColumnPreferences]);

  // Get selected records data
  const selectedRecords = Array.from(selectedRows).map(index => currentData[index]).filter(Boolean);

  // Format the current date and time for "Last Updated"
  const formatLastUpdated = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${month}/${day}/${year}, ${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    const contentTypeLabel = currentConfig?.label || 'Content';
    
    // Open the fetching modal when refresh is clicked
    setShowFetchingModal(true);
    
    // Start the persistent fetch simulation (2,000 records in 15 seconds)
    startFetch(contentTypeLabel);
    
    // Keep refreshing state for visual feedback
    setTimeout(() => {
      setIsRefreshing(false);
      
      // Show a simple toast for immediate feedback
      toast.info('Your data is being fetched. Please check the status in the header.');
    }, 1000);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(currentPageData.map((_, index) => startIndex + index)));
      setAllPagesSelected(false);
    } else {
      setSelectedRows(new Set());
      setAllPagesSelected(false);
    }
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(index);
    } else {
      newSelectedRows.delete(index);
    }
    setSelectedRows(newSelectedRows);
    setAllPagesSelected(false);
  };

  const handleSelectAllPages = () => {
    // Select all records across all pages
    setSelectedRows(new Set(currentData.map((_, index) => index)));
    setAllPagesSelected(true);
  };

  const handleClearSelection = () => {
    setSelectedRows(new Set());
    setAllPagesSelected(false);
  };

  // Premium feature handlers
  const handleBulkEditClick = () => {
    setShowBulkEditModal(true);
  };

  const handleFindReplaceClick = () => {
    setShowFindReplaceModal(true);
  };

  // Column reordering function
  const handleColumnDrop = (dragIndex: number, hoverIndex: number) => {
    const newOrder = [...(columnOrder.length > 0 ? columnOrder : currentConfig?.tableHeaders || [])];
    const draggedColumn = newOrder[dragIndex];
    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedColumn);
    setColumnOrder(newOrder);
  };

  const handleExportComplete = () => {
    onShowLogs();
  };

  const handleUploadComplete = () => {
    onShowLogs();
  };

  // Filter handlers
  const handleShowMoreFilter = (filterType: string) => {
    setCurrentFilterType(filterType);
    setFilterModalOpen(true);
  };

  const handleApplyFilter = (filterType: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: values
    }));
  };

  const handleClearFilter = (filterType: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: []
    }));
  };

  const handleSelectFilter = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType as keyof typeof prev];
      if (Array.isArray(currentValues)) {
        // Toggle selection
        if (currentValues.includes(value)) {
          return {
            ...prev,
            [filterType]: currentValues.filter((v: string) => v !== value)
          };
        } else {
          return {
            ...prev,
            [filterType]: [...currentValues, value]
          };
        }
      }
      return prev;
    });
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({
      authorName: [],
      campaign: [],
      domain: [],
      htmlTitle: [],
      language: [],
      name: [],
      slug: [],
      state: [],
      publishDate: null
    });
  };

  const handleApplyAllFilters = () => {
    toast.success('Filters applied successfully');
    // In a real app, this would filter the data
  };

  const handleSaveFilter = (name: string) => {
    addSavedFilter({
      name,
      contentType: selectedContentType,
      filters: {
        searchQuery,
        ...selectedFilters
      }
    });
    toast.success('Filter saved successfully', {
      description: `"${name}" has been saved for quick access`
    });
  };

  const handleLoadFilter = (filterId: string) => {
    const filter = savedFilters.find(f => f.id === filterId);
    if (filter) {
      // Apply search query
      if (filter.filters.searchQuery) {
        setSearchQuery(filter.filters.searchQuery);
      }
      
      // Apply all filter values
      setSelectedFilters({
        authorName: filter.filters.authorName || [],
        campaign: filter.filters.campaign || [],
        domain: filter.filters.domain || [],
        htmlTitle: filter.filters.htmlTitle || [],
        language: filter.filters.language || [],
        name: filter.filters.name || [],
        slug: filter.filters.slug || [],
        state: filter.filters.state || [],
        publishDate: filter.filters.publishDate || null
      });
      
      toast.success('Filter loaded', {
        description: `"${filter.name}" has been applied`
      });
    }
  };

  const handleRemoveSavedFilter = (filterId: string) => {
    const filter = savedFilters.find(f => f.id === filterId);
    removeSavedFilter(filterId);
    toast.success('Filter removed', {
      description: `"${filter?.name}" has been deleted`
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedFilters.authorName.length > 0) count++;
    if (selectedFilters.campaign.length > 0) count++;
    if (selectedFilters.domain.length > 0) count++;
    if (selectedFilters.htmlTitle.length > 0) count++;
    if (selectedFilters.language.length > 0) count++;
    if (selectedFilters.name.length > 0) count++;
    if (selectedFilters.slug.length > 0) count++;
    if (selectedFilters.state.length > 0) count++;
    if (selectedFilters.publishDate) count++;
    return count;
  };

  const getFilterOptions = (filterType: string): string[] => {
    const filterMap: { [key: string]: string[] } = {
      authorName: authorNameOptions,
      campaign: campaignOptions,
      domain: domainOptions,
      htmlTitle: htmlTitleOptions,
      language: languageOptions,
      name: nameOptions,
      slug: slugOptions,
      state: stateOptions
    };
    return filterMap[filterType] || [];
  };

  // Pagination
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = currentData.slice(startIndex, endIndex);

  return (
    <div className="flex-1 flex flex-col bg-white relative">
      <LastUpdatedBar lastUpdated={lastUpdated} />
      {/* Page Header */}
      

      {/* Content Manager Card */}
      <div className="p-6">
        {/* Content Type Selector and Refresh - Outside the Filters Card */}
        <div className="mb-4 flex items-center justify-end gap-3">
          <label className="text-sm font-medium text-gray-700">Content Type:</label>
          <Select
            value={selectedContentType}
            onValueChange={setSelectedContentType}
          >
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(contentTypeConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg mb-4">
          {/* Collapsible Header */}
          <button
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-t-lg"
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-5 w-5 text-gray-600" />
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">Filters</h2>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    {getActiveFilterCount()} active
                  </span>
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Use these filters to narrow down your HubSpot content by content type, archive status, publish state, and date range.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2">
              {getActiveFilterCount() > 0 && (
                <span className="text-sm text-gray-500 mr-2">
                  Click to {filtersExpanded ? 'collapse' : 'expand'}
                </span>
              )}
              {filtersExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              )}
            </div>
          </button>

          {/* Compact Filter Summary (when collapsed) */}
          {!filtersExpanded && getActiveFilterCount() > 0 && (
            <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
              {selectedFilters.authorName.length > 0 && (
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-200">
                  <span className="font-medium">Author:</span>
                  <span>{selectedFilters.authorName.length} selected</span>
                </div>
              )}
              {selectedFilters.campaign.length > 0 && (
                <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded border border-purple-200">
                  <span className="font-medium">Campaign:</span>
                  <span>{selectedFilters.campaign.length} selected</span>
                </div>
              )}
              {selectedFilters.domain.length > 0 && (
                <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded border border-green-200">
                  <span className="font-medium">Domain:</span>
                  <span>{selectedFilters.domain.length} selected</span>
                </div>
              )}
              {selectedFilters.htmlTitle.length > 0 && (
                <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded border border-orange-200">
                  <span className="font-medium">HTML Title:</span>
                  <span>{selectedFilters.htmlTitle.length} selected</span>
                </div>
              )}
              {selectedFilters.language.length > 0 && (
                <div className="inline-flex items-center gap-1 bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded border border-pink-200">
                  <span className="font-medium">Language:</span>
                  <span>{selectedFilters.language.length} selected</span>
                </div>
              )}
              {selectedFilters.name.length > 0 && (
                <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded border border-indigo-200">
                  <span className="font-medium">Name:</span>
                  <span>{selectedFilters.name.length} selected</span>
                </div>
              )}
              {selectedFilters.slug.length > 0 && (
                <div className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 text-xs px-2 py-1 rounded border border-cyan-200">
                  <span className="font-medium">Slug:</span>
                  <span>{selectedFilters.slug.length} selected</span>
                </div>
              )}
              {selectedFilters.state.length > 0 && (
                <div className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded border border-yellow-200">
                  <span className="font-medium">State:</span>
                  <span>{selectedFilters.state.length} selected</span>
                </div>
              )}
              {selectedFilters.publishDate && (
                <div className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded border border-gray-200">
                  <span className="font-medium">Date:</span>
                  <span>{selectedFilters.publishDate.toLocaleDateString()}</span>
                </div>
              )}
              {searchQuery && (
                <div className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded border border-teal-200">
                  <span className="font-medium">Search:</span>
                  <span className="max-w-[200px] truncate">{searchQuery}</span>
                </div>
              )}
              <button
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            </div>
          )}

          {/* Collapsible Content */}
          {filtersExpanded && (
            <div className="px-6 pb-6 pt-2 border-t border-gray-200">
              {/* Filters Row - Landing Pages */}
              {selectedContentType === 'landing-page' && (
                <>
                  {/* First Row of Filters */}
                  <div className="grid grid-cols-6 gap-4 mb-4">
                <AdvancedFilterDropdown
                  label="Author Name"
                  placeholder="Author Name"
                  options={authorNameOptions}
                  selectedValues={selectedFilters.authorName}
                  onShowMore={() => handleShowMoreFilter('authorName')}
                  onClear={() => handleClearFilter('authorName')}
                  onSelect={(value) => handleSelectFilter('authorName', value)}
                />
                <AdvancedFilterDropdown
                  label="Campaign"
                  placeholder="Campaign"
                  options={campaignOptions}
                  selectedValues={selectedFilters.campaign}
                  onShowMore={() => handleShowMoreFilter('campaign')}
                  onClear={() => handleClearFilter('campaign')}
                  onSelect={(value) => handleSelectFilter('campaign', value)}
                />
                <AdvancedFilterDropdown
                  label="Domain"
                  placeholder="Domain"
                  options={domainOptions}
                  selectedValues={selectedFilters.domain}
                  onShowMore={() => handleShowMoreFilter('domain')}
                  onClear={() => handleClearFilter('domain')}
                  onSelect={(value) => handleSelectFilter('domain', value)}
                />
                <AdvancedFilterDropdown
                  label="Html Title"
                  placeholder="Html Title"
                  options={htmlTitleOptions}
                  selectedValues={selectedFilters.htmlTitle}
                  onShowMore={() => handleShowMoreFilter('htmlTitle')}
                  onClear={() => handleClearFilter('htmlTitle')}
                  onSelect={(value) => handleSelectFilter('htmlTitle', value)}
                />
                <AdvancedFilterDropdown
                  label="Language"
                  placeholder="Language"
                  options={languageOptions}
                  selectedValues={selectedFilters.language}
                  onShowMore={() => handleShowMoreFilter('language')}
                  onClear={() => handleClearFilter('language')}
                  onSelect={(value) => handleSelectFilter('language', value)}
                />
                <AdvancedFilterDropdown
                  label="Name"
                  placeholder="Name"
                  options={nameOptions}
                  selectedValues={selectedFilters.name}
                  onShowMore={() => handleShowMoreFilter('name')}
                  onClear={() => handleClearFilter('name')}
                  onSelect={(value) => handleSelectFilter('name', value)}
                />
              </div>

              {/* Second Row of Filters */}
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-48 justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedFilters.publishDate 
                        ? selectedFilters.publishDate.toLocaleDateString()
                        : 'Select date range'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedFilters.publishDate || undefined}
                      onSelect={(date) => setSelectedFilters(prev => ({ ...prev, publishDate: date || null }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <AdvancedFilterDropdown
                  label="Slug"
                  placeholder="Slug"
                  options={slugOptions}
                  selectedValues={selectedFilters.slug}
                  onShowMore={() => handleShowMoreFilter('slug')}
                  onClear={() => handleClearFilter('slug')}
                  onSelect={(value) => handleSelectFilter('slug', value)}
                  className="w-48"
                />

                <AdvancedFilterDropdown
                  label="State"
                  placeholder="State"
                  options={stateOptions}
                  selectedValues={selectedFilters.state}
                  onShowMore={() => handleShowMoreFilter('state')}
                  onClear={() => handleClearFilter('state')}
                  onSelect={(value) => handleSelectFilter('state', value)}
                  className="w-48"
                />

                {/* Apply Filters Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="default" 
                      className="bg-black hover:bg-gray-800 text-white gap-2"
                    >
                      Apply Filters
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={handleApplyAllFilters}>
                      <Filter className="mr-2 h-4 w-4" />
                      Apply Filters
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleClearAllFilters}>
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setShowSaveFilterModal(true)}
                      disabled={getActiveFilterCount() === 0}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Filter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Saved Filters Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Bookmark className="h-4 w-4" />
                      Saved Filters
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    {getSavedFiltersByContentType(selectedContentType).length === 0 ? (
                      <div className="px-2 py-6 text-center text-sm text-gray-500">
                        No saved filters yet
                      </div>
                    ) : (
                      <>
                        {getSavedFiltersByContentType(selectedContentType).map((filter) => (
                          <DropdownMenuItem
                            key={filter.id}
                            className="flex items-center justify-between gap-2 cursor-pointer"
                            onSelect={() => handleLoadFilter(filter.id)}
                          >
                            <span className="flex-1">{filter.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveSavedFilter(filter.id);
                              }}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <X className="h-3.5 w-3.5 text-red-600" />
                            </button>
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}

          {/* Default Filters for Other Content Types */}
          {selectedContentType && selectedContentType !== 'landing-page' && (
            <div className="flex items-center gap-4">
              <Select defaultValue="">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Archived In..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="">
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select Archived In Dashboard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="not-archived">Not Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-48 justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Select Publish Date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline">
                Apply
              </Button>

              <Button variant="outline">
                Clear
              </Button>
            </div>
          )}
            </div>
          )}
        </div>

        {/* Pagination Info and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              {startIndex + 1} - {Math.min(endIndex, currentData.length)} of {currentData.length}
            </div>
            
            {/* Pagination Arrows */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Reorder Column Icon */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnReorderModal(true)}
              className="h-9 w-9 p-0"
              title="Reorder columns"
            >
              <Edit className="h-4 w-4" />
            </Button>

            {/* AI Assistant Button */}
            {selectedRows.size > 0 && (
              <Button
                onClick={() => setShowAIAssistantModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2"
              >
                <Sparkles className="h-4 w-4" />
                AI Assistant
              </Button>
            )}

            {/* Additional Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleFindReplaceClick}>
                  <Replace className="mr-2 h-4 w-4" />
                  Find & Replace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowExportModal(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBulkEditClick}>
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Selection Bar */}
        <SmartSelectionBar
          selectedCount={selectedRows.size}
          totalOnPage={currentPageData.length}
          totalAll={currentData.length}
          allSelected={allPagesSelected}
          contentTypeLabel={currentConfig?.label || ''}
          onSelectAllPages={handleSelectAllPages}
          onClearSelection={handleClearSelection}
        />

        {/* Data Table Card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={currentPageData.length > 0 && currentPageData.every((_, index) => selectedRows.has(startIndex + index))}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {(columnOrder.length > 0 ? columnOrder : currentConfig?.tableHeaders || []).map((header, index) => (
                  <TableHead key={header}>
                    <div className="flex items-center gap-1">
                      <GripVertical 
                        className="w-4 h-4 cursor-move opacity-60 hover:opacity-100" 
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', index.toString());
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                          handleColumnDrop(dragIndex, index);
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const sortableColumn = currentConfig?.sortableColumns?.[currentConfig.tableHeaders.indexOf(header)];
                          if (sortableColumn) handleSort(sortableColumn);
                        }}
                        className="h-auto p-0 font-medium"
                      >
                        {header}
                        {(() => {
                          const sortableColumn = currentConfig?.sortableColumns?.[currentConfig.tableHeaders.indexOf(header)];
                          return sortableColumn && sortColumn === sortableColumn && (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="ml-2 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-2 h-4 w-4" />
                            )
                          );
                        })()}
                      </Button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData.map((item, index) => {
                const globalIndex = startIndex + index;
                const headers = columnOrder.length > 0 ? columnOrder : currentConfig?.tableHeaders || [];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(globalIndex)}
                        onCheckedChange={(checked) => handleSelectRow(globalIndex, checked as boolean)}
                      />
                    </TableCell>
                    {headers.map((header, cellIndex) => {
                      const fieldKey = header.toLowerCase().replace(/\s+/g, '');
                      const mappedFieldKey = fieldKey === 'name' ? 'name' : 
                                           fieldKey === 'archivedat' ? 'archivedAt' :
                                           fieldKey === 'archivedindashboard' ? 'archivedInDashboard' :
                                           fieldKey === 'attachedstylesheets' ? 'attachedStylesheets' :
                                           fieldKey === 'authorname' ? 'authorName' :
                                           fieldKey === 'campaign' ? 'campaign' : 
                                            fieldKey === 'createddate' ? 'createdDate' :
                                            fieldKey === 'updateddate' ? 'updatedDate' :
                                            fieldKey === 'publisheddate' ? 'publishedDate' :
                                            fieldKey === 'status' ? 'status' :
                                            fieldKey === 'url' ? 'url' :
                                            fieldKey === 'metatitle' ? 'metaTitle' :
                                            fieldKey === 'metadescription' ? 'metaDescription' :
                                            fieldKey === 'leadgeneration' ? 'leadGeneration' :
                                            fieldKey === 'conversionrate' ? 'conversionRate' :
                                            fieldKey === 'title' ? 'title' :
                                            fieldKey === 'author' ? 'author' :
                                            fieldKey === 'tags' ? 'tags' :
                                            fieldKey === 'views' ? 'views' :
                                            fieldKey === 'comments' ? 'comments' :
                                            fieldKey === 'description' ? 'description' :
                                            fieldKey === 'postscount' ? 'postsCount' :
                                            fieldKey === 'email' ? 'email' :
                                            fieldKey === 'bio' ? 'bio' :
                                            fieldKey === 'sociallinks' ? 'socialLinks' :
                                            fieldKey === 'sourceurl' ? 'sourceUrl' :
                                            fieldKey === 'destinationurl' ? 'destinationUrl' :
                                            fieldKey === 'type' ? 'type' :
                                            fieldKey === 'hitcount' ? 'hitCount' :
                                            fieldKey === 'rowscount' ? 'rowsCount' :
                                            fieldKey === 'columnscount' ? 'columnsCount' :
                                            fieldKey === 'usagecount' ? 'usageCount' :
                                            fieldKey === 'associatedcontent' ? 'associatedContent' : fieldKey;
                      return (
                        <TableCell key={cellIndex}>
                          {(() => {
                             const cellValue = item[mappedFieldKey as keyof typeof item];
                             
                             // Format dates
                             if ((mappedFieldKey === 'archivedAt' || mappedFieldKey === 'createdDate' || mappedFieldKey === 'updatedDate' || mappedFieldKey === 'publishedDate') && cellValue && cellValue !== '1970-01-01T00:00:00Z') {
                               return formatTableDateTime(cellValue);
                             }
                             
                             // Use ExpandableTextCell for text-heavy fields
                             const expandableFields = ['description', 'metaDescription', 'bio', 'content'];
                             if (expandableFields.includes(mappedFieldKey) && cellValue && typeof cellValue === 'string') {
                               return <ExpandableTextCell text={cellValue} />;
                             }
                             
                             return cellValue || '-';
                           })()}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>


      </div>

      {/* Modals */}
      {showFindReplaceModal && (
        <FindAndReplaceModal
          isOpen={showFindReplaceModal}
          onClose={() => setShowFindReplaceModal(false)}
          selectedCount={selectedRows.size}
          onConfirm={() => {
            setShowFindReplaceModal(false);
            toast.success('Find & Replace completed successfully');
            onShowLogs();
          }}
          tableHeaders={currentConfig?.tableHeaders || []}
          selectedData={selectedRecords.length > 0 ? selectedRecords : currentData}
          currentConfig={currentConfig}
        />
      )}

      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          tableHeaders={currentConfig?.tableHeaders || []}
          onExportComplete={handleExportComplete}
        />
      )}

      {showBulkEditModal && (
        <BulkEditModal
          isOpen={showBulkEditModal}
          onClose={() => setShowBulkEditModal(false)}
          contentType={selectedContentType}
          currentConfig={currentConfig}
          data={selectedRecords.length > 0 ? selectedRecords : currentData}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {showPreviewModal && (
        <PreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          selectedRows={Array.from(selectedRows)}
          bulkEditValues={bulkEditValues}
          data={currentPageData}
          contentType={selectedContentType}
          onConfirm={() => {
            setShowPreviewModal(false);
            toast.success('Changes uploaded to HubSpot successfully');
            onShowLogs();
          }}
        />
      )}

      {showColumnReorderModal && (
        <ColumnReorderModal
          isOpen={showColumnReorderModal}
          onClose={() => setShowColumnReorderModal(false)}
          availableColumns={getAvailableColumns(getContentTypeDisplayName(selectedContentType))}
          selectedColumns={getColumnPreferences(getContentTypeDisplayName(selectedContentType))}
          contentType={getContentTypeDisplayName(selectedContentType)}
          onApply={(newColumnOrder) => {
            updateColumnPreferences(getContentTypeDisplayName(selectedContentType), newColumnOrder);
            setColumnOrder(newColumnOrder);
            toast.success('Column preferences updated successfully');
          }}
          onGoToSettings={() => {
            setShowColumnReorderModal(false);
            if (onShowProfile) {
              onShowProfile('columns');
              toast.info('Opening Profile Settings - Column Settings tab');
            } else {
              toast.info('Navigate to Profile > Column Settings to manage preferences globally');
            }
          }}
        />
      )}

      {/* Filter Selection Modal */}
      <FilterSelectionModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filterLabel={currentFilterType.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())}
        allOptions={getFilterOptions(currentFilterType)}
        selectedValues={selectedFilters[currentFilterType as keyof typeof selectedFilters] as string[] || []}
        onApply={(values) => handleApplyFilter(currentFilterType, values)}
      />

      {/* Save Filter Modal */}
      <SaveFilterModal
        isOpen={showSaveFilterModal}
        onClose={() => setShowSaveFilterModal(false)}
        onSave={handleSaveFilter}
        currentFilterCount={getActiveFilterCount()}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={showAIAssistantModal}
        onClose={() => setShowAIAssistantModal(false)}
        selectedCount={selectedRows.size}
        contentType={currentConfig?.label || 'Content'}
        onApplyBulkEdit={(fields) => {
          setBulkEditValues(prev => ({ ...prev, ...fields }));
          setShowBulkEditModal(true);
        }}
        onApplyFindReplace={(findValue, replaceValue, field) => {
          setShowFindReplaceModal(true);
          // The find & replace modal will handle the actual values
          toast.info(`Opening Find & Replace: "${findValue}" → "${replaceValue}"`);
        }}
      />

      {/* Fetching Status Modal */}
      {showFetchingModal && (
        <div className="fixed inset-0 z-50">
          {/* Transparent backdrop to capture clicks */}
          <div 
            className="fixed inset-0" 
            onClick={() => setShowFetchingModal(false)}
          />
          {/* Modal Content - positioned to align with hourglass icon in header */}
          <div className="absolute top-14 right-48">
            <FetchingStatusTray fetchingProgresses={fetchingProgresses} />
          </div>
        </div>
      )}
    </div>
  );
}