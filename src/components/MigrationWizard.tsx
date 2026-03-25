import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  CheckCircle2, 
  Play,
  X,
  Plus,
  ArrowLeft,
  Search,
  Layout,
  Layers,
  Image as ImageIcon,
  Check,
  Loader2,
  Database,
  ArrowRightCircle,
  ArrowRight,
  Link2,
  Settings,
  Zap,
  ShieldCheck,
  ArrowRightLeft,
  Building2
} from 'lucide-react';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';

interface WizardProps {
  onClose: () => void;
  initialData?: any;
}

const STEPS = [
  { id: 1, name: 'Start' },
  { id: 2, name: 'Platforms' },
  { id: 3, name: 'Fetching' },
  { id: 4, name: 'Map Collections' },
  { id: 5, name: 'Link Fields' },
  { id: 6, name: 'Launch' },
  { id: 7, name: 'Execution' },
  { id: 8, name: 'Success' }
];

export function MigrationWizard({ onClose, initialData }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;
  
  const [formData, setFormData] = useState(initialData || {
    sourceCmsId: '',
    destinationCmsId: '',
    contentTypes: [
      { id: '1', source: 'Blog Post', destination: 'Post', entries: 450, status: 'mapped' },
      { id: '2', source: 'Author', destination: 'Person', entries: 12, status: 'mapped' },
      { id: '3', source: 'Category', destination: '', entries: 25, status: 'unmapped' },
      { id: '4', source: 'Landing Page', destination: '', entries: 110, status: 'suggestion' },
    ] as any[],
    fieldMappings: [
      { id: 'f1', source: 'post_title', sourceType: 'Short Text', sourceSample: 'Hello World', destination: 'title (Short Text)' },
      { id: 'f2', source: 'post_content', sourceType: 'Rich Text', sourceSample: '<p>Content here...</p>', destination: 'body (Rich Text)' },
      { id: 'f3', source: 'post_date', sourceType: 'Date', sourceSample: '2026-01-01', destination: 'publishedAt (DateTime)' },
      { id: 'f4', source: 'meta_description', sourceType: 'Long Text', sourceSample: 'A long description...', destination: 'seoDescription (Short Text)' },
      { id: 'f5', source: 'featured_image', sourceType: 'Asset', sourceSample: 'img_01.jpg', destination: 'hero (Asset)' },
    ] as any[],
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Start onNext={nextStep} />;
      case 2: return <Step2Platforms data={formData} setData={setFormData} onNext={nextStep} />;
      case 3: return <Step3Fetching data={formData} onNext={nextStep} />;
      case 4: return <Step4SourceMapping data={formData} setData={setFormData} onNext={nextStep} onBack={prevStep} />;
      case 5: return <Step5FieldMapping data={formData} setData={setFormData} onNext={nextStep} onBack={prevStep} />;
      case 6: return <Step6Launch data={formData} onNext={nextStep} onBack={prevStep} />;
      case 7: return <Step7Execution data={formData} onNext={nextStep} onClose={onClose} />;
      case 8: return <Step8Success onClose={onClose} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative font-sans">
      {/* Header */}
      <div className="h-[72px] border-b border-gray-100 flex items-center justify-between px-8 bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-[#10B981] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <RefreshCw className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-black text-lg uppercase tracking-tight leading-none">
              {STEPS.find(s => s.id === currentStep)?.name}
            </span>
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
              STEP {currentStep} OF {totalSteps}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {currentStep > 1 && currentStep < 7 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PROGRESS</span>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 w-6 rounded-full transition-all duration-300 ${
                      i + 1 <= currentStep ? 'bg-[#10B981]' : 'bg-gray-100'
                    }`} 
                  />
                ))}
              </div>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full h-9 w-9">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer (Conditional) */}
      {currentStep !== 1 && currentStep !== 3 && currentStep !== 7 && currentStep !== 8 && (
        <div className="h-20 border-t border-gray-100 bg-white flex items-center justify-between px-12 shrink-0">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={currentStep === 2}
            className="h-12 px-6 rounded-xl font-bold flex items-center gap-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-0"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep}
            className="bg-[#10B981] hover:bg-[#059669] text-white h-12 px-10 rounded-xl font-black flex items-center gap-2 shadow-xl shadow-teal-500/10 transition-all active:scale-95"
          >
            {currentStep === 6 ? 'Launch Migration' : 'Continue'}
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// --- STEP COMPONENTS ---

function Step1Start({ onNext }: any) {
  return (
    <div className="max-w-4xl mx-auto py-12 text-center space-y-10">
      <div className="flex flex-col items-center space-y-6">
        <div className="h-24 w-24 bg-emerald-50 rounded-3xl flex items-center justify-center text-[#10B981] shadow-inner relative">
          <Database className="h-12 w-12" />
          <div className="absolute -top-2 -right-2 h-8 w-8 bg-[#10B981] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <Plus className="h-4 w-4 stroke-[3]" />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">CMS Content Migration</h1>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Move your content types, entries, and assets between CMS platforms with full structural integrity and zero data loss.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {[
          { icon: Zap, title: 'Real-time Sync', desc: 'Transfer thousands of entries in minutes with multi-threaded processing.' },
          { icon: ShieldCheck, title: 'Safe Simulation', desc: 'Test your mapping with sample data before running the full migration.' },
          { icon: ArrowRightLeft, title: 'Schema Mapping', desc: 'Intelligently map fields between different content structures.' }
        ].map((feat, i) => (
          <Card key={i} className="p-6 border-none bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${i === 0 ? 'bg-amber-50 text-amber-500' : i === 1 ? 'bg-blue-50 text-blue-500' : 'bg-purple-50 text-purple-500'}`}>
              <feat.icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{feat.title}</h3>
            <p className="text-xs text-gray-500 font-medium leading-normal">{feat.desc}</p>
          </Card>
        ))}
      </div>

      <div className="pt-8">
        <Button 
          onClick={onNext}
          className="bg-[#10B981] hover:bg-[#059669] text-white h-16 px-16 rounded-2xl font-black text-xl shadow-2xl shadow-teal-500/30 transition-all active:scale-95 group"
        >
          Start New Migration
          <ChevronRight className="h-6 w-6 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

