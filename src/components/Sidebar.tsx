import { 
  Settings, 
  Upload, 
  Download, 
  HardDrive, 
  RotateCcw, 
  FileText, 
  List, 
  Package, 
  ChevronDown, 
  Building2, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  LayoutDashboard, 
  RefreshCw, 
  History,
  ChevronLeft,
  ChevronRight,
  ArrowRightLeft,
  ClipboardCheck,
  FileCode,
  Box,
  Database,
  Globe,
  FileCheck,
  Handshake
} from 'lucide-react';
import { Button } from './ui/button';
import { usePortal } from './PortalContext';
import { useIntegration } from './IntegrationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { useState } from 'react';
import { AddPortalModal } from './AddPortalModal';
import { RemovePortalModal } from './RemovePortalModal';
import { Portal } from './PortalContext';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  onShowLogs: () => void;
  onShowExports: () => void;
  onShowImports: () => void;
  onShowBackupRestore: () => void;
  onShowAdminPanel: () => void;
  onShowReports: () => void;
  onShowDashboard: () => void;
  onShowMigrationOverview: () => void;
  onShowMigrationHistory: () => void;
  onShowMigrationStart: () => void;
  onShowHubSpotAudit: () => void;
  onShowHubSpotAuditSetup: () => void;
  onShowHubSpotAuditReports: () => void;
  activePage: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ 
  onShowLogs, 
  onShowExports, 
  onShowImports, 
  onShowBackupRestore, 
  onShowAdminPanel, 
  onShowReports, 
  onShowDashboard,
  onShowMigrationOverview, 
  onShowMigrationHistory, 
  onShowMigrationStart,
  onShowHubSpotAudit,
  onShowHubSpotAuditSetup,
  onShowHubSpotAuditReports,
  activePage,
  isCollapsed,
  onToggleCollapse
}: SidebarProps) {
  const { currentPortal, portals, setCurrentPortal, removePortal } = usePortal();
  const { hubSpotConnected } = useIntegration();
  const [addPortalModalOpen, setAddPortalModalOpen] = useState(false);
  const [removePortalModalOpen, setRemovePortalModalOpen] = useState(false);
  const [portalToRemove, setPortalToRemove] = useState<Portal | null>(null);
  const [bulkEditsExpanded, setBulkEditsExpanded] = useState(false);
  const [hubSpotScanExpanded, setHubSpotScanExpanded] = useState(false);
  const [migrationExpanded, setMigrationExpanded] = useState(false);
  const [backupRestoreExpanded, setBackupRestoreExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);
  
  const handleRemoveClick = (e: React.MouseEvent, portal: Portal) => {
    e.stopPropagation();
    setPortalToRemove(portal);
    setRemovePortalModalOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (portalToRemove) {
      removePortal(portalToRemove.id);
      setPortalToRemove(null);
    }
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '256px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white border-r border-gray-200 h-full flex flex-col relative z-20 shrink-0"
    >
      {/* Collapse Toggle Button - Floating on the border */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-4 top-12 h-8 w-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all z-30 group"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className={`p-6 space-y-4 shrink-0 overflow-hidden ${isCollapsed ? 'items-center px-4' : ''}`}>
        <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="text-teal-500 text-xl font-bold shrink-0">{'{:-}'}</div>
          {!isCollapsed && <span className="text-xl font-bold text-teal-500 whitespace-nowrap">smuves</span>}
        </div>
        
        {/* Portal Selector Dropdown */}
        {hubSpotConnected && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={`w-full justify-between h-auto py-2.5 px-3 bg-gray-50 hover:bg-gray-100 border-gray-200 ${isCollapsed ? 'px-0 justify-center h-10 w-10 min-w-0 p-0' : ''}`}
              >
                <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
                  <Building2 className="h-4 w-4 text-gray-500 shrink-0" />
                  {!isCollapsed && (
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-xs text-gray-500">Portal ID</span>
                      <span className="text-sm font-medium text-gray-900 truncate w-full text-left">
                        {currentPortal.hubspotId}
                      </span>
                    </div>
                  )}
                </div>
                {!isCollapsed && <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-2" />}
              </Button>
            </DropdownMenuTrigger>
            {!isCollapsed && (
              <DropdownMenuContent align="start" className="w-56">
                {portals.map((portal) => (
                  <DropdownMenuItem
                    key={portal.id}
                    onClick={() => setCurrentPortal(portal)}
                    className={`flex items-start justify-between py-2.5 ${
                      currentPortal.id === portal.id ? 'bg-teal-50' : ''
                    }`}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{portal.name}</span>
                        {currentPortal.id === portal.id && (
                          <div className="h-2 w-2 bg-teal-500 rounded-full" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">Portal ID: {portal.hubspotId}</span>
                    </div>
                    <button
                      onClick={(e) => handleRemoveClick(e, portal)}
                      className="ml-2 p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-600" />
                    </button>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setAddPortalModalOpen(true)}
                  className="py-2.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">Add Portal</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        )}
      </div>
      
      <nav className={`flex-1 px-4 overflow-y-auto pb-6 space-y-6 ${isCollapsed ? 'px-2' : ''}`}>
        <div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                activePage === 'adminPanel' 
                  ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={onShowAdminPanel}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>Admin Panel</span>}
            </Button>
          </div>
        </div>
        
        <div>
          {!isCollapsed && (
            <button 
              onClick={() => setBulkEditsExpanded(!bulkEditsExpanded)}
              className="flex items-center justify-between w-full text-[10px] font-bold text-gray-400 mb-2 px-3 tracking-widest uppercase hover:text-gray-600 transition-colors"
            >
              <span>Bulk Edits</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${bulkEditsExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
          <AnimatePresence>
            {bulkEditsExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'dashboard' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowDashboard}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Dashboard</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'exports' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowExports}
                >
                  <Download className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Edit and Export</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'imports' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowImports}
                >
                  <Upload className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Imports</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'logs' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowLogs}
                >
                  <List className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Logs</span>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HubSpot Scan Section - Top Level (Outside Migration) */}
        <div>
          {!isCollapsed && (
            <button 
              onClick={() => setHubSpotScanExpanded(!hubSpotScanExpanded)}
              className="flex items-center justify-between w-full text-[10px] font-bold text-gray-400 mb-2 px-3 tracking-widest uppercase hover:text-gray-600 transition-colors"
            >
              <span>HubSpot Theme Scan</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${hubSpotScanExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
          <AnimatePresence>
            {hubSpotScanExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'hubSpotAudit' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowHubSpotAudit}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Overview</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'hubSpotAuditSetup' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowHubSpotAuditSetup}
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Scan</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'hubSpotAuditReports' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowHubSpotAuditReports}
                >
                  <FileCode className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Reports</span>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          {!isCollapsed && (
            <button 
              onClick={() => setMigrationExpanded(!migrationExpanded)}
              className="flex items-center justify-between w-full text-[10px] font-bold text-gray-400 mb-2 px-3 tracking-widest uppercase hover:text-gray-600 transition-colors"
            >
              <span>Migration</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${migrationExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
          <AnimatePresence>
            {migrationExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'migrationOverview' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowMigrationOverview}
                >
                  <RefreshCw className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Overview</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'migrationHistory' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowMigrationHistory}
                >
                  <History className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>History</span>}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'migrationStart' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowMigrationStart}
                >
                  <ArrowRightLeft className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Migration</span>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div>
          {!isCollapsed && (
            <button 
              onClick={() => setBackupRestoreExpanded(!backupRestoreExpanded)}
              className="flex items-center justify-between w-full text-[10px] font-bold text-gray-400 mb-2 px-3 tracking-widest uppercase hover:text-gray-600 transition-colors"
            >
              <span>Backup & Restore</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${backupRestoreExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
          <AnimatePresence>
            {backupRestoreExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'backupRestore' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowBackupRestore}
                >
                  <Package className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Backup & Restore</span>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div>
          {!isCollapsed && (
            <button 
              onClick={() => setReportsExpanded(!reportsExpanded)}
              className="flex items-center justify-between w-full text-[10px] font-bold text-gray-400 mb-2 px-3 tracking-widest uppercase hover:text-gray-600 transition-colors"
            >
              <span>Reports</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${reportsExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
          <AnimatePresence>
            {reportsExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-1 overflow-hidden"
              >
                <Button
                  variant="ghost"
                  className={`w-full gap-3 h-10 px-3 ${isCollapsed ? 'justify-center px-0' : 'justify-start'} ${
                    activePage === 'reports' 
                      ? 'bg-teal-100 text-teal-700 hover:bg-teal-100' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={onShowReports}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Reports</span>}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      
      <AddPortalModal open={addPortalModalOpen} onOpenChange={setAddPortalModalOpen} />
      <RemovePortalModal 
        open={removePortalModalOpen} 
        onOpenChange={setRemovePortalModalOpen} 
        portal={portalToRemove}
        onConfirm={handleRemoveConfirm} 
      />
    </motion.div>
  );
}
