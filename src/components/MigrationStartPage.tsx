import { Plus, History, ArrowLeft, Trash2, Clock, Loader2, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { MigrationWizard } from './MigrationWizard';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';
import { Card } from './ui/card';

export function MigrationStartPage() {
  const [view, setView] = useState<'splash' | 'drafts' | 'wizard'>('splash');
  const [activeDraft, setActiveDraft] = useState<any>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);

  const fetchDrafts = async () => {
    setIsLoadingDrafts(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2abbdb9a/migrations/drafts`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch drafts');
      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load drafts');
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-2abbdb9a/migrations/drafts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete');
      setDrafts(prev => prev.filter(d => d.id !== id));
      toast.success('Draft deleted');
    } catch (error) {
      toast.error('Failed to delete draft');
    }
  };

  const handleSelectDraft = (draft: any) => {
    setActiveDraft(draft);
    setView('wizard');
  };

  const handleStartNew = () => {
    setActiveDraft(null);
    setView('wizard');
  };

  const handleBackToSplash = () => {
    setView('splash');
  };

  const handleOpenDrafts = () => {
    fetchDrafts();
    setView('drafts');
  };

  if (view === 'wizard') {
    return (
      <MigrationWizard 
        initialData={activeDraft?.data} 
        initialStep={activeDraft?.step}
        draftId={activeDraft?.id}
        onClose={() => setView('splash')} 
      />
    );
  }

  if (view === 'drafts') {
    return (
      <div className="flex-1 bg-white flex flex-col h-full overflow-hidden font-sans">
        <div className="h-14 border-b border-gray-100 flex items-center px-8 gap-3 shrink-0">
          <Button variant="ghost" size="icon" onClick={handleBackToSplash} className="text-gray-400 h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">Migration Drafts</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Resume your work</h2>
                <p className="text-gray-500 text-xs">Pick up where you left off with your pending migrations.</p>
              </div>
              <Button onClick={handleStartNew} className="bg-[#10B981] hover:bg-[#059669] text-white gap-2 font-bold px-4 h-10 rounded-lg text-sm">
                <Plus className="h-4 w-4" />
                New Migration
              </Button>
            </div>

            {isLoadingDrafts ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin text-[#10B981]" />
                <p className="font-bold text-sm">Loading your drafts...</p>
              </div>
            ) : drafts.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center bg-white border border-dashed border-gray-200 rounded-2xl">
                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <History className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No drafts found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mt-1 text-xs leading-relaxed">Any migrations you pause mid-way will automatically appear here for you to resume.</p>
                <Button onClick={handleStartNew} variant="outline" className="mt-6 border-gray-200 hover:border-[#10B981] hover:text-[#10B981] font-bold h-10 px-6 rounded-lg text-sm">
                  Start New Migration
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {drafts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map((draft) => (
                  <Card 
                    key={draft.id} 
                    onClick={() => handleSelectDraft(draft)}
                    className="p-5 border-gray-100 hover:border-[#10B981] hover:shadow-md transition-all cursor-pointer group bg-white rounded-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#10B981] group-hover:bg-teal-50 transition-colors">
                          <History className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-base font-bold text-gray-900 group-hover:text-[#10B981] transition-colors">
                            {draft.name || 'Untitled Migration'}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-[#10B981] bg-teal-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              Step {draft.step} / 11
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                              <Clock className="h-3 w-3" />
                              {new Date(draft.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDraft(draft.id);
                          }}
                          className="h-9 w-9 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#10B981] group-hover:text-white transition-all">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex items-center justify-center p-8 font-sans">
      <div className="max-w-lg w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">New Migration</h1>
          <p className="text-lg text-gray-500 max-w-sm mx-auto leading-relaxed font-medium">
            Seamlessly move your content between platforms. Connect, map, and migrate in minutes.
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <Button 
            onClick={handleStartNew}
            className="bg-[#10B981] hover:bg-[#059669] text-white h-14 px-10 rounded-xl font-bold text-lg shadow-xl shadow-[#10B981]/20 transition-all active:scale-95 gap-3 w-full max-w-xs"
          >
            <Plus className="h-5 w-5 stroke-[3]" />
            Start New Migration
          </Button>
          <Button 
            variant="ghost"
            onClick={handleOpenDrafts}
            className="text-gray-500 hover:text-[#10B981] hover:bg-teal-50 h-11 px-6 rounded-lg font-bold text-base transition-all active:scale-95 gap-2"
          >
            <History className="h-4 w-4" />
            Resume from Drafts
          </Button>
        </div>
      </div>
    </div>
  );
}
