import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { useIntegration } from './IntegrationContext';
import { useUser } from './UserContext';
import confetti from 'canvas-confetti';

interface CoachMarkStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
  navigateTo?: { page: string; tab?: string };
}

const steps: CoachMarkStep[] = [
  {
    id: 'profile',
    title: 'Welcome to Smuves! 👋',
    description: 'Let\'s start by setting up your profile. Click on your profile icon in the top right corner to access your account settings.',
    targetSelector: '[data-coach-profile]',
    position: 'bottom',
    action: 'Click your profile icon'
  },
  {
    id: 'connection-tab',
    title: 'Connection Status',
    description: 'This is where you connect Smuves to your tools. You need to connect both HubSpot and Google Sheets to unlock all features.',
    targetSelector: '[data-coach-connection-tab]',
    position: 'bottom',
    action: 'Go to Connection Status',
    navigateTo: { page: 'profile', tab: 'connection' }
  },
  {
    id: 'hubspot',
    title: 'Connect HubSpot',
    description: 'HubSpot is where all your content lives. Connect it so Smuves can help you edit and export your pages, blog posts, and more.',
    targetSelector: '[data-coach-hubspot]',
    position: 'right',
    action: 'Connect HubSpot'
  },
  {
    id: 'google-sheets',
    title: 'Connect Google Sheets',
    description: 'Google Sheets lets you export your content to spreadsheets for easy editing. Connect it to enable bulk editing features.',
    targetSelector: '[data-coach-google-sheets]',
    position: 'right',
    action: 'Connect Google Sheets'
  },
  {
    id: 'password',
    title: 'Set Your Password',
    description: 'Finally, let\'s secure your account with a password. This will allow you to sign in with email and password in addition to Google OAuth.',
    targetSelector: '[data-coach-password]',
    position: 'right',
    action: 'Set Password',
    navigateTo: { page: 'profile', tab: 'profile' }
  }
];

interface CoachMarkProps {
  onComplete: () => void;
  onDismiss: () => void;
  onNavigate?: (page: string, tab?: string) => void;
}

