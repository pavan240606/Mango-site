import { X, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface FindResult {
  id: string;
  itemName: string;
  matchContext: string;
  fullMatch: string;
  matchCount: number;
}

interface FindResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  findResults: FindResult[];
  findText: string;
  selectedColumn: string;
  getTotalMatches: () => number;
}

export function FindResultsModal({
  isOpen,
  onClose,
  findResults,
  findText,
  selectedColumn,
  getTotalMatches
}: FindResultsModalProps) {
  const highlightText = (text: string, searchText: string) => {
    if (!searchText) return text;
    const regex = new RegExp(`(${searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => (
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold">Find Results</h2>
            <p className="text-sm text-gray-600 mt-1">
              Found {findResults.length} results for "{findText}" in {selectedColumn}. Total matches: {getTotalMatches()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col modal-scrollable p-6 pt-0">
          {findResults.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="border rounded-lg overflow-hidden flex-1">
                <div className="h-full overflow-y-auto w-full">
                  <Table className="w-full" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
                    <TableHeader className="sticky top-0 bg-gray-50 z-10">
                      <TableRow>
                        <TableHead className="text-center w-1/3 px-4 py-3">Item Name</TableHead>
                        <TableHead className="text-center w-2/3 px-4 py-3">Match Context</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {findResults.map((result) => (
                        <TableRow key={result.id} className="hover:bg-gray-50">
                          <TableCell className="text-center font-medium text-sm px-4 py-3 align-top">
                            <div className="break-words hyphens-auto">
                              {result.itemName}
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-sm px-4 py-3 align-top">
                            <div className="break-words hyphens-auto">
                              {highlightText(result.matchContext, findText)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 flex-1 flex flex-col justify-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No results found for "{findText}" in {selectedColumn}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t flex-shrink-0">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}