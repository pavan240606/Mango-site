import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Badge } from './ui/badge';
import { 
  ArrowRight, 
  Settings2, 
  Save, 
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Input } from './ui/input';

interface FieldMappingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: {
    id: string;
    name: string;
  } | null;
  sourcePlatform: string;
  destPlatform: string;
}

export function FieldMappingConfigModal({ 
  isOpen, 
  onClose, 
  contentType,
  sourcePlatform,
  destPlatform
}: FieldMappingConfigModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!contentType) return null;

  // Mock data for field mapping
  const fields = [
    { source: 'title', sourceType: 'Text', dest: 'name', destType: 'Text', status: 'mapped' },
    { source: 'body_content', sourceType: 'RichText', dest: 'content', destType: 'RichText', status: 'mapped' },
    { source: 'published_at', sourceType: 'DateTime', dest: 'publish_date', destType: 'DateTime', status: 'mapped' },
    { source: 'author_id', sourceType: 'Reference', dest: 'author', destType: 'Reference', status: 'mapped' },
    { source: 'meta_title', sourceType: 'String', dest: 'seo_title', destType: 'String', status: 'mapped' },
    { source: 'custom_tags', sourceType: 'Array', dest: '', destType: '', status: 'unmapped' },
  ];

  const filteredFields = fields.filter(f => 
    f.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.dest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="modal-override w-[90vw] h-[90vh] max-w-[1000px] max-h-[800px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 border-b flex-row items-center justify-between space-y-0 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl">Field Mapping: {contentType.name}</DialogTitle>
              <DialogDescription>
                Configure how individual fields map between {sourcePlatform} and {destPlatform}.
              </DialogDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Auto-Map Fields
            </Button>
            <Button className="bg-teal-600 hover:bg-teal-700" size="sm">
              <Save className="h-3.5 w-3.5 mr-2" />
              Save Mapping
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 bg-gray-50 border-b flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search fields..." 
              className="pl-9 bg-white" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Badge variant="outline" className="bg-white">
              {fields.length} Fields Total
            </Badge>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[300px]">Source Field ({sourcePlatform})</TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[300px]">Destination Field ({destPlatform})</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Transformation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFields.map((field, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{field.source}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-mono">{field.sourceType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ArrowRight className="h-4 w-4 text-gray-300" />
                  </TableCell>
                  <TableCell>
                    {field.status === 'mapped' ? (
                      <div className="space-y-1">
                        <p className="font-medium text-teal-700">{field.dest}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-mono">{field.destType}</p>
                      </div>
                    ) : (
                      <Button variant="ghost" className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-dashed border-blue-200 w-full justify-start">
                        Select destination field...
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={field.status === 'mapped' ? 'default' : 'outline'} className={field.status === 'mapped' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'text-amber-600 border-amber-200'}>
                      {field.status === 'mapped' ? (
                        <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Mapped</span>
                      ) : (
                        <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Missing</span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="flex-1 flex items-center text-sm text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            5 of 6 fields successfully mapped.
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
