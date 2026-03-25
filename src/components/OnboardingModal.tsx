import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  authMethod: string;
  initialStep?: 'hubspot' | 'password' | 'sheets' | null;
  onStepComplete?: (step: 'hubspot' | 'password' | 'sheets') => void;
}

export function OnboardingModal({ isOpen, onClose, authMethod, initialStep, onStepComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1); // Steps 1-4 represent: HubSpot, Password, Google Sheets, Success
  const [showPassword, setShowPassword] = useState(false);

  // Step 1 (HubSpot): HubSpot connection
  const [hubspotToken, setHubspotToken] = useState('');
  
  // Step 2 (Password): Password (for magic link/sign-in users)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Step 3 (Google Sheets): Google Sheets
  const [sheetsConnected, setSheetsConnected] = useState(false);

  const handleHubSpotConnect = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('HubSpot connected successfully!');
    if (onStepComplete) {
      onStepComplete('hubspot');
    }
    setTimeout(() => {
      // Skip password step if user signed up with password
      if (authMethod === 'sign-up') {
        setCurrentStep(3); // Skip to Google Sheets
      } else {
        setCurrentStep(2); // Set password for magic link/sign in users
      }
    }, 1000);
  };

  const handleHubSpotOAuth = () => {
    toast.success('Connecting via HubSpot OAuth...');
    setTimeout(() => {
      toast.success('HubSpot connected successfully!');
      if (onStepComplete) {
        onStepComplete('hubspot');
      }
      setTimeout(() => {
        if (authMethod === 'sign-up') {
          setCurrentStep(3);
        } else {
          setCurrentStep(2);
        }
      }, 1000);
    }, 1000);
  };

  const handlePasswordSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    toast.success('Password set successfully!');
    if (onStepComplete) {
      onStepComplete('password');
    }
    setTimeout(() => {
      setCurrentStep(3); // Move to Google Sheets
    }, 1000);
  };

  const handleSkipPassword = () => {
    toast.success('Skipping password setup');
    setTimeout(() => {
      setCurrentStep(3); // Move to Google Sheets
    }, 500);
  };

  const handleGoogleSheetsConnect = () => {
    toast.success('Connecting Google Sheets...');
    setTimeout(() => {
      setSheetsConnected(true);
      toast.success('Google Sheets connected successfully!');
      if (onStepComplete) {
        onStepComplete('sheets');
      }
      setTimeout(() => {
        onClose(); // Close modal after completing Google Sheets
      }, 1000);
    }, 1000);
  };

  useEffect(() => {
    if (initialStep) {
      switch (initialStep) {
        case 'hubspot':
          setCurrentStep(1);
          break;
        case 'password':
          setCurrentStep(2);
          break;
        case 'sheets':
          setCurrentStep(3);
          break;
        default:
          setCurrentStep(1);
      }
    }
  }, [initialStep]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[90vw] !h-[90vh] !max-w-[90vw] !max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">
          {currentStep === 1 && 'Connect Your HubSpot Account'}
          {currentStep === 2 && 'Set Password'}
          {currentStep === 3 && 'Connect Google Sheets'}
          {currentStep === 4 && 'Setup Complete'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Complete your account setup
        </DialogDescription>

        {/* Step 1: HubSpot Connection */}
        {currentStep === 1 && (
          <div className="p-8 px-[28px] py-[241px]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 px-[0px] py-[-33px]"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl mb-2">Connect Your HubSpot Account</h2>
            
            <form onSubmit={handleHubSpotConnect} className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.5 2h-13A2.5 2.5 0 003 4.5v15A2.5 2.5 0 005.5 22h13a2.5 2.5 0 002.5-2.5v-15A2.5 2.5 0 0018.5 2zm-1.5 9.5h-4v4h-2v-4H7v-2h4v-4h2v4h4v2z"/>
                  </svg>
                  <div className="flex-1">
                    <div className="text-sm mb-1">HubSpot Integration</div>
                    <p className="text-xs text-gray-600">
                      Connect your HubSpot account using a Private App Token or OAuth.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hubspot-token" className="text-sm">
                      HubSpot Private App Token (Recommended)
                    </Label>
                    <Input
                      id="hubspot-token"
                      type="text"
                      placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      value={hubspotToken}
                      onChange={(e) => setHubspotToken(e.target.value)}
                      className="h-10 text-sm font-mono"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="text-center text-xs text-gray-500 mb-2">OR</div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleHubSpotOAuth}
                      className="h-10 text-sm gap-2"
                    >
                      <svg className="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.5 2h-13A2.5 2.5 0 003 4.5v15A2.5 2.5 0 005.5 22h13a2.5 2.5 0 002.5-2.5v-15A2.5 2.5 0 0018.5 2zm-1.5 9.5h-4v4h-2v-4H7v-2h4v-4h2v4h4v2z"/>
                      </svg>
                      Continue with HubSpot
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-black hover:bg-gray-800 text-sm"
              >
                Test & Save CMS Connection
              </Button>
            </form>
          </div>
        )}

        {/* Step 2: Password Setup */}
        {currentStep === 2 && (
          <div className="p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl mb-2">Set Password</h2>
            <p className="text-sm text-gray-600 mb-6">
              Set a password to enable email and password login for your account.
            </p>
            
            <form onSubmit={handlePasswordSetup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10 h-11 border-2 border-gray-900 rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 h-11 bg-gray-50 rounded-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-8 h-10 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  onClick={handleSkipPassword}
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  className="px-8 h-10 bg-gray-600 hover:bg-gray-700 text-sm ml-3"
                >
                  Set Password
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Google Sheets Connection */}
        {currentStep === 3 && (
          <div className="p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl mb-6">Connect Your Google Sheets</h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-6">
                <svg className="h-5 w-5 text-gray-700 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                  <path d="M8 16h8v-2H8v2zm0-4h8v-2H8v2z"/>
                </svg>
                <div className="flex-1">
                  <div className="text-sm mb-1">Google Sheets Integration</div>
                  <p className="text-xs text-gray-600">
                    Link your Google account to bulk edit HubSpot content on Google Sheets and much more
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSheetsConnect}
                className="w-full bg-black hover:bg-gray-800 h-11 text-sm gap-2"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z"/>
                </svg>
                Connect Google Sheets
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                You'll be redirected to Google to authorize access to your Google Sheets
              </p>
            </div>

            {sheetsConnected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mt-4">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-green-900">Connected</div>
                  <div className="text-xs text-green-700">Google Sheets integration is active</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Success Screen */}
        {currentStep === 4 && (
          <div className="p-8 px-[28px] py-[169px]">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl">Setup Complete!</h2>
                <p className="text-gray-600">
                  Your account is ready! Start managing your HubSpot content with Smuves.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Account created successfully</span>
                </div>
                {hubspotToken && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">HubSpot connected</span>
                  </div>
                )}
                {(newPassword || authMethod === 'sign-up') && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Password configured</span>
                  </div>
                )}
                {sheetsConnected && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Google Sheets connected</span>
                  </div>
                )}
              </div>

              <Button
                type="button"
                className="w-full h-11 bg-black hover:bg-gray-800"
                onClick={handleFinish}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}