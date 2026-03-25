import { Lock, Mail } from 'lucide-react';
import { Button } from './ui/button';

interface PendingAccessScreenProps {
  onAuthenticate: () => void;
}

export function PendingAccessScreen({ onAuthenticate }: PendingAccessScreenProps) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-gray-900 mb-2">Access Pending</h1>
            <p className="text-gray-600">
              Your account is awaiting approval from our admin team. You'll be notified once access has been granted.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-700 mb-1">
                  Need immediate assistance?
                </p>
                <p className="text-gray-600">
                  Contact our support team at{' '}
                  <a 
                    href="mailto:support@smuves.com" 
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    support@smuves.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Demo Button */}
          <Button 
            onClick={onAuthenticate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Authenticate <span className="ml-1 text-xs opacity-75">(Demo Purpose)</span>
          </Button>
        </div>

        {/* Footer Note */}
        
      </div>
    </div>
  );
}
