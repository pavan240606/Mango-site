import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Mail, Zap, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingPageProps {
  onAuthComplete: (authMethod: string) => void;
}

export function OnboardingPage({ onAuthComplete }: OnboardingPageProps) {
  const [view, setView] = useState<'signup' | 'signin'>('signup'); // Default to signup
  const [activeTab, setActiveTab] = useState('magic-link');
  const [showPassword, setShowPassword] = useState(false);
  
  // Magic Link form state
  const [magicLinkName, setMagicLinkName] = useState('');
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  
  // Sign Up form state
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  
  // Sign In form state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Magic link verified!');
    setTimeout(() => {
      onAuthComplete('magic-link');
    }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Account created successfully!');
    setTimeout(() => {
      onAuthComplete('sign-up');
    }, 1000);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Successfully signed in!');
    setTimeout(() => {
      onAuthComplete('sign-in');
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    toast.success('Connecting with Google...');
    setTimeout(() => {
      toast.success('Successfully connected!');
      setTimeout(() => {
        onAuthComplete('google');
      }, 1000);
    }, 1000);
  };

  // Signup View (Magic Link + Sign Up)
  if (view === 'signup') {
    return (
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl mb-1">Get Started Free</h1>
            <p className="text-gray-600 text-sm">Create your account to continue</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 h-auto rounded-md">
              <TabsTrigger 
                value="magic-link" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded py-2 text-sm"
              >
                Magic Link
              </TabsTrigger>
              <TabsTrigger 
                value="sign-up" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded py-2 text-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Magic Link Tab */}
            <TabsContent value="magic-link" className="mt-0">
              <form onSubmit={handleSendMagicLink} className="space-y-4">
                {/* Recommended Banner */}
                <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-purple-900 text-sm mb-0.5">
                        Recommended
                      </div>
                      <p className="text-purple-700 text-xs">
                        No password needed! We'll send you a secure login link via email.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="magic-name" className="text-sm text-gray-700">
                    Full Name (Optional)
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="magic-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={magicLinkName}
                      onChange={(e) => setMagicLinkName(e.target.value)}
                      className="pl-10 h-10 border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="magic-email" className="text-sm text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="magic-email"
                      type="email"
                      placeholder="Enter your email"
                      value={magicLinkEmail}
                      onChange={(e) => setMagicLinkEmail(e.target.value)}
                      className="pl-10 h-10 border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-black hover:bg-gray-800 gap-2 text-sm rounded-md"
                >
                  <Zap className="h-4 w-4" />
                  Send Magic Link
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full h-10 gap-2 text-sm border-gray-300 rounded-md"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signin')}
                    className="text-gray-900 underline hover:text-gray-700"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="sign-up" className="mt-0">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name" className="text-sm text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      className="pl-10 h-10 border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-sm text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="pl-10 h-10 border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-sm text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="pr-10 h-10 border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-black hover:bg-gray-800 text-sm rounded-md"
                >
                  Create Free Account
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full h-10 gap-2 text-sm border-gray-300 rounded-md"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signin')}
                    className="text-gray-900 underline hover:text-gray-700"
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-gray-900 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-gray-900 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Sign In View (Separate page)
  return (
    <div className="flex-1 bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl mb-1">Welcome Back</h1>
          <p className="text-gray-600 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="signin-email" className="text-sm text-gray-700">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className="pl-10 h-10 border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="signin-password" className="text-sm text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="pr-10 h-10 border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-10 bg-black hover:bg-gray-800 text-sm rounded-md"
          >
            Sign In
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full h-10 gap-2 text-sm border-gray-300 rounded-md"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setView('signup')}
              className="text-gray-900 underline hover:text-gray-700"
            >
              Sign Up
            </button>
          </p>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-gray-900 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-gray-900 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}