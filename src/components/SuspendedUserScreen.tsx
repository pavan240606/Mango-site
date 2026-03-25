import { ShieldAlert, Mail } from 'lucide-react';
import { Button } from './ui/button';

interface SuspendedUserScreenProps {
  onAuthenticate: () => void;
}

export function SuspendedUserScreen({ onAuthenticate }: SuspendedUserScreenProps) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-red-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <ShieldAlert className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-gray-900 mb-2">Account Suspended</h1>
            <p className="text-gray-600">
              Your account has been temporarily suspended. Access to the platform has been restricted.
            </p>
          </div>

          {/* Reason Information */}
          <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-100">
            <p className="text-gray-700 mb-2">
              This may have occurred due to:
            </p>
            <ul className="text-gray-600 space-y-1 ml-4">
              <li className="list-disc">Payment issues</li>
              <li className="list-disc">Terms of service violations</li>
              <li className="list-disc">Security concerns</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-700 mb-1">
                  To resolve this issue:
                </p>
                <p className="text-gray-600">
                  Please contact our support team at{' '}
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
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Authenticate <span className="ml-1 text-xs opacity-75">(Demo Purpose)</span>
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-4 text-gray-500 text-sm">
          We're here to help resolve any issues with your account
        </p>
      </div>
    </div>
  );
}
