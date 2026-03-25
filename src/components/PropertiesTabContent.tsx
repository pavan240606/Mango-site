import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X as XIcon, ChevronDown, ChevronRight } from 'lucide-react';

interface ModularProperty {
  id: string;
  moduleName: string;
  propertiesCount: number;
  subPropertiesCount: number;
  fieldsJson: any;
  properties: PropertyDetail[];
}

interface PropertyDetail {
  id: string;
  name: string;
  type: string;
  children?: PropertyDetail[];
}

interface Property {
  id: string;
  name: string;
  type: string;
  optionsCount: number | null;
  hasChildren: boolean;
  childrenCount?: number;
  usedInModulesCount: number;
  options?: PropertyOption[];
  usedInModules?: ModuleUsage[];
}

interface PropertyOption {
  id: string;
  name: string;
  type: string;
  children?: PropertyOption[];
}

interface ModuleUsage {
  moduleName: string;
  count: number;
}

interface PropertiesTabContentProps {
  isLoadingTable?: boolean;
}

export function PropertiesTabContent({ isLoadingTable = false }: PropertiesTabContentProps) {
  const [propertiesView, setPropertiesView] = useState<'modular' | 'property'>('modular');
  const [selectedModuleForJson, setSelectedModuleForJson] = useState<ModularProperty | null>(null);
  const [selectedModuleForProperties, setSelectedModuleForProperties] = useState<ModularProperty | null>(null);
  const [selectedPropertyForOptions, setSelectedPropertyForOptions] = useState<Property | null>(null);
  const [selectedPropertyForModules, setSelectedPropertyForModules] = useState<Property | null>(null);
  const [optionsView, setOptionsView] = useState<'tree' | 'json'>('tree');
  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [moduleNameFilter, setModuleNameFilter] = useState('');
  const [expandedPropertyIds, setExpandedPropertyIds] = useState<Set<string>>(new Set());

  // Toggle property expansion
  const togglePropertyExpansion = (propId: string) => {
    setExpandedPropertyIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propId)) {
        newSet.delete(propId);
      } else {
        newSet.add(propId);
      }
      return newSet;
    });
  };

  // Mock data for Modular View
  const modularProperties: ModularProperty[] = [
    {
      id: 'mod1',
      moduleName: 'Button',
      propertiesCount: 3,
      subPropertiesCount: 12,
      fieldsJson: [
        {
          id: "link",
          name: "link",
          label: "Button Link",
          required: false,
          locked: false,
          supported_types: ["EXTERNAL", "CONTENT", "FILE", "EMAIL_ADDRESS", "CALL_TO_ACTION"],
          show_advanced_rel_options: false,
          type: "link",
          display_width: null,
          default: {
            url: { href: "", type: "EXTERNAL" },
            no_follow: false,
            open_in_new_tab: false
          }
        },
        {
          id: "button_text",
          name: "button_text",
          label: "Button text",
          required: true,
          locked: false,
          allow_new_line: false,
          type: "text",
          display_width: null,
          default: "Add a button link here"
        },
        {
          id: "styles",
          name: "styles",
          label: "Styles",
          required: false,
          locked: false,
          type: "group",
          children: [
            {
              id: "background_color",
              name: "background_color",
              label: "Background Color",
              type: "color"
            }
          ]
        }
      ],
      properties: [
        { id: 'p1', name: 'Button link', type: 'link', children: [] },
        { id: 'p2', name: 'Button text', type: 'text', children: [] },
        {
          id: 'p3',
          name: 'Styles',
          type: 'group',
          children: [
            { id: 'p3-1', name: 'Font', type: 'font', children: [] },
            { id: 'p3-2', name: 'Background', type: 'group', children: [
              { id: 'p3-2-1', name: 'Color', type: 'color', children: [] }
            ]},
            { id: 'p3-3', name: 'Border', type: 'group', children: [
              { id: 'p3-3-1', name: 'Border', type: 'border', children: [] }
            ]},
            { id: 'p3-4', name: 'Corner', type: 'group', children: [
              { id: 'p3-4-1', name: 'Radius', type: 'number', children: [] }
            ]},
            { id: 'p3-5', name: 'Spacing', type: 'group', children: [
              { id: 'p3-5-1', name: 'Spacing', type: 'spacing', children: [] }
            ]},
            { id: 'p3-6', name: 'Alignment', type: 'group', children: [
              { id: 'p3-6-1', name: 'Alignment', type: 'alignment', children: [] }
            ]},
          ]
        },
        {
          id: 'p4',
          name: 'Text',
          type: 'group',
          children: [
            { id: 'p4-1', name: 'Font', type: 'font', children: [] }
          ]
        }
      ]
    },
    {
      id: 'mod2',
      moduleName: 'Card',
      propertiesCount: 2,
      subPropertiesCount: 17,
      fieldsJson: [],
      properties: []
    },
    {
      id: 'mod3',
      moduleName: 'Pricing card',
      propertiesCount: 12,
      subPropertiesCount: 39,
      fieldsJson: [],
      properties: []
    },
    {
      id: 'mod4',
      moduleName: 'Menu',
      propertiesCount: 3,
      subPropertiesCount: 9,
      fieldsJson: [],
      properties: []
    },
    {
      id: 'mod5',
      moduleName: 'Social follow',
      propertiesCount: 2,
      subPropertiesCount: 18,
      fieldsJson: [],
      properties: []
    }
  ];

  // Mock data for Property View
  const propertyViewData: Property[] = [
    {
      id: 'prop1',
      name: 'Style',
      type: 'group',
      optionsCount: null,
      hasChildren: true,
      childrenCount: 418,
      usedInModulesCount: 83,
      options: Array.from({ length: 50 }, (_, i) => ({
        id: `opt-${i}`,
        name: i < 10 ? 'Add Overlay' : `Property ${i}`,
        type: i % 4 === 0 ? 'boolean' : i % 4 === 1 ? 'color' : i % 4 === 2 ? 'choice' : 'text',
        children: []
      })),
      usedInModules: [
        { moduleName: '(OLD) Remote - Full Width Video', count: 1 },
        { moduleName: 'Banner - Newsletter CTA - Global', count: 1 },
        { moduleName: 'OLD - Remote - Index Table.module', count: 1 },
        { moduleName: 'OLD- Remote - Social Proof - Homepage', count: 1 },
        { moduleName: 'Old - Remote - Pricing Tabs', count: 1 },
        { moduleName: 'Old - Remote - Pricing without Tabs', count: 1 },
        { moduleName: 'Remote - Accordion Table', count: 1 },
        { moduleName: 'Remote - Awards - Homepage', count: 1 },
        { moduleName: 'Remote - Banner', count: 1 }
      ]
    },
    {
      id: 'prop2',
      name: 'Heading Area',
      type: 'group',
      optionsCount: null,
      hasChildren: true,
      childrenCount: 509,
      usedInModulesCount: 60,
      options: [],
      usedInModules: []
    },
    {
      id: 'prop3',
      name: 'Style',
      type: 'group',
      optionsCount: null,
      hasChildren: true,
      childrenCount: 92,
      usedInModulesCount: 23,
      options: [],
      usedInModules: []
    },
    {
      id: 'prop4',
      name: 'Grid Items',
      type: 'group',
      optionsCount: null,
      hasChildren: true,
      childrenCount: 80,
      usedInModulesCount: 22,
      options: [],
      usedInModules: []
    },
    {
      id: 'prop5',
      name: 'CTAs',
      type: 'group',
      optionsCount: null,
      hasChildren: true,
      childrenCount: 135,
      usedInModulesCount: 17,
      options: [],
      usedInModules: []
    },
    {
      id: 'prop6',
      name: 'Grid Columns Type',
      type: 'choice',
      optionsCount: null,
      hasChildren: false,
      usedInModulesCount: 17,
      options: [],
      usedInModules: []
    },
    {
      id: 'prop7',
      name: 'CTAs',
      type: 'group',
      optionsCount: null,
      hasChildren: true,
      childrenCount: 127,
      usedInModulesCount: 16,
      options: [],
      usedInModules: []
    },
    {
      id: 'prop8',
      name: 'Heading Area',
      type: 'group',
      optionsCount: null,
      hasChildren: true,
      childrenCount: 50,
      usedInModulesCount: 16,
      options: [],
      usedInModules: []
    }
  ];

  const renderPropertyTree = (properties: PropertyDetail[], level = 0): JSX.Element[] => {
    return properties
      .filter(prop => !propertySearchQuery || prop.name.toLowerCase().includes(propertySearchQuery.toLowerCase()))
      .map((prop) => {
        const hasChildren = prop.children && prop.children.length > 0;
        const isExpanded = expandedPropertyIds.has(prop.id);
        
        return (
          <div key={prop.id}>
            <div 
              className="flex items-center gap-2 py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer"
              style={{ marginLeft: `${level * 20}px` }}
              onClick={() => hasChildren && togglePropertyExpansion(prop.id)}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500 shrink-0" />
                )
              ) : (
                <div className="w-4 shrink-0" />
              )}
              <span className="text-sm text-gray-900">{prop.name}</span>
              <span className="text-xs text-blue-600">({prop.type})</span>
            </div>
            {isExpanded && hasChildren && (
              <div>
                {renderPropertyTree(prop.children!, level + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  const renderOptionsTree = (options: PropertyOption[], level = 0) => {
    return options.map((option) => (
      <div key={option.id} style={{ marginLeft: `${level * 24}px` }}>
        <div className="flex items-center gap-2 py-1.5">
          {option.children && option.children.length > 0 && (
            <span className="text-gray-400">├─</span>
          )}
          {!option.children && level > 0 && (
            <span className="text-gray-400">└─</span>
          )}
          <span className="text-sm font-mono text-gray-900">{option.name}</span>
          <span className="text-xs text-gray-600">({option.type})</span>
        </div>
        {option.children && option.children.length > 0 && renderOptionsTree(option.children, level + 1)}
      </div>
    ));
  };

  return (
    <motion.div
      key="properties"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Modular View */}
      {propertiesView === 'modular' && (
        <>
          {/* Search Filter */}
          <Card className="p-6 bg-white border-gray-200">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Module Name</label>
                <Input
                  placeholder="e.g. button, card, menu"
                  value={moduleNameFilter}
                  onChange={(e) => setModuleNameFilter(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <Button 
                className="bg-gray-800 hover:bg-gray-900 text-white h-9 px-5 rounded font-medium text-sm"
              >
                Apply Filters
              </Button>
              <Button 
                variant="outline"
                className="h-9 px-5 text-gray-700 text-sm border-gray-300"
                onClick={() => setModuleNameFilter('')}
              >
                Reset
              </Button>
            </div>
          </Card>

          {/* View Toggle Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center gap-6 px-1">
              <button
                onClick={() => setPropertiesView('modular')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  propertiesView === 'modular' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Modular view
                {propertiesView === 'modular' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
              <button
                onClick={() => setPropertiesView('property')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  propertiesView === 'property' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Property view
                {propertiesView === 'property' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            </div>
          </div>

          <Card className="p-6 bg-white border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-600">Total Modules: <span className="font-bold">{modularProperties.filter(m => !moduleNameFilter || m.moduleName.toLowerCase().includes(moduleNameFilter.toLowerCase())).length}</span></p>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Module Name
                    </th>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Properties
                    </th>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Sub Properties
                    </th>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      fields
                    </th>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {modularProperties
                    .filter(m => !moduleNameFilter || m.moduleName.toLowerCase().includes(moduleNameFilter.toLowerCase()))
                    .map((module) => (
                    <tr key={module.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-900">{module.moduleName}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{module.propertiesCount}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{module.subPropertiesCount}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-3 text-xs"
                          onClick={() => setSelectedModuleForJson(module)}
                        >
                          View
                        </Button>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-3 text-xs"
                          onClick={() => setSelectedModuleForProperties(module)}
                        >
                          View Properties
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Property View */}
      {propertiesView === 'property' && (
        <>
          {/* Filter Card - keeping it minimal for now since the screenshot doesn't show filters for property view */}
          <Card className="p-6 bg-white border-gray-200">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Property Name</label>
                <Input
                  placeholder="e.g. label, heading, name"
                  className="h-9 text-sm"
                />
              </div>
              <Button 
                className="bg-gray-800 hover:bg-gray-900 text-white h-9 px-5 rounded font-medium text-sm"
              >
                Apply Filters
              </Button>
              <Button 
                variant="outline"
                className="h-9 px-5 text-gray-700 text-sm border-gray-300"
              >
                Reset
              </Button>
            </div>
          </Card>

          {/* View Toggle Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center gap-6 px-1">
              <button
                onClick={() => setPropertiesView('modular')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  propertiesView === 'modular' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Modular view
                {propertiesView === 'modular' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
              <button
                onClick={() => setPropertiesView('property')}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  propertiesView === 'property' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Property view
                {propertiesView === 'property' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                )}
              </button>
            </div>
          </div>

          <Card className="p-6 bg-white border-gray-200">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      SR
                    </th>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Options
                    </th>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Used in Modules
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {propertyViewData.map((property, index) => (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{property.name}</td>
                      <td className="py-3 px-4">
                        {property.hasChildren ? (
                          <button
                            onClick={() => setSelectedPropertyForOptions(property)}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {property.childrenCount} children
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-700 capitalize">{property.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedPropertyForModules(property)}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {property.usedInModulesCount} modules
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* fields.json Modal */}
      <Dialog open={!!selectedModuleForJson} onOpenChange={() => setSelectedModuleForJson(null)}>
        <DialogContent className="!w-[90vw] !h-[90vh] !max-w-[90vw] !max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              fields.json — {selectedModuleForJson?.moduleName}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex-1 overflow-y-auto">
            <pre className="bg-gray-50 p-6 rounded-lg text-xs font-mono overflow-x-auto text-gray-900 leading-relaxed">
              {JSON.stringify(selectedModuleForJson?.fieldsJson, null, 2)}
            </pre>
          </div>
        </DialogContent>
      </Dialog>

      {/* Properties Modal */}
      <Dialog open={!!selectedModuleForProperties} onOpenChange={() => setSelectedModuleForProperties(null)}>
        <DialogContent className="!w-[90vw] !h-[90vh] !max-w-[90vw] !max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Properties: {selectedModuleForProperties?.moduleName}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex-1 overflow-y-auto">
            <Input
              placeholder="Search properties..."
              value={propertySearchQuery}
              onChange={(e) => setPropertySearchQuery(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-1">
              {selectedModuleForProperties && renderPropertyTree(selectedModuleForProperties.properties)}
            </div>
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t">
            <Button onClick={() => setSelectedModuleForProperties(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Options Modal */}
      <Dialog open={!!selectedPropertyForOptions} onOpenChange={() => setSelectedPropertyForOptions(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center justify-between">
              <span>Options: {selectedPropertyForOptions?.name}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant={optionsView === 'tree' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOptionsView('tree')}
                  className={optionsView === 'tree' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                >
                  Tree
                </Button>
                <Button
                  variant={optionsView === 'json' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOptionsView('json')}
                  className={optionsView === 'json' ? 'bg-teal-600 hover:bg-teal-700' : ''}
                >
                  JSON
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex-1 overflow-y-auto">
            {optionsView === 'tree' ? (
              <div className="space-y-1 font-mono text-sm">
                {selectedPropertyForOptions?.options && renderOptionsTree(selectedPropertyForOptions.options)}
              </div>
            ) : (
              <pre className="bg-gray-50 p-6 rounded-lg text-xs font-mono overflow-x-auto text-gray-900 leading-relaxed">
                {JSON.stringify(selectedPropertyForOptions?.options, null, 2)}
              </pre>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Used in Modules Modal */}
      <Dialog open={!!selectedPropertyForModules} onOpenChange={() => setSelectedPropertyForModules(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Used in modules: {selectedPropertyForModules?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Module</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {selectedPropertyForModules?.usedInModules?.map((module, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{module.moduleName}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{module.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t">
            <Button onClick={() => setSelectedPropertyForModules(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}