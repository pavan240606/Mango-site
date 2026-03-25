import { useState } from 'react';
import { Sparkles, Send, X, Edit, Replace } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  contentType: string;
  onApplyBulkEdit: (fields: any) => void;
  onApplyFindReplace: (findValue: string, replaceValue: string, field: string) => void;
}

export function AIAssistantModal({ 
  isOpen, 
  onClose, 
  selectedCount,
  contentType,
  onApplyBulkEdit,
  onApplyFindReplace
}: AIAssistantModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExecutePrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerPrompt = prompt.toLowerCase();

    // Detect bulk edit patterns
    if (lowerPrompt.includes('update') || lowerPrompt.includes('change') || lowerPrompt.includes('set')) {
      const bulkEditData: any = {};
      
      if (lowerPrompt.includes('meta description') || lowerPrompt.includes('description')) {
        bulkEditData.metadescription = 'Updated meta description for improved SEO performance and click-through rates.';
      }
      
      if (lowerPrompt.includes('title')) {
        bulkEditData.metatitle = 'Optimized Title | ' + contentType + ' | 2024';
      }

      if (lowerPrompt.includes('status') || lowerPrompt.includes('publish')) {
        bulkEditData.status = 'Published';
      }

      if (Object.keys(bulkEditData).length > 0) {
        onApplyBulkEdit(bulkEditData);
        toast.success('AI applied bulk edit action');
        setIsProcessing(false);
        onClose();
        setPrompt('');
        return;
      }
    }

    // Detect find & replace patterns
    if (lowerPrompt.includes('replace') || lowerPrompt.includes('find')) {
      // Try to extract what to find and replace
      const replaceMatch = lowerPrompt.match(/replace\s+"([^"]+)"\s+with\s+"([^"]+)"/i) ||
                          lowerPrompt.match(/replace\s+'([^']+)'\s+with\s+'([^']+)'/i) ||
                          lowerPrompt.match(/replace\s+(\S+)\s+with\s+(\S+)/i);
      
      if (replaceMatch) {
        onApplyFindReplace(
          replaceMatch[1],
          replaceMatch[2],
          'Meta Description'
        );
        toast.success('AI applied find & replace action');
        setIsProcessing(false);
        onClose();
        setPrompt('');
        return;
      }
    }

    // Default: open bulk edit with a generic update
    const defaultBulkEdit = {
      metadescription: 'Enhanced content based on AI prompt: ' + prompt
    };
    onApplyBulkEdit(defaultBulkEdit);
    toast.success('AI applied bulk edit action');
    setIsProcessing(false);
    onClose();
    setPrompt('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw] w-[900px] max-h-[90vh] p-0 gap-0">
        <DialogTitle className="sr-only">AI Assistant</DialogTitle>
        <DialogDescription className="sr-only">
          AI-powered assistant for bulk editing and find & replace operations
        </DialogDescription>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-xs text-gray-600">
                {selectedCount} {selectedCount === 1 ? 'record' : 'records'} selected • {contentType}
              </p>
            </div>
          </div>
          
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Info Cards */}
          

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 px-[0px] py-[-4px]">
              What would you like to do?
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Examples:&#10;• Update all meta descriptions to be SEO optimized&#10;• Replace '2023' with '2024' in all content&#10;• Set all items to Published status&#10;• Change meta titles to include brand name"
              className="min-h-[200px] text-sm resize-none"
              disabled={isProcessing}
              autoFocus
            />
          </div>

          {/* Execute Button */}
          <Button
            onClick={handleExecutePrompt}
            disabled={!prompt.trim() || isProcessing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2 h-11"
          >
            {isProcessing ? (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                AI is processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Execute Action
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
