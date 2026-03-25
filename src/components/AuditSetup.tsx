import { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronRight, FolderTree, Loader2, Search, ArrowRight, ArrowLeft, File, Download, Upload, CheckCircle, FileText, Inbox } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

type Step = 1 | 2 | 3 | 4;

interface ContentType {
  id: string;
  name: string;
  count: number;
  fetched: boolean;
  fetching: boolean;
  expanded?: boolean;
  children?: ContentItem[];
}

interface ContentItem {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface ThemeFolder {
  id: string;
  name: string;
  size: string;
  lastModified: string;
  imported: boolean;
  importing: boolean;
  expanded?: boolean;
  children?: FolderItem[];
}

interface UploadedFolder {
  id: string;
  name: string;
  size: number;
  expanded: boolean;
  children: FolderItem[];
}

interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: FolderItem[];
  expanded?: boolean;
  content?: string;
}

interface EnrichmentTask {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'complete';
  count?: number;
  total?: number;
}

interface Language {
  id: string;
  name: string;
  code: string;
  count: number;
  status: 'pending' | 'in-progress' | 'complete';
}

interface AuditSetupProps {
  onFinish?: () => void;
}

export function AuditSetup({ onFinish }: AuditSetupProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  // Step 1: Fetch Content Types
  const [contentTypes, setContentTypes] = useState<ContentType[]>([
    { id: '1', name: 'Site Pages', count: 0, fetched: false, fetching: false, expanded: false, children: [] },
    { id: '2', name: 'Landing Pages', count: 0, fetched: false, fetching: false, expanded: false, children: [] },
    { id: '3', name: 'Blog Posts', count: 0, fetched: false, fetching: false, expanded: false, children: [] },
    { id: '4', name: 'Blog Listing Pages', count: 0, fetched: false, fetching: false, expanded: false, children: [] },
    { id: '5', name: 'Knowledge Base Articles', count: 0, fetched: false, fetching: false, expanded: false, children: [] },
    { id: '6', name: 'System Pages', count: 0, fetched: false, fetching: false, expanded: false, children: [] },
  ]);
  const [fetchingContent, setFetchingContent] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);

  // Step 2: Theme Folders
  const [themeFolders, setThemeFolders] = useState<ThemeFolder[]>([]);
  const [fetchingThemeFolders, setFetchingThemeFolders] = useState(false);
  const [themeFoldersFetched, setThemeFoldersFetched] = useState(false);

  // Step 3: Upload Theme Folders
  const [uploadedFolders, setUploadedFolders] = useState<UploadedFolder[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Step 3: Enrich Data
  const [enrichmentTasks, setEnrichmentTasks] = useState<EnrichmentTask[]>([]);
  const [enrichmentProgress, setEnrichmentProgress] = useState(0);
  const [enrichmentStarted, setEnrichmentStarted] = useState(false);
  const [enrichmentComplete, setEnrichmentComplete] = useState(false);

  // Step 4: Enrich Language
  const [languages, setLanguages] = useState<Language[]>([]);
  const [languageProgress, setLanguageProgress] = useState(0);
  const [languageStarted, setLanguageStarted] = useState(false);
  const [languageComplete, setLanguageComplete] = useState(false);

  // Modal states
  const [selectedFile, setSelectedFile] = useState<FolderItem | null>(null);
  const [fileModalOpen, setFileModalOpen] = useState(false);

  // Mock content for different file types
  const getMockFileContent = (fileName: string): string => {
    if (fileName.endsWith('.module')) {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ module.title }}</title>
</head>
<body>
  <div class="module-wrapper">
    {% if module.heading %}
      <h2>{{ module.heading }}</h2>
    {% endif %}
    
    {% if module.description %}
      <p>{{ module.description }}</p>
    {% endif %}
    
    <div class="cta-wrapper">
      <a href="{{ module.link.url }}" class="btn">
        {{ module.link.text }}
      </a>
    </div>
  </div>
</body>
</html>`;
    } else if (fileName.endsWith('.html')) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  {{ standard_header_includes }}
  <title>{{ content.html_title }}</title>
</head>
<body>
  {% module "header" path="@hubspot/header" %}
  
  <main class="body-container-wrapper">
    <div class="container">
      {% dnd_area "main_content" %}
        {% dnd_section %}
          {% dnd_column %}
            {% dnd_row %}
              {% dnd_module path="@hubspot/rich_text" %}
              {% end_dnd_module %}
            {% end_dnd_row %}
          {% end_dnd_column %}
        {% end_dnd_section %}
      {% end_dnd_area %}
    </div>
  </main>
  
  {% module "footer" path="@hubspot/footer" %}
  {{ standard_footer_includes }}
</body>
</html>`;
    } else if (fileName.endsWith('.css')) {
      return `:root {
  --primary-color: #10B981;
  --secondary-color: #6B7280;
  --background: #FFFFFF;
  --text-primary: #111827;
  --text-secondary: #6B7280;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text-primary);
  background-color: var(--background);
  margin: 0;
  padding: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #059669;
}`;
    } else if (fileName.endsWith('.js')) {
      return `// Main application JavaScript
(function() {
  'use strict';

  // Initialize the application
  function init() {
    console.log('Application initialized');
    setupEventListeners();
    initializeModules();
  }

  // Setup event listeners
  function setupEventListeners() {
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
      navToggle.addEventListener('click', toggleMobileNav);
    }
  }

  // Initialize modules
  function initializeModules() {
    // Initialize any dynamic modules here
    const modules = document.querySelectorAll('[data-module]');
    modules.forEach(module => {
      const type = module.getAttribute('data-module');
      console.log('Initializing module:', type);
    });
  }

  // Toggle mobile navigation
  function toggleMobileNav() {
    const nav = document.querySelector('.mobile-nav');
    if (nav) {
      nav.classList.toggle('open');
    }
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();`;
    } else if (fileName.endsWith('.json')) {
      return `{
  "label": "Remote Theme",
  "version": "2.0.1",
  "author": "Remote Team",
  "preview_path": "./templates/home.html",
  "screenshot_path": "./images/template-previews/home.png",
  "is_available_for_new_content": true,
  "responsive_breakpoints": [
    {
      "name": "mobile",
      "max_width": 767
    },
    {
      "name": "tablet",
      "max_width": 1023
    }
  ],
  "enable_domain_stylesheets": false,
  "enable_layout_stylesheets": true
}`;
    }
    return `// File content for ${fileName}\n// This is a sample file with mock content`;
  };

  // Step 1: Fetch Content Types
  const handleFetchContentTypes = async () => {
    setFetchingContent(true);
    
    const mockCounts = [2806, 342, 1492, 89, 456, 127];
    const mockChildren: ContentItem[][] = [
      [
        { id: 'sp1', name: 'Homepage', url: 'https://remote.com/', type: 'site_page' },
        { id: 'sp2', name: 'About Us', url: 'https://remote.com/about', type: 'site_page' },
        { id: 'sp3', name: 'Products', url: 'https://remote.com/products', type: 'site_page' },
        { id: 'sp4', name: 'Pricing', url: 'https://remote.com/pricing', type: 'site_page' },
        { id: 'sp5', name: 'Contact', url: 'https://remote.com/contact', type: 'site_page' },
      ],
      [
        { id: 'lp1', name: 'Product Launch 2026', url: 'https://remote.com/landing/product-launch', type: 'landing_page' },
        { id: 'lp2', name: 'Summer Campaign', url: 'https://remote.com/landing/summer', type: 'landing_page' },
        { id: 'lp3', name: 'Webinar Registration', url: 'https://remote.com/landing/webinar', type: 'landing_page' },
      ],
      [
        { id: 'bp1', name: 'How to Build Remote Teams', url: 'https://remote.com/blog/remote-teams', type: 'blog_post' },
        { id: 'bp2', name: 'Top HR Trends 2026', url: 'https://remote.com/blog/hr-trends', type: 'blog_post' },
        { id: 'bp3', name: 'Global Payroll Guide', url: 'https://remote.com/blog/payroll-guide', type: 'blog_post' },
      ],
      [
        { id: 'bl1', name: 'Blog Home', url: 'https://remote.com/blog', type: 'blog_listing' },
        { id: 'bl2', name: 'HR Category', url: 'https://remote.com/blog/category/hr', type: 'blog_listing' },
      ],
      [
        { id: 'kb1', name: 'Getting Started Guide', url: 'https://remote.com/kb/getting-started', type: 'knowledge_article' },
        { id: 'kb2', name: 'Account Setup', url: 'https://remote.com/kb/account-setup', type: 'knowledge_article' },
        { id: 'kb3', name: 'Troubleshooting', url: 'https://remote.com/kb/troubleshooting', type: 'knowledge_article' },
      ],
      [
        { id: 'sys1', name: '404 Error Page', url: 'https://remote.com/404', type: 'system_page' },
        { id: 'sys2', name: 'Search Results', url: 'https://remote.com/search', type: 'system_page' },
      ],
    ];
    
    for (let i = 0; i < contentTypes.length; i++) {
      setContentTypes(prev => prev.map((ct, idx) => 
        idx === i ? { ...ct, fetching: true } : ct
      ));
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setContentTypes(prev => prev.map((ct, idx) => 
        idx === i ? { ...ct, fetching: false, fetched: true, count: mockCounts[i], children: mockChildren[i] } : ct
      ));
    }
    
    setFetchingContent(false);
    setFetchComplete(true);
    toast.success('Content types fetched successfully');
  };

  const toggleContentTypeExpansion = (id: string) => {
    setContentTypes(prev => prev.map(ct => 
      ct.id === id ? { ...ct, expanded: !ct.expanded } : ct
    ));
  };

  // Step 2: Fetch Theme Folders with tree structure
  const handleFetchThemeFolders = async () => {
    setFetchingThemeFolders(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockThemeFolders: ThemeFolder[] = [
      { 
        id: '1', 
        name: 'Remote 2025 Theme', 
        size: '45.2 MB', 
        lastModified: 'February 27, 2026', 
        imported: false, 
        importing: false,
        expanded: false,
        children: [
          {
            id: 'tf1-1',
            name: 'modules',
            type: 'folder',
            path: '/Remote 2025 Theme/modules',
            expanded: false,
            children: [
              { id: 'tf1-1-1', name: 'Remote - Page Setting.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Page Setting.module' },
              { id: 'tf1-1-2', name: 'Remote - Page Schema.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Page Schema.module' },
              { id: 'tf1-1-3', name: 'Remote - Hero - Expanded.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Hero - Expanded.module' },
              { id: 'tf1-1-4', name: 'Remote - Side Navigation.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Side Navigation.module' },
              { id: 'tf1-1-5', name: 'Remote - Banner.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Banner.module' },
            ]
          },
          {
            id: 'tf1-2',
            name: 'templates',
            type: 'folder',
            path: '/Remote 2025 Theme/templates',
            expanded: false,
            children: [
              { id: 'tf1-2-1', name: 'CE - Products.html', type: 'file', path: '/Remote 2025 Theme/templates/CE - Products.html' },
              { id: 'tf1-2-2', name: 'CE - Benefits Detail.html', type: 'file', path: '/Remote 2025 Theme/templates/CE - Benefits Detail.html' },
              { id: 'tf1-2-3', name: 'CE - Grow your team.html', type: 'file', path: '/Remote 2025 Theme/templates/CE - Grow your team.html' },
            ]
          },
          {
            id: 'tf1-3',
            name: 'css',
            type: 'folder',
            path: '/Remote 2025 Theme/css',
            expanded: false,
            children: [
              { id: 'tf1-3-1', name: 'main.css', type: 'file', path: '/Remote 2025 Theme/css/main.css' },
              { id: 'tf1-3-2', name: 'theme.css', type: 'file', path: '/Remote 2025 Theme/css/theme.css' },
            ]
          }
        ]
      },
      { 
        id: '2', 
        name: 'Remote Legacy Theme', 
        size: '28.7 MB', 
        lastModified: 'January 15, 2026', 
        imported: false, 
        importing: false,
        expanded: false,
        children: [
          {
            id: 'tf2-1',
            name: 'modules',
            type: 'folder',
            path: '/Remote Legacy Theme/modules',
            children: []
          },
          {
            id: 'tf2-2',
            name: 'templates',
            type: 'folder',
            path: '/Remote Legacy Theme/templates',
            children: []
          }
        ]
      },
    ];
    
    setThemeFolders(mockThemeFolders);
    setFetchingThemeFolders(false);
    setThemeFoldersFetched(true);
    toast.success('Theme folders fetched successfully');
  };

  const toggleThemeFolderExpansion = (folderId: string, itemId?: string) => {
    setThemeFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        if (!itemId) {
          return { ...folder, expanded: !folder.expanded };
        }
        return { ...folder, children: toggleItemExpansionInTheme(folder.children || [], itemId) };
      }
      return folder;
    }));
  };

  const toggleItemExpansionInTheme = (items: FolderItem[], itemId: string): FolderItem[] => {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, expanded: !item.expanded };
      }
      if (item.children) {
        return { ...item, children: toggleItemExpansionInTheme(item.children, itemId) };
      }
      return item;
    });
  };

  const handleFileClick = (item: FolderItem) => {
    const fileWithContent = {
      ...item,
      content: getMockFileContent(item.name)
    };
    setSelectedFile(fileWithContent);
    setFileModalOpen(true);
  };

  const handleImportThemeFolder = async (id: string) => {
    setThemeFolders(prev => prev.map(folder => 
      folder.id === id ? { ...folder, importing: true } : folder
    ));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setThemeFolders(prev => prev.map(folder => 
      folder.id === id ? { ...folder, importing: false, imported: true } : folder
    ));
    
    const folderName = themeFolders.find(f => f.id === id)?.name;
    toast.success(`${folderName} imported successfully`);
  };

  const handleImportAllThemes = async () => {
    const foldersToImport = themeFolders.filter(f => !f.imported && !f.importing);
    
    if (foldersToImport.length === 0) return;
    
    // Set all non-imported folders to importing state
    setThemeFolders(prev => prev.map(folder => 
      !folder.imported ? { ...folder, importing: true } : folder
    ));
    
    // Simulate importing all folders (in a real app, these would be parallel API calls)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mark all folders as imported
    setThemeFolders(prev => prev.map(folder => 
      folder.importing ? { ...folder, importing: false, imported: true } : folder
    ));
    
    toast.success(`All ${foldersToImport.length} theme folder(s) imported successfully`);
  };

  // Step 3: Upload Theme Folders
  const handleUploadFolders = async () => {
    setIsUploading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock uploaded folder structure
    const mockUploadedFolders: UploadedFolder[] = [
      {
        id: 'upload-1',
        name: 'Remote 2025 Theme',
        size: 47349760,
        expanded: true,
        children: [
          {
            id: 'f1',
            name: 'modules',
            type: 'folder',
            path: '/Remote 2025 Theme/modules',
            expanded: false,
            children: [
              { id: 'f1-1', name: 'Remote - Page Setting.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Page Setting.module' },
              { id: 'f1-2', name: 'Remote - Page Schema.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Page Schema.module' },
              { id: 'f1-3', name: 'Remote - Hero - Expanded.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Hero - Expanded.module' },
              { id: 'f1-4', name: 'Remote - Side Navigation.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Side Navigation.module' },
              { id: 'f1-5', name: 'Remote - Banner.module', type: 'file', path: '/Remote 2025 Theme/modules/Remote - Banner.module' },
            ]
          },
          {
            id: 'f2',
            name: 'templates',
            type: 'folder',
            path: '/Remote 2025 Theme/templates',
            expanded: false,
            children: [
              { id: 'f2-1', name: 'CE - Products.html', type: 'file', path: '/Remote 2025 Theme/templates/CE - Products.html' },
              { id: 'f2-2', name: 'CE - Benefits Detail.html', type: 'file', path: '/Remote 2025 Theme/templates/CE - Benefits Detail.html' },
              { id: 'f2-3', name: 'CE - Grow your team.html', type: 'file', path: '/Remote 2025 Theme/templates/CE - Grow your team.html' },
            ]
          },
          {
            id: 'f3',
            name: 'css',
            type: 'folder',
            path: '/Remote 2025 Theme/css',
            expanded: false,
            children: [
              { id: 'f3-1', name: 'main.css', type: 'file', path: '/Remote 2025 Theme/css/main.css' },
              { id: 'f3-2', name: 'theme.css', type: 'file', path: '/Remote 2025 Theme/css/theme.css' },
            ]
          },
          {
            id: 'f4',
            name: 'js',
            type: 'folder',
            path: '/Remote 2025 Theme/js',
            expanded: false,
            children: [
              { id: 'f4-1', name: 'main.js', type: 'file', path: '/Remote 2025 Theme/js/main.js' },
            ]
          },
          {
            id: 'f5',
            name: 'fields.json',
            type: 'file',
            path: '/Remote 2025 Theme/fields.json'
          },
          {
            id: 'f6',
            name: 'theme.json',
            type: 'file',
            path: '/Remote 2025 Theme/theme.json'
          }
        ]
      },
      {
        id: 'upload-2',
        name: 'Remote Legacy Theme',
        size: 30097152,
        expanded: false,
        children: [
          {
            id: 'f7',
            name: 'modules',
            type: 'folder',
            path: '/Remote Legacy Theme/modules',
            children: []
          },
          {
            id: 'f8',
            name: 'templates',
            type: 'folder',
            path: '/Remote Legacy Theme/templates',
            children: []
          }
        ]
      }
    ];
    
    setUploadedFolders(mockUploadedFolders);
    setIsUploading(false);
    toast.success('Theme folders uploaded successfully');
  };

  const toggleFolderExpansion = (folderId: string, itemId: string) => {
    setUploadedFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        if (folder.id === itemId) {
          return { ...folder, expanded: !folder.expanded };
        }
        return { ...folder, children: toggleItemExpansion(folder.children, itemId) };
      }
      return folder;
    }));
  };

  const toggleItemExpansion = (items: FolderItem[], itemId: string): FolderItem[] => {
    return items.map(item => {
      if (item.id === itemId) {
        return { ...item, expanded: !item.expanded };
      }
      if (item.children) {
        return { ...item, children: toggleItemExpansion(item.children, itemId) };
      }
      return item;
    });
  };

  const renderFolderTree = (items: FolderItem[], folderId: string, depth: number = 0, onItemClick?: (item: FolderItem) => void): JSX.Element[] => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const Icon = item.type === 'file' ? FileText : FolderTree;
      
      return (
        <div key={item.id}>
          <div
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer group"
            style={{ marginLeft: `${depth * 20}px` }}
            onClick={() => {
              if (hasChildren) {
                toggleFolderExpansion(folderId, item.id);
              } else if (item.type === 'file' && onItemClick) {
                onItemClick(item);
              }
            }}
          >
            {hasChildren ? (
              item.expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500 shrink-0" />
              )
            ) : (
              <div className="w-4 shrink-0" />
            )}
            
            <Icon className={`h-4 w-4 shrink-0 ${item.type === 'file' ? 'text-gray-400' : 'text-blue-600'}`} />
            
            <span className={`text-sm ${item.type === 'file' ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
              {item.name}
            </span>
            
            {hasChildren && item.children && (
              <span className="text-xs text-gray-500">({item.children.length} items)</span>
            )}
          </div>
          
          {item.expanded && item.children && renderFolderTree(item.children, folderId, depth + 1, onItemClick)}
        </div>
      );
    });
  };

  const renderThemeFolderTree = (items: FolderItem[], folderId: string, depth: number = 0): JSX.Element[] => {
    return items.map(item => {
      const hasChildren = item.children && item.children.length > 0;
      const Icon = item.type === 'file' ? FileText : FolderTree;
      
      return (
        <div key={item.id}>
          <div
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer group"
            style={{ marginLeft: `${depth * 20}px` }}
            onClick={() => {
              if (hasChildren) {
                toggleThemeFolderExpansion(folderId, item.id);
              } else if (item.type === 'file') {
                handleFileClick(item);
              }
            }}
          >
            {hasChildren ? (
              item.expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500 shrink-0" />
              )
            ) : (
              <div className="w-4 shrink-0" />
            )}
            
            <Icon className={`h-4 w-4 shrink-0 ${item.type === 'file' ? 'text-gray-400' : 'text-blue-600'}`} />
            
            <span className={`text-sm ${item.type === 'file' ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
              {item.name}
            </span>
            
            {hasChildren && item.children && (
              <span className="text-xs text-gray-500">({item.children.length} items)</span>
            )}
          </div>
          
          {item.expanded && item.children && renderThemeFolderTree(item.children, folderId, depth + 1)}
        </div>
      );
    });
  };

  // Step 3: Enrich Data
  const handleStartEnrichment = async () => {
    setEnrichmentStarted(true);
    setEnrichmentProgress(0);
    
    const tasks: EnrichmentTask[] = [
      { id: '1', label: 'Analyzing module usage in Site Pages', status: 'pending', count: 0, total: 2806 },
      { id: '2', label: 'Analyzing module usage in Landing Pages', status: 'pending', count: 0, total: 342 },
      { id: '3', label: 'Analyzing module usage in Blog Posts', status: 'pending', count: 0, total: 1492 },
      { id: '4', label: 'Analyzing template associations', status: 'pending', count: 0, total: 456 },
      { id: '5', label: 'Building property usage matrix', status: 'pending' },
      { id: '6', label: 'Calculating final statistics', status: 'pending' },
    ];
    setEnrichmentTasks(tasks);

    for (let i = 0; i < tasks.length; i++) {
      setEnrichmentTasks(prev => prev.map((t, idx) => 
        idx === i ? { ...t, status: 'in-progress' } : t
      ));

      if (tasks[i].total) {
        const total = tasks[i].total!;
        for (let count = 0; count <= total; count += Math.floor(total / 15)) {
          await new Promise(resolve => setTimeout(resolve, 150));
          setEnrichmentTasks(prev => prev.map((t, idx) => 
            idx === i ? { ...t, count } : t
          ));
          setEnrichmentProgress(((i + count / total) / tasks.length) * 100);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      setEnrichmentTasks(prev => prev.map((t, idx) => 
        idx === i ? { ...t, status: 'complete', count: tasks[i].total || undefined } : t
      ));
      setEnrichmentProgress(((i + 1) / tasks.length) * 100);
    }

    setEnrichmentComplete(true);
    toast.success('Data enrichment complete');
  };

  // Auto-start enrichment when entering step 3
  useEffect(() => {
    if (currentStep === 3 && !enrichmentStarted) {
      handleStartEnrichment();
    }
  }, [currentStep, enrichmentStarted]);

  // Step 4: Enrich Language
  const handleStartLanguageScan = async () => {
    setLanguageStarted(true);
    setLanguageProgress(0);
    
    const langs: Language[] = [
      { id: '1', name: 'English (United States)', code: 'en-US', count: 2806, status: 'pending' },
      { id: '2', name: 'French (France)', code: 'fr-FR', count: 1492, status: 'pending' },
      { id: '3', name: 'German', code: 'de', count: 1105, status: 'pending' },
      { id: '4', name: 'Spanish', code: 'es', count: 892, status: 'pending' },
      { id: '5', name: 'Portuguese (Brazil)', code: 'pt-BR', count: 654, status: 'pending' },
      { id: '6', name: 'Japanese', code: 'ja', count: 423, status: 'pending' },
    ];
    setLanguages(langs);

    for (let i = 0; i < langs.length; i++) {
      setLanguages(prev => prev.map((l, idx) => 
        idx === i ? { ...l, status: 'in-progress' } : l
      ));
      
      await new Promise(resolve => setTimeout(resolve, 900));
      
      setLanguages(prev => prev.map((l, idx) => 
        idx === i ? { ...l, status: 'complete' } : l
      ));
      setLanguageProgress(((i + 1) / langs.length) * 100);
    }

    setLanguageComplete(true);
    toast.success('Language enrichment complete');
  };

  // Auto-start language scan when entering step 4
  useEffect(() => {
    if (currentStep === 4 && !languageStarted) {
      handleStartLanguageScan();
    }
  }, [currentStep, languageStarted]);

  const handleFinish = () => {
    toast.success('Scan setup completed successfully!');
    if (onFinish) {
      onFinish();
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const stepIndicators = [
    { step: 1, label: 'Fetch Content Types' },
    { step: 2, label: 'Theme Folders' },
    { step: 3, label: 'Enrich Data' },
    { step: 4, label: 'Enrich Language' },
  ];

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-h-screen">
      {/* Step Indicator */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {stepIndicators.map((indicator, index) => (
              <div key={indicator.step} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
                    currentStep > indicator.step 
                      ? 'bg-teal-600 text-white' 
                      : currentStep === indicator.step 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > indicator.step ? <Check className="h-4 w-4" /> : indicator.step}
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep === indicator.step ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {indicator.label}
                  </span>
                </div>
                {index < stepIndicators.length - 1 && (
                  <div className="h-px bg-gray-300 w-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
          {/* Step 1: Fetch Content Types */}
          {currentStep === 1 && (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">Fetch Content Types</h1>
                <p className="text-sm text-gray-600">Pull all content types from your HubSpot portal including site pages, landing pages, and blog posts.</p>
              </div>

              <Card className="p-8 bg-white border-gray-200">
                <div className="space-y-6">
                  {!fetchingContent && !fetchComplete && (
                    <div className="flex justify-center py-8">
                      <Button
                        onClick={handleFetchContentTypes}
                        className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-8 rounded-lg font-medium"
                      >
                        Fetch Content Types
                      </Button>
                    </div>
                  )}

                  {(fetchingContent || fetchComplete) && (
                    <div className="space-y-4">
                      {contentTypes.map(ct => (
                        <div key={ct.id} className="space-y-2">
                          <div className="flex items-center gap-3">
                            {ct.fetched ? (
                              <>
                                <button
                                  onClick={() => toggleContentTypeExpansion(ct.id)}
                                  className="flex items-center gap-2 flex-1 text-left"
                                >
                                  {ct.expanded ? (
                                    <ChevronDown className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-500" />
                                  )}
                                  <FolderTree className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-900">{ct.name}</span>
                                  <span className="text-xs text-gray-500">({ct.count.toLocaleString()} items)</span>
                                </button>
                              </>
                            ) : ct.fetching ? (
                              <>
                                <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
                                <span className="text-sm text-gray-700">{ct.name} — fetching...</span>
                              </>
                            ) : null}
                          </div>
                          
                          {ct.expanded && ct.children && ct.children.length > 0 && (
                            <div className="ml-8 space-y-1 border-l-2 border-gray-200 pl-4">
                              {ct.children.slice(0, 5).map(item => (
                                <div key={item.id} className="flex items-center gap-2 py-1">
                                  <FileText className="h-3.5 w-3.5 text-gray-400" />
                                  <span className="text-sm text-gray-700">{item.name}</span>
                                  <span className="text-xs text-gray-400">•</span>
                                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate">
                                    {item.url}
                                  </a>
                                </div>
                              ))}
                              {ct.children.length > 5 && (
                                <p className="text-xs text-gray-500 italic py-1">
                                  + {ct.children.length - 5} more items...
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {fetchComplete && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{contentTypes.reduce((sum, ct) => sum + ct.count, 0).toLocaleString()}</span> total items fetched across <span className="font-semibold text-gray-900">{contentTypes.length}</span> content types
                      </p>
                    </div>
                  )}
                </div>

                {fetchComplete && (
                  <div className="flex items-center justify-end pt-6 mt-6 border-t border-gray-200">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-6 rounded-lg font-medium gap-2"
                    >
                      Next: Theme Folders
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Card>
            </>
          )}

          {/* Step 2: Theme Folders (Merged Fetch + Upload) */}
          {currentStep === 2 && (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">Theme Folders</h1>
                <p className="text-sm text-gray-600">Retrieve and import theme folders from your HubSpot portal into Smuves.</p>
              </div>

              <Card className="p-8 bg-white border-gray-200">
                <div className="space-y-6">
                  {/* Fetch Section */}
                  {!fetchingThemeFolders && !themeFoldersFetched && (
                    <div className="flex justify-center py-8">
                      <Button
                        onClick={handleFetchThemeFolders}
                        className="bg-teal-600 hover:bg-teal-700 text-white h-11 px-8 rounded-lg font-medium"
                      >
                        Fetch Theme Folders
                      </Button>
                    </div>
                  )}

                  {fetchingThemeFolders && (
                    <div className="flex items-center justify-center gap-3 py-8">
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                      <span className="text-sm text-gray-700">Fetching theme folders...</span>
                    </div>
                  )}

                  {themeFoldersFetched && (
                    <div className="space-y-4">
                      {/* Import All Button */}
                      <div className="flex items-center justify-between pb-2">
                        <p className="text-sm text-gray-600">
                          {themeFolders.filter(f => f.imported).length} of {themeFolders.length} theme(s) imported
                        </p>
                        <Button
                          onClick={handleImportAllThemes}
                          disabled={themeFolders.every(f => f.imported) || themeFolders.some(f => f.importing)}
                          className="bg-teal-600 hover:bg-teal-700 text-white h-9 px-4 rounded-lg font-medium gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {themeFolders.some(f => f.importing) ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Importing All...
                            </>
                          ) : (
                            <>
                              <Inbox className="h-4 w-4" />
                              Import All
                            </>
                          )}
                        </Button>
                      </div>

                      {themeFolders.map(folder => (
                        <div key={folder.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="flex items-center gap-3 bg-gray-50 px-4 py-3">
                            <button
                              onClick={() => toggleThemeFolderExpansion(folder.id)}
                              className="flex items-center gap-2 flex-1"
                            >
                              {folder.expanded ? (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-500" />
                              )}
                              <FolderTree className="h-5 w-5 text-blue-600" />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                                <p className="text-xs text-gray-500">{folder.size} · Modified {folder.lastModified}</p>
                              </div>
                            </button>
                            <Button
                              onClick={() => handleImportThemeFolder(folder.id)}
                              disabled={folder.imported || folder.importing}
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs gap-2 shrink-0"
                            >
                              {folder.imported ? (
                                <>
                                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                  <span className="text-green-600">Imported</span>
                                </>
                              ) : folder.importing ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  Importing to Smuves...
                                </>
                              ) : (
                                <>
                                  <Inbox className="h-3.5 w-3.5" />
                                  Import
                                </>
                              )}
                            </Button>
                          </div>
                          
                          {folder.expanded && folder.children && (
                            <div className="p-4 bg-white max-h-96 overflow-y-auto">
                              {renderThemeFolderTree(folder.children, folder.id)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="h-10 px-4 rounded-lg font-medium gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  
                  {themeFolders.some(folder => folder.imported) && (
                    <Button
                      onClick={() => setCurrentStep(3)}
                      className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-6 rounded-lg font-medium gap-2"
                    >
                      Next: Enrich Data
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </>
          )}

          {/* Step 3: Enrich Data */}
          {currentStep === 3 && (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">Enrich Data</h1>
                <p className="text-sm text-gray-600">Analyzing module usage across all content types and building comprehensive audit data.</p>
              </div>

              <Card className="p-8 bg-white border-gray-200">
                <div className="space-y-6">
                  {enrichmentStarted && (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Processing... {Math.round(enrichmentProgress)}%
                          </span>
                        </div>
                        <Progress value={enrichmentProgress} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        {enrichmentTasks.map(task => (
                          <div key={task.id} className="flex items-center gap-3 text-sm">
                            {task.status === 'complete' ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                                <span className="text-gray-700">
                                  {task.label}
                                  {task.count && ` — ${task.count.toLocaleString()} processed`}
                                </span>
                              </>
                            ) : task.status === 'in-progress' ? (
                              <>
                                <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
                                <span className="text-gray-700">
                                  {task.label}
                                  {task.count && task.total && ` — ${task.count.toLocaleString()} / ${task.total.toLocaleString()}`}
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300 shrink-0" />
                                <span className="text-gray-500">{task.label}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {enrichmentComplete && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Data enrichment completed successfully</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="h-10 px-4 rounded-lg font-medium gap-2"
                    disabled={enrichmentStarted && !enrichmentComplete}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  
                  {enrichmentComplete && (
                    <Button
                      onClick={() => setCurrentStep(4)}
                      className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-6 rounded-lg font-medium gap-2"
                    >
                      Next: Enrich Language
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </>
          )}

          {/* Step 4: Enrich Language */}
          {currentStep === 4 && (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">Enrich Language</h1>
                <p className="text-sm text-gray-600">Identifying and counting language variants across all content in your portal.</p>
              </div>

              <Card className="p-8 bg-white border-gray-200">
                <div className="space-y-6">
                  {languageStarted && (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Scanning languages... {Math.round(languageProgress)}%
                          </span>
                        </div>
                        <Progress value={languageProgress} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        {languages.map(language => (
                          <div key={language.id} className="flex items-center gap-3 text-sm">
                            {language.status === 'complete' ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                                <span className="text-gray-900 font-medium flex-1">{language.name}</span>
                                <Badge variant="outline" className="text-gray-600 font-mono text-xs">{language.code}</Badge>
                                <span className="text-gray-700 font-semibold">{language.count.toLocaleString()} pages</span>
                              </>
                            ) : language.status === 'in-progress' ? (
                              <>
                                <Loader2 className="h-5 w-5 text-blue-600 animate-spin shrink-0" />
                                <span className="text-gray-700">{language.name} — scanning...</span>
                              </>
                            ) : (
                              <>
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300 shrink-0" />
                                <span className="text-gray-500">{language.name}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {languageComplete && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Language enrichment completed — {languages.length} languages detected</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                  <Button
                    onClick={() => setCurrentStep(3)}
                    variant="outline"
                    className="h-10 px-4 rounded-lg font-medium gap-2"
                    disabled={languageStarted && !languageComplete}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  
                  {languageComplete && (
                    <Button
                      onClick={handleFinish}
                      className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-6 rounded-lg font-medium gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Finish & View Reports
                    </Button>
                  )}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* File Content Modal */}
      <Dialog open={fileModalOpen} onOpenChange={setFileModalOpen}>
        <DialogContent className="!w-[90vw] !h-[90vh] !max-w-[90vw] !max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              {selectedFile?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex-1 overflow-y-auto">
            <pre className="bg-gray-50 p-6 rounded-lg text-xs font-mono overflow-x-auto text-gray-900 leading-relaxed">
              {selectedFile?.content}
            </pre>
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t">
            <Button onClick={() => setFileModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
