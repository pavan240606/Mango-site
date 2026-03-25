import { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  History, 
  AlertCircle, 
  Plus, 
  Clock,
  Loader2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function MigrationOverview({ onStartNewMigration }: { onStartNewMigration: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMigrations, setActiveMigrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveMigrations = async () => {
    if (!projectId || !publicAnonKey) {
      console.warn('[MigrationOverview] Supabase configuration missing');
      return;
    }

    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-2abbdb9a/migrations/active`;
      console.log(`[MigrationOverview] Fetching active migrations from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[MigrationOverview] Server responded with error ${response.status}: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log(`[MigrationOverview] Received ${Array.isArray(data) ? data.length : 0} active migrations`);
      
      if (Array.isArray(data)) {
        const serverMigrations = data.map((m: any) => ({
          id: m.id,
          title: m.title || 'Untitled Migration',
          subtitle: m.subtitle || 'Running Migration',
          progress: m.progress || 0,
          current: m.current || 0,
          total: m.total || 0,
          timeLeft: '~12m left',
          platforms: [
            { label: (m.sourceCmsId || 'H').substring(0, 1).toUpperCase(), color: 'bg-teal-50 text-teal-600' },
            { label: (m.destinationCmsId || 'C').substring(0, 1).toUpperCase(), color: 'bg-indigo-50 text-indigo-600' }
          ]
        }));

        setActiveMigrations(serverMigrations);
      }
    } catch (error) {
      console.error('[MigrationOverview] Critical error during fetch:', error);
      // If it's a "Failed to fetch", it might be a network or CORS issue
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('[MigrationOverview] Network error: The server might be unreachable or CORS preflight failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveMigrations();
    const interval = setInterval(fetchActiveMigrations, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Migrations', value: '124', icon: History, iconColor: 'text-indigo-500', bgColor: 'bg-indigo-50' },
    { label: 'In Progress', value: activeMigrations.length.toString(), icon: RefreshCw, iconColor: 'text-blue-500', bgColor: 'bg-blue-50', animate: true },
    { label: 'Failed Migrations', value: '12', icon: AlertCircle, iconColor: 'text-red-500', bgColor: 'bg-red-50' },
  ];

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-h-screen">
      {/* Top Search Bar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shrink-0">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            className="w-full bg-gray-50/50 border-gray-200 pl-11 h-10 rounded-lg focus-visible:ring-teal-500/20 focus-visible:border-teal-500 transition-all"
            placeholder="Search across migrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
          
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">Content Migration</h1>
              <p className="text-sm text-gray-600">Manage and track your CMS data migrations across platforms.</p>
            </div>
            <Button 
              onClick={onStartNewMigration}
              className="bg-teal-600 hover:bg-teal-700 text-white h-10 px-4 rounded-lg font-medium gap-2 shadow-sm transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Start New Migration
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className="p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-default group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${stat.bgColor} ${stat.iconColor} group-hover:scale-105 transition-transform`}>
                    <stat.icon className={`h-5 w-5 ${stat.animate ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Active Migrations */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Active Migrations</h2>
            <div className="grid gap-3">
              {isLoading && activeMigrations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                  <Loader2 className="h-8 w-8 text-teal-500 animate-spin mb-3" />
                  <p className="text-gray-500 font-medium">Loading active migrations...</p>
                </div>
              ) : activeMigrations.length > 0 ? (
                activeMigrations.map((migration) => (
                  <Card key={migration.id} className="p-5 bg-white border-gray-200 shadow-sm hover:border-teal-200 transition-all group overflow-hidden relative">
                    <div className="flex flex-col gap-4">
                      {/* Item Top */}
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="flex -space-x-1.5">
                            {migration.platforms.map((p: any, idx: number) => (
                              <div key={idx} className={`w-9 h-9 rounded-lg ${p.color} border-2 border-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                                {p.label}
                              </div>
                            ))}
                          </div>
                          <div className="space-y-0.5">
                            <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">{migration.title}</h3>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{migration.subtitle}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                          In Progress
                        </Badge>
                      </div>

                      {/* Progress Area */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Progress: {migration.progress}%</span>
                          <span className="text-xs font-bold text-teal-600">{migration.current} / {migration.total} entries</span>
                        </div>
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${migration.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="absolute inset-y-0 left-0 bg-blue-600" 
                          />
                        </div>
                      </div>

                      {/* Footer Area */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-xs font-medium">{migration.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                  <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <RefreshCw className="h-6 w-6" />
                  </div>
                  <p className="text-gray-500 font-medium italic">No active migrations running.</p>
                  <Button 
                    variant="link" 
                    onClick={onStartNewMigration}
                    className="text-teal-600 font-bold mt-2"
                  >
                    Start your first migration
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
