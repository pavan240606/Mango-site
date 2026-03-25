import { useState } from 'react';
import { Maximize2, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ExpandableTextCellProps {
  text: string;
  maxLength?: number;
}

export function ExpandableTextCell({ 
  text, 
  maxLength = 60
}: ExpandableTextCellProps) {
  const [showFullModal, setShowFullModal] = useState(false);

  // If text is short, just display it
  if (!text || text.length <= maxLength) {
    return <span className="text-sm text-gray-900">{text || '-'}</span>;
  }

  const truncatedText = text.slice(0, maxLength) + '...';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard');
  };

  const handleShowFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullModal(true);
  };

  return (
    <>
      <div className="group relative flex items-center gap-2">
        {/* Text content */}
        <div className="text-sm text-gray-900 truncate flex-1">
          {truncatedText}
        </div>

        {/* Maximize icon - shown on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleShowFull}
                >
                  <Maximize2 className="h-3.5 w-3.5 text-gray-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Expand full content</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Full content modal */}
      <Dialog open={showFullModal} onOpenChange={setShowFullModal}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Full Content</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                {text}
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  handleCopy(e);
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}