export function CoachMark({ onComplete, onDismiss, onNavigate }: CoachMarkProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { hubSpotConnected, googleSheetsConnected } = useIntegration();
  const { hasPassword } = useUser();

  const allComplete = hubSpotConnected && googleSheetsConnected && hasPassword;

  useEffect(() => {
    if (allComplete && !showCompletion) {
      setShowCompletion(true);
      setTimeout(() => {
        onComplete();
      }, 4000);
    }
  }, [allComplete, showCompletion, onComplete]);

  useEffect(() => {
    const updatePosition = () => {
      const step = steps[currentStep];
      if (!step) return;
      
      const element = document.querySelector(step.targetSelector);
      if (element) {
        // Scroll element into view - ensure it's centered and visible
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
        
        // Wait a bit for scroll to complete before getting bounding rect
        setTimeout(() => {
          setTargetRect(element.getBoundingClientRect());
        }, 100);
      } else {
        setTargetRect(null);
      }
    };

    // Initial update with longer delay for step 5 to allow DOM to fully render
    const initialDelay = currentStep === 4 ? 500 : 100;
    const initialTimeout = setTimeout(updatePosition, initialDelay);
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const observer = new MutationObserver(updatePosition);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    
    // More aggressive polling for step 5 (password step)
    const pollingInterval = currentStep === 4 ? 50 : 100; // Poll every 50ms for step 5
    const interval = setInterval(updatePosition, pollingInterval);

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = steps[currentStep + 1];
      
      if (nextStep.navigateTo && onNavigate) {
        onNavigate(nextStep.navigateTo.page, nextStep.navigateTo.tab);
        
        // Add a longer delay to allow DOM to fully update after navigation
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 800); // Increased to 800ms for reliable tab content rendering
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Last step - trigger confetti and show welcome message
      // Fire confetti from multiple angles (slower speed)
      const duration = 6000; // Doubled from 3000 to slow it down
      const end = Date.now() + duration;

      const fireConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.6 },
          colors: ['#14b8a6', '#0d9488', '#2dd4bf', '#5eead4'],
          ticks: 400, // Increased from default 200 to make confetti fall slower
          gravity: 0.5 // Reduced gravity to make confetti float longer
        });
      };

      // Fire initial burst
      fireConfetti();
      
      // Fire additional bursts (slower interval)
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#14b8a6', '#0d9488', '#2dd4bf', '#5eead4'],
          ticks: 400,
          gravity: 0.5
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#14b8a6', '#0d9488', '#2dd4bf', '#5eead4'],
          ticks: 400,
          gravity: 0.5
        });
      }, 500); // Doubled from 250ms to 500ms

      // Show welcome message
      setShowWelcome(true);
      
      // Close after animation (increased to match confetti duration)
      setTimeout(() => {
        setShowWelcome(false);
        onComplete();
      }, 6000); // Doubled from 3000 to match confetti duration
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getTooltipPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%', opacity: 0 };
    
    const padding = 20;
    const tooltipWidth = 400;
    const tooltipHeight = 280;
    const viewportPadding = 16;
    
    // Calculate available space in all directions
    const spaceRight = window.innerWidth - targetRect.right - padding;
    const spaceLeft = targetRect.left - padding;
    const spaceBottom = window.innerHeight - targetRect.bottom - padding;
    const spaceTop = targetRect.top - padding;
    
    let position: any = {};
    let bestPosition = 'right'; // Default
    
    // Determine the best position based on available space
    const positions = [
      { name: 'right', space: spaceRight, needsWidth: true },
      { name: 'left', space: spaceLeft, needsWidth: true },
      { name: 'bottom', space: spaceBottom, needsWidth: false },
      { name: 'top', space: spaceTop, needsWidth: false }
    ];
    
    // Find position with most space
    for (const pos of positions) {
      const requiredSpace = pos.needsWidth ? tooltipWidth : tooltipHeight;
      if (pos.space >= requiredSpace + viewportPadding) {
        bestPosition = pos.name;
        break;
      }
    }
    
    // If no ideal position, use the one with most space
    if (!bestPosition) {
      const maxSpace = Math.max(spaceRight, spaceLeft, spaceBottom, spaceTop);
      if (maxSpace === spaceRight) bestPosition = 'right';
      else if (maxSpace === spaceBottom) bestPosition = 'bottom';
      else if (maxSpace === spaceLeft) bestPosition = 'left';
      else bestPosition = 'top';
    }
    
    // Position based on best available space
    switch (bestPosition) {
      case 'bottom':
        const centerX = targetRect.left + targetRect.width / 2;
        let leftPos = centerX - tooltipWidth / 2;
        
        // Keep within viewport
        if (leftPos < viewportPadding) leftPos = viewportPadding;
        if (leftPos + tooltipWidth > window.innerWidth - viewportPadding) {
          leftPos = window.innerWidth - tooltipWidth - viewportPadding;
        }
        
        position = {
          top: `${targetRect.bottom + padding}px`,
          left: `${leftPos}px`,
        };
        break;
        
      case 'top':
        const topCenterX = targetRect.left + targetRect.width / 2;
        let topLeftPos = topCenterX - tooltipWidth / 2;
        
        // Keep within viewport
        if (topLeftPos < viewportPadding) topLeftPos = viewportPadding;
        if (topLeftPos + tooltipWidth > window.innerWidth - viewportPadding) {
          topLeftPos = window.innerWidth - tooltipWidth - viewportPadding;
        }
        
        position = {
          bottom: `${window.innerHeight - targetRect.top + padding}px`,
          left: `${topLeftPos}px`,
        };
        break;
        
      case 'left':
        const centerY = targetRect.top + targetRect.height / 2;
        let topPos = centerY - tooltipHeight / 2;
        
        // Keep within viewport
        if (topPos < viewportPadding) topPos = viewportPadding;
        if (topPos + tooltipHeight > window.innerHeight - viewportPadding) {
          topPos = window.innerHeight - tooltipHeight - viewportPadding;
        }
        
        position = {
          top: `${topPos}px`,
          right: `${window.innerWidth - targetRect.left + padding}px`,
        };
        break;
        
      case 'right':
      default:
        const rightCenterY = targetRect.top + targetRect.height / 2;
        let rightTopPos = rightCenterY - tooltipHeight / 2;
        
        // Keep within viewport
        if (rightTopPos < viewportPadding) rightTopPos = viewportPadding;
        if (rightTopPos + tooltipHeight > window.innerHeight - viewportPadding) {
          rightTopPos = window.innerHeight - tooltipHeight - viewportPadding;
        }
        
        position = {
          top: `${rightTopPos}px`,
          left: `${targetRect.right + padding}px`,
        };
        break;
    }
    
    // Store the actual position used for arrow calculation
    position.actualPosition = bestPosition;
    
    return position;
  };

  const getArrowPosition = () => {
    if (!targetRect) return { display: 'none' };
    
    const tooltipPos = getTooltipPosition();
    const actualPosition = tooltipPos.actualPosition || 'right';
    
    // Arrow always points TO the target from the tooltip
    switch (actualPosition) {
      case 'bottom':
        // Tooltip is below, arrow points up
        return {
          top: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '-2px -2px 2px rgba(0,0,0,0.05)'
        };
        
      case 'top':
        // Tooltip is above, arrow points down
        return {
          bottom: '-6px',
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '2px 2px 2px rgba(0,0,0,0.05)'
        };
        
      case 'left':
        // Tooltip is on left, arrow points right
        return {
          right: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: '2px -2px 2px rgba(0,0,0,0.05)'
        };
        
      case 'right':
      default:
        // Tooltip is on right, arrow points left
        return {
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: '-2px 2px 2px rgba(0,0,0,0.05)'
        };
    }
  };

  const step = steps[currentStep];

  // Welcome to Smuves message with confetti
  if (showWelcome) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* White background that fades in and out */}
          <div className="absolute inset-0 bg-white" />
          
          {/* Welcome message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-center relative z-10"
          >
            <motion.h1
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              className="text-7xl font-bold text-teal-600 mb-4"
              style={{
                textShadow: '0 4px 20px rgba(20, 184, 166, 0.5)'
              }}
            >
              Welcome to Smuves! 🎉
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl text-gray-700"
            >
              Let's get started on your content journey
            </motion.p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (showCompletion) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mb-6"
          >
            <Check className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-900 mb-3"
          >
            🎉 Onboarding Complete!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-6"
          >
            You're all set! You can now use Smuves to manage your HubSpot content with ease.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Sparkles className="h-8 w-8 text-teal-500 mx-auto animate-pulse" />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={onDismiss}>
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>
      
      {targetRect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute pointer-events-none"
          style={{
            top: `${targetRect.top - 8}px`,
            left: `${targetRect.left - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
            border: '3px solid rgb(20, 184, 166)',
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(20, 184, 166, 0.3), 0 0 20px rgba(20, 184, 166, 0.5)',
            zIndex: 10000,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      )}
      
      {/* Always show tooltip, even if target not found */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute pointer-events-auto bg-white rounded-xl shadow-2xl w-[400px] z-[10001]"
          style={targetRect ? getTooltipPosition() : {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {targetRect && (
            <div 
              className="absolute w-3 h-3 bg-white transform rotate-45 z-0"
              style={getArrowPosition()}
            />
          )}
          
          <div className="relative z-10 bg-gradient-to-br from-teal-500 to-teal-600 text-white p-4 rounded-t-xl">
            <button
              onClick={onDismiss}
              className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{step.title}</h3>
            </div>
          </div>
          
          <div className="relative z-10 p-4 bg-white rounded-b-xl">
            {!targetRect && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                <p className="text-xs text-yellow-800">
                  ⚠️ Target element not found. Make sure you're on the right page.
                </p>
              </div>
            )}
            
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {step.description}
            </p>
            
            {step.action && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-teal-900 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  {step.action}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-gray-600"
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentStep 
                        ? 'w-6 bg-teal-500' 
                        : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                size="sm"
                onClick={handleNext}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}