import { useEffect, useState } from 'react';
import { CheckCircle2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useFetchingStatus } from './FetchingStatusContext';
import { motion, AnimatePresence } from 'motion/react';

export function GlobalFetchingIndicator() {
  const { fetchingProgresses } = useFetchingStatus();
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  // Only show completed fetches
  const completedFetches = fetchingProgresses.filter(p => p.isComplete && !dismissedIds.has(p.id));

  // Auto-expand when fetch completes
  useEffect(() => {
    if (completedFetches.length > 0) {
      setIsExpanded(true);
    }
  }, [completedFetches.length]);

  // Trigger celebration animation when fetch completes
  useEffect(() => {
    if (completedFetches.length > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [completedFetches.length]);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  // Don't show anything if no completed fetches
  if (completedFetches.length === 0) {
    return null;
  }

  return (
    <>
      {/* Celebration Confetti Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  top: '50%',
                  left: '50%',
                  scale: 0,
                }}
                animate={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2,
                  ease: 'easeOut',
                  delay: Math.random() * 0.3,
                }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Notification Widget */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 w-[420px] shadow-2xl"
        >
          <div className="bg-white rounded-xl border-2 border-green-200 overflow-hidden">
            {/* Header */}
            <div
              className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-4 flex items-center justify-between cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center gap-3 text-white">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  <CheckCircle2 className="h-6 w-6" />
                </motion.div>
                <span className="font-semibold text-lg">Fetch Complete!</span>
                {completedFetches.length > 1 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold"
                  >
                    {completedFetches.length}
                  </motion.span>
                )}
              </div>
              <button className="text-white hover:bg-white/10 rounded p-1 transition-colors">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Content - Completed Fetches */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-[400px] overflow-y-auto">
                    {completedFetches.map((fetch) => (
                      <motion.div
                        key={fetch.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 100 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="p-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                type: 'spring', 
                                stiffness: 200, 
                                damping: 10,
                                delay: 0.1 
                              }}
                              className="relative"
                            >
                              <CheckCircle2 className="h-7 w-7 text-green-600 flex-shrink-0" />
                              {/* Pulsing ring effect */}
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-green-600"
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ 
                                  repeat: 2, 
                                  duration: 0.8,
                                  ease: 'easeOut'
                                }}
                              />
                            </motion.div>
                            <div className="flex-1">
                              <motion.div
                                className="font-semibold text-gray-900 mb-1 text-base"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                {fetch.contentType}
                              </motion.div>
                              <motion.div
                                className="text-sm text-green-700 font-medium flex items-center gap-1"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                <span className="text-green-600">✓</span> Successfully fetched {fetch.total.toLocaleString()} records
                              </motion.div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDismiss(fetch.id)}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded p-1.5 transition-all ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}