function Step2Platforms({ data, setData, onNext }: any) {
  const sourceOptions = [
    { id: 'wp', name: 'WP Blog Production (wordpress)' },
    { id: 'hubspot', name: 'HubSpot Marketing (hubspot)' },
  ];

  const destinationOptions = [
    { id: 'contentful', name: 'Contentful Master (contentful)' },
    { id: 'sanity', name: 'Sanity Production (sanity)' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Source & Destination</h2>
        <p className="text-gray-500 font-medium">Select the content ecosystems you want to bridge.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center font-black text-sm">1</div>
              <h3 className="font-black text-gray-900 text-lg">Source CMS</h3>
            </div>
            {data.sourceCmsId && (
              <div className="flex items-center gap-1.5 text-[#10B981]">
                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Connected</span>
              </div>
            )}
          </div>
          
          <Select value={data.sourceCmsId} onValueChange={(v) => setData({ ...data, sourceCmsId: v })}>
            <SelectTrigger className="h-14 border-2 border-gray-100 bg-white rounded-xl px-4 text-base font-bold text-gray-900 shadow-sm focus:ring-0 focus:border-[#10B981]/30">
              <SelectValue placeholder="Select source CMS" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 p-1">
              {sourceOptions.map(opt => (
                <SelectItem key={opt.id} value={opt.id} className="py-3 font-bold rounded-lg text-sm">{opt.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center font-black text-sm">2</div>
              <h3 className="font-black text-gray-900 text-lg">Destination CMS</h3>
            </div>
            {data.destinationCmsId && (
              <div className="flex items-center gap-1.5 text-[#10B981]">
                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Connected</span>
              </div>
            )}
          </div>
          
          <Select value={data.destinationCmsId} onValueChange={(v) => setData({ ...data, destinationCmsId: v })}>
            <SelectTrigger className="h-14 border-2 border-gray-100 bg-white rounded-xl px-4 text-base font-bold text-gray-900 shadow-sm focus:ring-0 focus:border-[#10B981]/30">
              <SelectValue placeholder="Select destination CMS" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 p-1">
              {destinationOptions.map(opt => (
                <SelectItem key={opt.id} value={opt.id} className="py-3 font-bold rounded-lg text-sm">{opt.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function Step3Fetching({ data, onNext }: any) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onNext, 1200);
          return 100;
        }
        return p + 1.5;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-12">
      <div className="relative flex justify-center">
        <div className="h-32 w-32 flex items-center justify-center relative">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
            <circle 
              cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="6" fill="transparent" 
              strokeDasharray={289} 
              strokeDashoffset={289 - (289 * progress) / 100}
              className="text-[#10B981] transition-all duration-300 ease-linear rounded-full" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 bg-white rounded-2xl shadow-lg border border-gray-50 flex items-center justify-center">
              <RefreshCw className="h-6 w-6 text-[#10B981] animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Fetching Content Structure</h2>
        <p className="text-gray-500 font-medium">Analyzing content types and schemas from your source...</p>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        {[
          { label: 'Connecting to API', status: progress > 20 ? 'done' : 'active' },
          { label: 'Downloading Schema', status: progress > 60 ? 'done' : progress > 20 ? 'active' : 'idle' },
          { label: 'Parsing Field Definitions', status: progress > 90 ? 'done' : progress > 60 ? 'active' : 'idle' }
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <span className={`text-xs font-bold ${s.status === 'done' ? 'text-gray-400' : 'text-gray-700'}`}>{s.label}</span>
            {s.status === 'done' ? <CheckCircle2 className="h-4 w-4 text-[#10B981] fill-[#10B981] text-white" /> : 
             s.status === 'active' ? <Loader2 className="h-4 w-4 text-[#10B981] animate-spin" /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step4SourceMapping({ data, setData, onNext }: any) {
  const handleMappingChange = (id: string, value: string) => {
    setData({
      ...data,
      contentTypes: data.contentTypes.map((ct: any) => 
        ct.id === id ? { ...ct, destination: value, status: value ? 'mapped' : 'unmapped' } : ct
      )
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Map Your Collections</h2>
        <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
          Define the structural alignment between your source content types and your destination architecture.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_280px_100px] px-8 mb-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Type</span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4">Destination Type</span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</span>
      </div>

      <div className="grid gap-4">
        {data.contentTypes.map((type: any) => (
          <Card key={type.id} className="p-1 border-none bg-white shadow-sm overflow-hidden rounded-2xl">
            <div className="flex items-center p-5 gap-8">
              <div className="flex-1 flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">{type.source}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{type.entries} Entries Found</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ArrowRight className="h-4 w-4 text-gray-200" />
                <div className="w-[280px]">
                  <Select value={type.destination} onValueChange={(v) => handleMappingChange(type.id, v)}>
                    <SelectTrigger className={`h-12 border-2 rounded-xl px-4 text-sm font-bold focus:ring-0 ${
                      type.destination ? 'border-[#10B981] bg-emerald-50/10' : 'border-gray-50 bg-gray-50/30 text-gray-400'
                    }`}>
                      <SelectValue placeholder="Select target type..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 p-2">
                      <SelectItem value="Post" className="py-2.5 font-bold rounded-lg mb-1">Post</SelectItem>
                      <SelectItem value="Person" className="py-2.5 font-bold rounded-lg mb-1">Person</SelectItem>
                      <SelectItem value="Category" className="py-2.5 font-bold rounded-lg mb-1">Category</SelectItem>
                      <SelectItem value="Landing Page" className="py-2.5 font-bold rounded-lg">Landing Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="w-24 flex justify-end">
                {type.destination ? (
                  <Badge className="bg-emerald-50 text-[#10B981] border-emerald-100 px-3 py-1 rounded-lg font-black text-[10px] uppercase">Mapped</Badge>
                ) : (
                  <Badge className="bg-gray-50 text-gray-400 border-gray-100 px-3 py-1 rounded-lg font-black text-[10px] uppercase">Pending</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Step5FieldMapping({ data, setData, onNext }: any) {
  const destinationFieldOptions = [
    'title (Short Text)',
    'body (Rich Text)',
    'publishedAt (DateTime)',
    'seoDescription (Short Text)',
    'hero (Asset)',
    'slug (Short Text)',
    'author (Reference)',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Synchronize Your Fields</h2>
        <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto italic">
          Map specific attributes from your source entries to the target schema to ensure data precision.
        </p>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1.5fr_0.1fr_1.5fr] px-8 mb-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Field</span>
        <span></span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destination Field</span>
      </div>

      {/* Field Mapping Rows */}
      <div className="space-y-3">
        {data.fieldMappings.map((field: any) => (
          <Card key={field.id} className="p-6 border-none bg-white shadow-sm hover:shadow-md transition-all rounded-2xl group">
            <div className="grid grid-cols-[1.5fr_0.1fr_1.5fr] items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    <Database className="h-4 w-4" />
                  </div>
                  <h4 className="font-black text-gray-900 text-base">{field.source}</h4>
                </div>
                <p className="text-[11px] text-gray-400 font-medium italic pl-11">
                  {field.sourceType} • Sample: <span className="text-gray-600 font-bold not-italic">"{field.sourceSample}"</span>
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowRightCircle className="h-5 w-5 text-gray-200 group-hover:text-[#10B981] transition-colors" />
              </div>

              <div className="px-2">
                <Select defaultValue={field.destination}>
                  <SelectTrigger className="h-12 border-2 border-gray-100 bg-gray-50/20 rounded-xl px-4 text-sm font-bold text-gray-700 focus:ring-0 focus:border-[#10B981]/30">
                    <SelectValue placeholder="Select field..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-100 p-1">
                    {destinationFieldOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="py-2 text-xs font-bold rounded-md">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Step6Launch({ data, onNext }: any) {
  return (
    <div className="max-w-4xl mx-auto py-12 flex flex-col items-center text-center space-y-12">
      <div className="relative">
        <div className="h-32 w-32 bg-emerald-50 rounded-[40px] flex items-center justify-center text-[#10B981] shadow-2xl shadow-teal-500/10 rotate-12">
          <Zap className="h-16 w-16 fill-[#10B981] text-[#10B981]" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-gray-50">
          <ShieldCheck className="h-7 w-7 text-[#10B981]" />
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Ready for Launch</h2>
        <p className="text-lg text-gray-500 font-medium leading-relaxed">
          Configuration complete. You are about to migrate <span className="text-gray-900 font-bold">1,245 entries</span> across <span className="text-gray-900 font-bold">4 collections</span> with full asset linking.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {[
          { label: 'Source', value: 'HubSpot', icon: Database },
          { label: 'Target', value: 'Contentful', icon: Layout },
          { label: 'Mapped', value: '4/4 Types', icon: Layers },
          { label: 'Fields', value: '18 Linked', icon: Settings }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-2">
            <stat.icon className="h-5 w-5 text-gray-300" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</span>
            <span className="font-bold text-gray-900 text-sm">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md p-6 bg-blue-50/50 border border-blue-100 rounded-[32px] flex items-start gap-4 text-left">
        <div className="h-8 w-8 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-blue-500/20 font-black text-xs">i</div>
        <p className="text-xs text-blue-700 font-medium leading-relaxed italic">
          Running this process will create new entries in your target CMS. Existing entries with matching IDs will be updated by default.
        </p>
      </div>
    </div>
  );
}

function Step7Execution({ data, onNext, onClose }: any) {
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onNext, 1000);
          return 100;
        }
        return p + 2.5;
      });
    }, 150);
    return () => clearInterval(timer);
  }, [onNext]);

  const runInBackground = async () => {
    setIsSaving(true);
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-2abbdb9a/migrations/active`;
      console.log(`[MigrationWizard] Starting background migration at: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          title: 'Full CMS Migration',
          progress: progress,
          current: Math.floor(1245 * (progress / 100)),
          total: 1245,
          sourceCmsId: data.sourceCmsId,
          destinationCmsId: data.destinationCmsId,
          status: 'running',
          subtitle: 'Processing Records'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      toast.success('Migration is now running in the background');
      onClose();
    } catch (error) {
      console.error('[MigrationWizard] Background migration failed:', error);
      toast.error('Failed to run in background. Check connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-12">
      <div className="flex flex-col items-center space-y-6">
        <div className="h-24 w-24 bg-emerald-50 rounded-[40px] flex items-center justify-center text-[#10B981] relative">
          <RefreshCw className="h-12 w-12 animate-spin" />
          <div className="absolute -top-1 -right-1 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md border border-emerald-100">
            <Play className="h-4 w-4 fill-[#10B981] text-[#10B981]" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Executing Migration</h2>
          <p className="text-sm text-gray-500 font-medium italic">Synchronizing 1,245 records with destination schema...</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-end px-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Global Sync</span>
            <span className="text-lg font-black text-[#10B981]">{Math.floor(progress)}%</span>
          </div>
          <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-1 border border-gray-50 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-[#10B981] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            />
          </div>
          <div className="flex justify-between px-1">
            <p className="text-[10px] text-gray-400 font-bold italic truncate max-w-[70%]">Processing: "Content Architecture in 2026"</p>
            <p className="text-[10px] text-[#10B981] font-black tracking-widest">{Math.floor(1245 * (progress/100))} / 1,245</p>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            variant="outline" 
            onClick={runInBackground}
            disabled={isSaving}
            className="h-14 px-10 rounded-2xl font-black border-2 border-gray-100 text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-white transition-all flex items-center gap-3 shadow-sm"
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
            Run in background
            <ArrowRightCircle className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Step8Success({ onClose }: any) {
  const breakdown = [
    { type: 'Blog Post', migrated: 450, assets: 1240, status: 'Success' },
    { type: 'Author', migrated: 12, assets: 45, status: 'Success' },
    { type: 'Category', migrated: 25, assets: 0, status: 'Success' },
    { type: 'Landing Page', migrated: 110, assets: 560, status: 'Success' },
    { type: 'Asset Metadata', migrated: 648, assets: 2047, status: 'Success' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 flex flex-col items-center text-center space-y-10">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-24 w-24 bg-[#10B981] rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-teal-500/20">
          <Check className="h-12 w-12 stroke-[4]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Migration Successfully Completed</h2>
          <p className="text-lg text-gray-500 font-medium italic">All selected records and assets have been successfully transferred.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="p-6 border-none bg-white shadow-sm rounded-3xl text-center space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Records</p>
          <p className="text-3xl font-black text-[#10B981]">1,245</p>
          <div className="flex items-center justify-center gap-1 mt-1 text-[#10B981]">
            <CheckCircle2 className="h-3 w-3 fill-[#10B981] text-white" />
            <span className="text-[10px] font-bold">100% Success</span>
          </div>
        </Card>
        
        <Card className="p-6 border-none bg-white shadow-sm rounded-3xl text-center space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assets Transferred</p>
          <p className="text-3xl font-black text-indigo-500">3,892</p>
          <div className="flex items-center justify-center gap-1 mt-1 text-indigo-500">
            <ImageIcon className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">8.4 GB Total</span>
          </div>
        </Card>

        <Card className="p-6 border-none bg-white shadow-sm rounded-3xl text-center space-y-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Execution Time</p>
          <p className="text-3xl font-black text-gray-900">12m 45s</p>
          <div className="flex items-center justify-center gap-1 mt-1 text-gray-400">
            <RefreshCw className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg 1.2s / record</span>
          </div>
        </Card>
      </div>

      {/* Breakdown Table */}
      <Card className="w-full max-w-4xl border-none bg-white shadow-sm overflow-hidden rounded-[32px]">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-gray-50/50 border-b border-gray-100 px-8 py-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Content Type</span>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Migrated</span>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Assets</span>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</span>
        </div>
        <div className="divide-y divide-gray-50">
          {breakdown.map((item, i) => (
            <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] px-8 py-5 items-center hover:bg-gray-50/20 transition-colors">
              <span className="font-bold text-gray-900 text-sm">{item.type}</span>
              <span className="text-center font-bold text-gray-700 text-sm">{item.migrated.toLocaleString()}</span>
              <span className="text-center font-bold text-gray-500 text-sm">{item.assets.toLocaleString()}</span>
              <div className="flex justify-end">
                <div className="flex items-center gap-1.5 text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span className="text-[10px] font-black uppercase tracking-wider">{item.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="pt-4 pb-8">
        <Button 
          onClick={onClose}
          className="bg-gray-900 hover:bg-black text-white h-16 px-20 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
