import { useState, useEffect } from 'react';
import { Search, Replace, AlertTriangle, ChevronLeft, HelpCircle, Loader2, CheckCircle2, XCircle, Download, Info } from 'lucide-react';
import { formatTableDateTime } from '../utils/dateFormat';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { FindResultsModal } from './FindResultsModal';

interface FindAndReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onConfirm: (findText: string, replaceText: string, selectedColumn: string, useRegex: boolean, matchCase: boolean) => void;
  tableHeaders: string[];
  selectedData: any[];
  currentConfig: any;
}

interface FindResult {
  id: string;
  itemName: string;
  column: string;
  matchContext: string;
  fullContext: string;
}

interface ReplaceResult {
  id: string;
  itemName: string;
  column: string;
  previousValue: string;
  newValue: string;
  changeCount: number;
}

interface Change {
  id: string;
  previousValue: string;
  newValue: string;
}

interface GroupedReplaceResult {
  groupId: string;
  columnId: string;
  itemName: string;
  column: string;
  changes: Change[];
}

export function FindAndReplaceModal({ isOpen, onClose, selectedCount, onConfirm, tableHeaders, selectedData, currentConfig }: FindAndReplaceModalProps) {
  const [activeTab, setActiveTab] = useState<'find' | 'replace'>('find');
  const [currentStep, setCurrentStep] = useState<'input' | 'preview' | 'applied-changes' | 'confirm'>('input');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [searchEmptyCells, setSearchEmptyCells] = useState(false);
  const [findResults, setFindResults] = useState<FindResult[]>([]);
  const [replaceResults, setReplaceResults] = useState<ReplaceResult[]>([]);
  const [groupedReplaceResults, setGroupedReplaceResults] = useState<GroupedReplaceResult[]>([]);
  const [finalConfirmationChecked, setFinalConfirmationChecked] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [appliedRecords, setAppliedRecords] = useState<Set<string>>(new Set());
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [appliedGroups, setAppliedGroups] = useState<Set<string>>(new Set());
  const [showProgress, setShowProgress] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [currentProgressText, setCurrentProgressText] = useState('');
  const [resultsData, setResultsData] = useState<{
    successful: number;
    failed: number;
    totalProcessed: number;
    duration: number;
  } | null>(null);
  const [showFindResultsModal, setShowFindResultsModal] = useState(false);
  
  // Layout-specific states
  const [isLayoutColumn, setIsLayoutColumn] = useState(false);
  const [layoutFields, setLayoutFields] = useState<string[]>([]);
  const [selectedLayoutFields, setSelectedLayoutFields] = useState<Set<string>>(new Set());
  
  // Define read-only fields
  const readOnlyLayoutFields = new Set(['Page URL', 'Meta Title']);

  // Parse layout widgets to extract fields
  const parseLayoutFields = (layoutData: string): string[] => {
    // Mock implementation - in real app, this would parse HubSpot widgets
    // Example widget fields that might be in a layout
    const commonFields = [
      'Heading Text',
      'Page URL', // Read-only field at position 2
      'Body Content',
      'Button Text',
      'Meta Title', // Read-only field at position 5
      'Button URL',
      'Image Alt Text',
      'Image Caption',
      'Rich Text Content',
      'Custom HTML',
      'Meta Description',
      'Call to Action Text'
    ];
    
    return commonFields;
  };

  // Effect to detect when Layout column is selected and parse fields
  useEffect(() => {
    if (selectedColumn.toLowerCase() === 'layout') {
      setIsLayoutColumn(true);
      // In real implementation, this would parse actual layout data from selectedData
      const fields = parseLayoutFields('');
      setLayoutFields(fields);
      // Start with no fields selected in both tabs
      setSelectedLayoutFields(new Set());
    } else {
      setIsLayoutColumn(false);
      setLayoutFields([]);
      setSelectedLayoutFields(new Set());
    }
  }, [selectedColumn]);

  // Stable column ID generator - generates same ID for same item name
  const generateColumnId = (itemName: string): string => {
    let hash = 0;
    for (let i = 0; i < itemName.length; i++) {
      const char = itemName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 9000 + 1000).toString();
  };

  // Mock data for find results
  const generateFindResults = (): FindResult[] => {
    if (!findText.trim()) return [];
    
    const mockItems = [
      'Home Page - Welcome to Our Platform',
      'About Us - Company History and Mission',
      'Services - Digital Marketing Solutions',
      'Blog Post: SEO Best Practices for 2024',
      'Landing Page: Free Trial Signup',
      'Contact Us - Get in Touch Today',
      'Product Features - Advanced Analytics',
      'Pricing Plans - Choose Your Package',
      'Customer Testimonials - Success Stories',
      'FAQ - Frequently Asked Questions',
      'Privacy Policy - Data Protection',
      'Terms of Service - User Agreement',
      'Product Documentation - Getting Started Guide',
      'API Reference - Developer Resources',
      'Blog Post: Content Marketing Strategies',
      'Case Study: Enterprise Implementation',
      'Webinar Landing Page - Register Today',
      'Resource Center - Download Templates',
      'Support Center - Common Issues',
      'Integration Guide - Third Party Tools',
      'Security Overview - Data Protection',
      'Performance Metrics - Analytics Dashboard',
      'User Guide - Best Practices',
      'Changelog - Latest Updates',
      'Community Forum - Discussion Topics',
      'Video Tutorials - Step by Step',
      'White Paper - Industry Insights',
      'Press Release - Company News',
      'Partner Program - Join Our Network',
      'Training Materials - Certification Course',
      'Mobile App Features - iOS and Android',
      'Desktop Application - Windows and Mac',
      'Cloud Services - Scalable Solutions',
      'Enterprise Features - Advanced Tools',
      'Startup Package - Budget-Friendly Options',
      'Professional Services - Consulting',
      'Customer Success Stories - Real Results',
      'Industry Solutions - Vertical Markets',
      'Compliance Documentation - Standards',
      'Backup and Recovery - Data Safety'
    ];

    const contexts = [
      `Welcome to our platform where ${findText} makes everything better`,
      `Our company believes that ${findText} is the key to success`,
      `Digital marketing with ${findText} delivers amazing results`,
      `SEO strategies using ${findText} will boost your rankings`,
      `Sign up now and experience ${findText} for yourself`,
      `Contact our team to learn more about ${findText}`,
      `Advanced analytics powered by ${findText} technology`,
      `Choose the perfect ${findText} package for your needs`,
      `Customer success stories featuring ${findText} implementation`,
      `Frequently asked questions about ${findText} usage`,
      `Comprehensive documentation about ${findText} features`,
      `API integration with ${findText} capabilities`,
      `Content marketing strategies using ${findText}`,
      `Enterprise-level ${findText} implementation guide`,
       `Register for our webinar about ${findText}`,
      `Download templates and resources for ${findText}`,
      `Common support issues related to ${findText}`,
      `Third-party integration with ${findText} platform`,
      `Security measures protecting your ${findText} data`,
      `Performance analytics showing ${findText} impact`,
      `Best practices for using ${findText} effectively`,
      `Latest updates and improvements to ${findText}`,
      `Community discussions about ${findText} usage`,
      `Video tutorials explaining ${findText} features`,
      `Industry insights and ${findText} trends`,
      `Press coverage of ${findText} announcements`,
      `Partner opportunities with ${findText} program`,
      `Training certification for ${findText} expertise`,
      `Mobile applications featuring ${findText}`,
      `Desktop software with ${findText} integration`
    ];

    return Array.from({ length: 50 }, (_, i) => ({
      id: `find-${i + 1}`,
      itemName: mockItems[i % mockItems.length],
      column: selectedColumn,
      matchContext: contexts[i % contexts.length],
      fullContext: `This is the full context where "${findText}" appears in the content. ${contexts[i % contexts.length]} and continues with more relevant information about implementation and usage.`
    }));
  };

  // Mock data for replace results (keeping original)
  const generateReplaceResults = (): ReplaceResult[] => {
    if (!findText.trim() || !replaceText.trim()) return [];
    
    const mockItems = [
      'Home Page - Welcome to Our Platform',
      'About Us - Company History and Mission',
      'Services - Digital Marketing Solutions',
      'Blog Post: SEO Best Practices for 2024',
      'Landing Page - Free Trial Signup',
      'Contact Us - Get in Touch Today',
      'Product Features - Advanced Analytics',
      'Pricing Plans - Choose Your Package',
      'Customer Testimonials - Success Stories',
      'FAQ - Frequently Asked Questions',
      'Privacy Policy - Data Protection',
      'Terms of Service - User Agreement',
      'Product Documentation - Getting Started',
      'API Reference - Developer Resources',
      'Blog Post: Content Marketing Strategies',
      'Case Study: Enterprise Implementation',
      'Webinar Landing Page - Register Today',
      'Resource Center - Download Templates',
      'Support Center - Common Issues',
      'Integration Guide - Third Party Tools',
      'Security Overview - Data Protection',
      'Performance Metrics - Analytics Dashboard',
      'User Guide - Best Practices',
      'Changelog - Latest Updates',
      'Community Forum - Discussion Topics',
      'Video Tutorials - Step by Step',
      'White Paper - Industry Insights',
      'Press Release - Company News',
      'Partner Program - Join Our Network',
      'Training Materials - Certification Course'
    ];

    const previousValues = [
      `Welcome to our platform where ${findText} makes everything better`,
      `Our company believes that ${findText} is the key to success`,
      `Digital marketing with ${findText} delivers amazing results`,
      `SEO strategies using ${findText} will boost your rankings`,
      `Sign up now and experience ${findText} for yourself`,
      `Contact our team to learn more about ${findText}`,
      `Advanced analytics powered by ${findText} technology`,
      `Choose the perfect ${findText} package for your needs`,
      `Customer success stories featuring ${findText} implementation`,
      `Frequently asked questions about ${findText} usage`
    ];

    return Array.from({ length: 35 }, (_, i) => ({
      id: `replace-${i + 1}`,
      itemName: mockItems[i % mockItems.length],
      column: selectedColumn,
      previousValue: previousValues[i % previousValues.length],
      newValue: previousValues[i % previousValues.length].replace(new RegExp(findText, 'g'), replaceText),
      changeCount: Math.floor(Math.random() * 3) + 1
    }));
  };

  // Mock data for grouped replace results
  const generateGroupedReplaceResults = (): GroupedReplaceResult[] => {
    if (!findText.trim() || !replaceText.trim()) return [];
    
    const mockItems = [
      'Home Page - Welcome to Our Platform',
      'About Us - Company History and Mission',
      'Services - Digital Marketing Solutions',
      'Blog Post: SEO Best Practices for 2024'
    ];

    const previousValueSets = [
      [
        `Welcome to our platform where ${findText} makes everything better`,
        `Our ${findText} solution provides amazing results`,
        `Experience the power of ${findText} technology`,
        `Join thousands who trust ${findText} daily`
      ],
      [
        `Our company believes that ${findText} is the key to success`,
        `Learn more about ${findText} implementation`,
        `Discover how ${findText} can transform your business`,
        `Contact us to discuss ${findText} opportunities`
      ],
      [
        `Digital marketing with ${findText} delivers amazing results`,
        `SEO strategies using ${findText} will boost your rankings`,
        `Content marketing powered by ${findText}`,
        `Social media campaigns featuring ${findText}`
      ],
      [
        `SEO best practices include ${findText} optimization`,
        `Modern ${findText} techniques for better rankings`,
        `Advanced ${findText} strategies for 2024`,
        `Essential ${findText} tips for success`
      ]
    ];

    return mockItems.map((itemName, index) => ({
      groupId: `group-${index + 1}`,
      columnId: generateColumnId(itemName),
      itemName,
      column: selectedColumn,
      changes: previousValueSets[index].map((prevValue, changeIndex) => ({
        id: `change-${index}-${changeIndex}`,
        previousValue: prevValue,
        newValue: prevValue.replace(new RegExp(findText, 'g'), replaceText)
      }))
    }));
  };

  const handleFind = () => {
    if (!findText.trim() || !selectedColumn) return;
    const results = generateFindResults();
    setFindResults(results);
    setShowFindResultsModal(true);
  };

  const handlePreviewChanges = () => {
    if (!findText.trim() || !replaceText.trim() || !selectedColumn) return;
    const results = generateReplaceResults();
    setReplaceResults(results);
    setCurrentStep('preview');
  };

  const handleGoBack = () => {
    if (currentStep === 'preview') {
      setCurrentStep('input');
    } else if (currentStep === 'applied-changes') {
      setCurrentStep('preview');
    } else if (currentStep === 'confirm') {
      setCurrentStep('applied-changes');
    }
  };

  const handleProceedToConfirm = () => {
    setCurrentStep('confirm');
  };

  const resetModalState = () => {
    setActiveTab('find');
    setCurrentStep('input');
    setFindText('');
    setReplaceText('');
    setSelectedColumn('');
    setUseRegex(false);
    setMatchCase(false);
    setSearchEmptyCells(false);
    setFinalConfirmationChecked(false);
    setFindResults([]);
    setReplaceResults([]);
    setGroupedReplaceResults([]);
    setSelectedRecords(new Set());
    setAppliedRecords(new Set());
    setSelectedGroups(new Set());
    setAppliedGroups(new Set());
    setShowProgress(false);
    setShowResults(false);
    setProgressPercentage(0);
    setCurrentProgressText('');
    setResultsData(null);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  const handleFinalConfirm = () => {
    setShowProgress(true);
    setProgressPercentage(0);
    setCurrentProgressText('Initializing...');
    const startTime = Date.now();
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgressPercentage(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setCurrentProgressText('Changes applied successfully!');
          
          // Generate results data
          const duration = Date.now() - startTime;
          const totalProcessed = appliedRecords.size;
          const successful = totalProcessed; // 100% success rate
          const failed = 0; // No failures
          
          setResultsData({
            successful,
            failed,
            totalProcessed,
            duration
          });
          
          setTimeout(() => {
            setShowProgress(false);
            setShowResults(true);
          }, 1000);
          return 100;
        }
        
        if (newProgress < 30) {
          setCurrentProgressText('Processing selected records...');
        } else if (newProgress < 60) {
          setCurrentProgressText('Applying text replacements...');
        } else if (newProgress < 90) {
          setCurrentProgressText('Validating changes...');
        } else {
          setCurrentProgressText('Finalizing updates...');
        }
        
        return newProgress;
      });
    }, 200);
  };

  const handleSelectRecord = (recordId: string) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId);
    } else {
      newSelected.add(recordId);
    }
    setSelectedRecords(newSelected);
  };

  const handleSelectAllRecords = () => {
    const availableRecords = replaceResults.filter(r => !appliedRecords.has(r.id));
    if (selectedRecords.size === availableRecords.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(availableRecords.map(r => r.id)));
    }
  };

  const handleSelectGroup = (groupId: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedGroups(newSelected);
  };

  const handleSelectAllGroups = () => {
    const availableGroups = groupedReplaceResults.filter(g => !appliedGroups.has(g.groupId));
    if (selectedGroups.size === availableGroups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(availableGroups.map(g => g.groupId)));
    }
  };

  const handleApplyChanges = () => {
    const newApplied = new Set([...appliedRecords, ...selectedRecords]);
    setAppliedRecords(newApplied);
    setSelectedRecords(new Set());
    setCurrentStep('applied-changes');
  };

  const handleProceedToConfirmation = () => {
    if (currentStep === 'applied-changes') {
      setCurrentStep('confirm');
    } else {
      setShowProgress(true);
      setProgressPercentage(0);
      setCurrentProgressText('Initializing...');
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgressPercentage(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setCurrentProgressText('Completing changes...');
            setTimeout(() => {
              setShowProgress(false);
              setShowResults(true);
            }, 1000);
            return 100;
          }
          
          if (newProgress < 30) {
            setCurrentProgressText('Processing selected records...');
          } else if (newProgress < 60) {
            setCurrentProgressText('Applying text replacements...');
          } else if (newProgress < 90) {
            setCurrentProgressText('Validating changes...');
          } else {
            setCurrentProgressText('Finalizing updates...');
          }
          
          return newProgress;
        });
      }, 200);
    }
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : part
    );
  };

  const highlightReplacementText = (text: string, replacementTerm: string) => {
    if (!replacementTerm.trim()) return text;
    
    const parts = text.split(new RegExp(`(${replacementTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === replacementTerm.toLowerCase() ? (
        <mark key={index} className="bg-green-200 px-1 rounded">{part}</mark>
      ) : part
    );
  };

  const getTotalMatches = () => {
    return findResults.length > 0 ? findResults.length * 2 + Math.floor(Math.random() * 10) : 0;
  };

  const getTotalReplacements = () => {
    return replaceResults.reduce((sum, result) => sum + result.changeCount, 0);
  };

  // Progress screen when showProgress is true
  if (showProgress) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="!max-w-6xl !max-h-[90vh] !w-[95vw] !h-[90vh] !overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                <div>
                  <h2 className="text-xl font-semibold">Applying Changes</h2>
                  <p className="text-sm text-gray-600">
                    Processing find and replace operation...
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Content */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center">
              <div className="w-full max-w-2xl space-y-8">
                {/* Main Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                {/* Current Stage */}
                <div className="text-center space-y-2">
                  <div className="text-lg font-medium text-gray-900">
                    {currentProgressText}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>

                {/* Processing Stats */}
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-blue-600">
                      {appliedRecords.size}
                    </div>
                    <div className="text-sm text-gray-600">Records to Process</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-purple-600">
                      {getTotalReplacements()}
                    </div>
                    <div className="text-sm text-gray-600">Total Replacements</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-600 text-center">
                <p>Please wait while we process your changes...</p>
                <p className="mt-1">This process cannot be cancelled once started.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Results screen when showResults is true
  if (showResults && resultsData) {
    const successRate = 100; // Always 100% success
    const formatDuration = (ms: number) => {
      if (ms < 1000) return `${ms}ms`;
      if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
      return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
    };

    const handleFinishAndClose = () => {
      onConfirm(findText, replaceText, selectedColumn, useRegex, matchCase);
      resetModalState();
      onClose();
    };

    const handleExportResults = () => {
      const data = {
        operation: 'Find & Replace',
        timestamp: new Date().toISOString(),
        query: {
          findText,
          replaceText,
          selectedColumn,
          useRegex,
          matchCase
        },
        results: {
          totalProcessed: resultsData.totalProcessed,
          successful: resultsData.successful,
          failed: resultsData.failed,
          successRate: successRate.toFixed(2) + '%',
          duration: formatDuration(resultsData.duration)
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `find-replace-results-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="!max-w-6xl !max-h-[90vh] !w-[95vw] !h-[90vh] !overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Find & Replace Complete
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Processed {resultsData.totalProcessed} records in {formatDuration(resultsData.duration)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {resultsData.totalProcessed}
                  </div>
                  <div className="text-sm text-blue-800">Total Processed</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {resultsData.successful}
                  </div>
                  <div className="text-sm text-green-800">Successful</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    0
                  </div>
                  <div className="text-sm text-green-800">Failed</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {getTotalReplacements()}
                  </div>
                  <div className="text-sm text-purple-800">Replacements Made</div>
                </div>
              </div>

              {/* Operation Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Operation Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Find Text:</span>
                    <span className="font-medium max-w-xs truncate">&quot;{findText}&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Replace With:</span>
                    <span className="font-medium max-w-xs truncate">&quot;{replaceText}&quot;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Column:</span>
                    <span className="font-medium">{selectedColumn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{formatDuration(resultsData.duration)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Match Case:</span>
                    <span className="font-medium">{matchCase ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">All changes applied successfully!</div>
                    <div className="text-sm text-green-700">Your find and replace operation completed without any errors.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleExportResults} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Results
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleFinishAndClose}>
                    Finish & Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const renderFindTab = () => (
    <div className="flex flex-col h-full">
      <div className="space-y-4 flex-shrink-0">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Find
          </label>
          <Input
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Enter text to find..."
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            In
          </label>
          <Select value={selectedColumn} onValueChange={setSelectedColumn}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select column to search in" />
            </SelectTrigger>
            <SelectContent>
              {tableHeaders.map((header) => (
                <SelectItem key={header} value={header}>
                  {header === 'Layout' ? 'Layout Section' : header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Layout Field Selector - Only show for Layout column */}
        {isLayoutColumn && layoutFields.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-blue-900 mb-1">Layout Section - Widget Fields Detected</p>
                <p className="text-sm text-blue-800">
                  Select which widget fields to search in.
                </p>
              </div>
            </div>
            
            <div className="border-t border-blue-200 my-3"></div>
            
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              
              
              {layoutFields.map((field) => {
                const isReadOnly = readOnlyLayoutFields.has(field);
                return (
                  <div key={field} className="flex items-center gap-2">
                    <Checkbox
                      id={`layout-field-${field}`}
                      checked={selectedLayoutFields.has(field)}
                      disabled={isReadOnly}
                      onCheckedChange={(checked) => {
                        if (isReadOnly) return;
                        const newSelected = new Set(selectedLayoutFields);
                        if (checked) {
                          newSelected.add(field);
                        } else {
                          newSelected.delete(field);
                        }
                        setSelectedLayoutFields(newSelected);
                      }}
                    />
                    <label 
                      htmlFor={`layout-field-${field}`} 
                      className={`text-sm flex items-center gap-2 ${isReadOnly ? 'text-gray-500' : 'text-blue-900'}`}
                    >
                      {field}
                      {isReadOnly && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Read-Only
                        </span>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="find-matchCase"
              checked={matchCase}
              onCheckedChange={(checked) => setMatchCase(checked as boolean)}
            />
            <label htmlFor="find-matchCase" className="text-sm text-gray-700">
              Match Case
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Search is case-sensitive</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="find-searchEmptyCells"
              checked={searchEmptyCells}
              onCheckedChange={(checked) => setSearchEmptyCells(checked as boolean)}
            />
            <label htmlFor="find-searchEmptyCells" className="text-sm text-gray-700">
              Search Empty Cells
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 flex-shrink-0 mt-6">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          onClick={handleFind}
          disabled={!findText.trim() || !selectedColumn || (isLayoutColumn && selectedLayoutFields.size === 0)}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Find
        </Button>
      </div>
    </div>
  );

  const renderReplaceInputStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Find
            </label>
            <Input
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Enter text to find..."
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Replace With
            </label>
            <Input
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Enter replacement text..."
              className="w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            In
          </label>
          <Select value={selectedColumn} onValueChange={setSelectedColumn}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select column to search in" />
            </SelectTrigger>
            <SelectContent>
              {tableHeaders.map((header) => (
                <SelectItem key={header} value={header}>
                  {header === 'Layout' ? 'Layout Section' : header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Layout Field Selector - Only show for Layout column */}
        {isLayoutColumn && layoutFields.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-blue-900 mb-1">Layout Section - Widget Fields Detected</p>
                <p className="text-sm text-blue-800">
                  Select which widget fields to find and replace in.
                </p>
              </div>
            </div>
            
            <div className="border-t border-blue-200 my-3"></div>
            
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              
              {layoutFields.map((field) => {
                const isReadOnly = readOnlyLayoutFields.has(field);
                return (
                  <div key={field} className="flex items-center gap-2">
                    <Checkbox
                      id={`replace-layout-field-${field}`}
                      checked={selectedLayoutFields.has(field)}
                      disabled={isReadOnly}
                      onCheckedChange={(checked) => {
                        if (isReadOnly) return;
                        const newSelected = new Set(selectedLayoutFields);
                        if (checked) {
                          newSelected.add(field);
                        } else {
                          newSelected.delete(field);
                        }
                        setSelectedLayoutFields(newSelected);
                      }}
                    />
                    <label 
                      htmlFor={`replace-layout-field-${field}`} 
                      className={`text-sm flex items-center gap-2 ${isReadOnly ? 'text-gray-500' : 'text-blue-900'}`}
                    >
                      {field}
                      {isReadOnly && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Read-Only
                        </span>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="replace-matchCase"
              checked={matchCase}
              onCheckedChange={(checked) => setMatchCase(checked as boolean)}
            />
            <label htmlFor="replace-matchCase" className="text-sm text-gray-700">
              Match Case
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Search is case-sensitive</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="replace-searchEmptyCells"
              checked={searchEmptyCells}
              onCheckedChange={(checked) => setSearchEmptyCells(checked as boolean)}
            />
            <label htmlFor="replace-searchEmptyCells" className="text-sm text-gray-700">
              Search Empty Cells
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          onClick={handlePreviewChanges}
          disabled={!findText.trim() || !replaceText.trim() || !selectedColumn || (isLayoutColumn && selectedLayoutFields.size === 0)}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Preview Changes
        </Button>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b bg-gray-50">
        <span className="text-sm font-medium">
          Total replacements: {getTotalReplacements()}
        </span>
        <div className="text-sm text-gray-600">
          {selectedRecords.size > 0 && `${selectedRecords.size} selected`}
          {appliedRecords.size > 0 && ` • ${appliedRecords.size} applied`}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto w-full">
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow>
                <TableHead className="sticky left-0 bg-gray-50 z-20 text-center w-12 px-4 py-3">
                  <Checkbox
                    checked={selectedRecords.size === replaceResults.filter(r => !appliedRecords.has(r.id)).length && replaceResults.filter(r => !appliedRecords.has(r.id)).length > 0}
                    onCheckedChange={handleSelectAllRecords}
                    indeterminate={selectedRecords.size > 0 && selectedRecords.size < replaceResults.filter(r => !appliedRecords.has(r.id)).length}
                  />
                </TableHead>
                <TableHead className="text-center w-24 px-4 py-3">Column ID</TableHead>
                <TableHead className="text-center w-48 px-4 py-3">Item Name</TableHead>
                <TableHead className="text-center w-80 px-4 py-3">Previous Value</TableHead>
                <TableHead className="text-center flex-1 px-4 py-3">New Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                // Group records by item name
                const groupedResults = replaceResults.filter(result => !appliedRecords.has(result.id)).reduce((acc, result) => {
                  const itemName = result.itemName;
                  if (!acc[itemName]) {
                    acc[itemName] = [];
                  }
                  acc[itemName].push(result);
                  return acc;
                }, {} as Record<string, typeof replaceResults>);

                return Object.entries(groupedResults).map(([itemName, records]) => {
                  return records.map((result, index) => (
                    <TableRow key={result.id} className="hover:bg-gray-50">
                      <TableCell className="sticky left-0 bg-white z-10 text-center px-4 py-3 align-top hover:bg-gray-50">
                        <Checkbox
                          checked={selectedRecords.has(result.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRecords(prev => new Set([...prev, result.id]));
                            } else {
                              setSelectedRecords(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(result.id);
                                return newSet;
                              });
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center text-sm font-mono px-4 py-3 align-top">
                        {index === 0 && generateColumnId(result.itemName)}
                      </TableCell>
                      <TableCell className="text-center font-medium text-sm px-4 py-3 align-top">
                        {index === 0 && (
                          <div className="break-words hyphens-auto">
                            {result.itemName}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm px-4 py-3 align-top">
                        <div className="bg-red-50 p-2 rounded border-l-2 border-red-200 break-words hyphens-auto">
                          {highlightText(result.previousValue, findText)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-sm px-4 py-3 align-top">
                        <div className="bg-green-50 p-2 rounded border-l-2 border-green-200 break-words hyphens-auto">
                          {highlightReplacementText(result.newValue, replaceText)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ));
                });
              })()}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 mt-auto">
        <Button variant="outline" onClick={handleGoBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Go Back
        </Button>
        <div className="flex space-x-3">
          {selectedRecords.size > 0 && (
            <Button onClick={handleApplyChanges} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Replace className="h-4 w-4" />
              Apply Changes ({selectedRecords.size})
            </Button>
          )}
          <Button 
            onClick={handleProceedToConfirmation} 
            className={`gap-2 ${appliedRecords.size > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
          >
            Proceed to Confirmation
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAppliedChangesStep = () => {
    const appliedResults = replaceResults.filter(result => appliedRecords.has(result.id));
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">
            Applied changes: {appliedResults.length} items updated
          </span>
        </div>
        
        <div className="flex-1 border rounded-lg overflow-hidden">
          <div className="h-full overflow-y-auto w-full">
            <Table className="w-full">
              <TableHeader className="sticky top-0 bg-gray-50 z-10">
                <TableRow>
                  <TableHead className="text-center w-1/4 px-4 py-3">Item Name</TableHead>
                  <TableHead className="text-center w-1/3 px-4 py-3">Previous Value</TableHead>
                  <TableHead className="text-center w-1/3 px-4 py-3">New Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  // Group applied results by item name
                  const groupedAppliedResults = appliedResults.reduce((acc, result) => {
                    const itemName = result.itemName;
                    if (!acc[itemName]) {
                      acc[itemName] = [];
                    }
                    acc[itemName].push(result);
                    return acc;
                  }, {} as Record<string, typeof appliedResults>);

                  return Object.entries(groupedAppliedResults).map(([itemName, records]) => {
                    return records.map((result, index) => (
                      <TableRow key={result.id} className="bg-green-50 hover:bg-green-100">
                        <TableCell className="text-center font-medium text-sm px-4 py-3 align-top">
                          {index === 0 && (
                            <div className="break-words hyphens-auto">
                              {result.itemName}
                              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Applied</Badge>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-sm px-4 py-3 align-top">
                          <div className="bg-red-50 p-2 rounded border-l-2 border-red-200 break-words hyphens-auto">
                            {highlightText(result.previousValue, findText)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm px-4 py-3 align-top">
                          <div className="bg-green-50 p-2 rounded border-l-2 border-green-200 break-words hyphens-auto">
                            {highlightReplacementText(result.newValue, replaceText)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ));
                  });
                })()}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="flex justify-between pt-4 mt-auto">
          <Button variant="outline" onClick={handleGoBack} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={handleProceedToConfirmation} className="gap-2">
            Proceed to Confirmation
          </Button>
        </div>
      </div>
    );
  };

  const renderProgressModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Applying Find & Replace Changes</h3>
          <p className="text-sm text-gray-600 mb-8">
            Please wait while your changes are being applied to the selected records.
          </p>
          
          {/* Loading Spinner */}
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
          
          <h4 className="text-base font-medium mb-4">Processing Find & Replace Operations</h4>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            Processing {appliedRecords.size} items...
          </p>
          <p className="text-sm text-gray-500">
            {currentProgressText}
          </p>
        </div>
      </div>
    </div>
  );

  const renderResultsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">Changes Applied Successfully</h3>
          <p className="text-sm text-gray-600 mb-6">
            Your find and replace operation has been completed successfully.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Records Updated:</span>
                <div className="text-lg font-semibold text-green-600">{appliedRecords.size}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Replacements:</span>
                <div className="text-lg font-semibold text-green-600">{getTotalReplacements()}</div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => {
              setShowResults(false);
              handleClose();
            }}>
              Close
            </Button>
            <Button onClick={() => {
              setShowResults(false);
              setCurrentStep('input');
              setActiveTab('replace');
            }}>
              Make More Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="flex flex-col h-full">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Final Confirmation Required</span>
        </div>
        <p className="text-sm text-red-700 mt-1">
          You are about to make irreversible changes to your selected content. This action cannot be undone and may affect live content.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="finalConfirmation"
            checked={finalConfirmationChecked}
            onCheckedChange={(checked) => setFinalConfirmationChecked(checked as boolean)}
          />
          <label htmlFor="finalConfirmation" className="text-sm text-gray-700 leading-5">
            I understand that these changes are permanent and cannot be reversed.
          </label>
        </div>
      </div>
      
      <div className="flex justify-between pt-4 mt-auto">
        <Button variant="outline" onClick={handleGoBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Go Back
        </Button>
        {finalConfirmationChecked && (
          <Button 
            onClick={handleFinalConfirm}
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            <Replace className="h-4 w-4" />
            Apply Changes
          </Button>
        )}
      </div>
    </div>
  );

  const getModalTitle = () => {
    if (activeTab === 'find') {
      return 'Find';
    }
    
    switch (currentStep) {
      case 'input':
        return 'Find and Replace';
      case 'preview':
        return 'Preview Changes';
      case 'applied-changes':
        return 'Applied Changes';
      case 'confirm':
        return 'Final Confirmation';
      default:
        return 'Find and Replace';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="!w-[90vw] !h-[90vh] !max-w-[90vw] !max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeTab === 'find' ? <Search className="h-5 w-5" /> : <Replace className="h-5 w-5" />}
              {getModalTitle()}
              
            </DialogTitle>
            <DialogDescription>
              {activeTab === 'find' 
                ? 'Search for text within your selected content to locate specific information.'
                : currentStep === 'input' 
                  ? 'Find and replace text across your selected content. Preview changes before applying them.'
                  : currentStep === 'preview'
                    ? 'Review the changes that will be made to your content before confirming.'
                    : currentStep === 'applied-changes'
                      ? 'Review all the changes that have been successfully applied to your content.'
                      : 'Confirm that you want to apply these permanent changes to your content.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs at the top for switching between Find and Find & Replace */}
            {currentStep === 'input' && (
              <div className="mb-6 flex-shrink-0">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'find' | 'replace')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="find" className="gap-2">
                      <Search className="h-4 w-4" />
                      Find
                    </TabsTrigger>
                    <TabsTrigger value="replace" className="gap-2">
                      <Replace className="h-4 w-4" />
                      Find & Replace
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
            
            <div className="flex-1 overflow-hidden">
              {activeTab === 'find' ? (
                renderFindTab()
              ) : (
                <>
                  {currentStep === 'input' && renderReplaceInputStep()}
                  {currentStep === 'preview' && (
              <div className="!flex !flex-col !h-full !w-full !p-0 !m-0">
                {renderPreviewStep()}
              </div>
            )}
                  {currentStep === 'applied-changes' && renderAppliedChangesStep()}
                  {currentStep === 'confirm' && renderConfirmStep()}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Progress Modal */}
      {showProgress && renderProgressModal()}
      
      {/* Results Modal */}
      {showResults && renderResultsModal()}
      
      {/* Find Results Modal */}
      <FindResultsModal
        isOpen={showFindResultsModal}
        onClose={() => setShowFindResultsModal(false)}
        findResults={findResults.map(result => ({
          id: result.id,
          itemName: result.itemName,
          matchContext: result.matchContext,
          fullMatch: result.fullContext,
          matchCount: 1
        }))}
        findText={findText}
        selectedColumn={selectedColumn}
        getTotalMatches={getTotalMatches}
      />
    </>
  );
}