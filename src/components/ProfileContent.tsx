import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Eye, EyeOff, X, Settings, Link2, FileSpreadsheet, Zap, Trash2, Info, AlertTriangle, Key } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useUser } from './UserContext';
import { useIntegration } from './IntegrationContext';
import { ColumnSettingsTab } from './ColumnSettingsTab';

interface ProfileContentProps {
  defaultTab?: 'profile' | 'columns' | 'connection';
}

export function ProfileContent({ defaultTab = 'profile' }: ProfileContentProps) {
  const { userProfile, updateUserProfile, getUserInitials, hasPassword, setHasPassword } = useUser();
  const { hubSpotConnected, setHubSpotConnected, googleSheetsConnected, setGoogleSheetsConnected } = useIntegration();
  const [showLinkEmailModal, setShowLinkEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('pavan@smuves.com');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHubSpotModal, setShowHubSpotModal] = useState(false);
  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState(false);
  const [hubSpotToken, setHubSpotToken] = useState('');
  
  // Active tab state - map 'signin' to 'profile' since sign-in methods is within profile tab
  const [activeTab, setActiveTab] = useState<'profile' | 'columns' | 'connection'>(
    defaultTab === 'signin' ? 'profile' : defaultTab
  );
  
  // Track current sign-in method: 'google', 'email', or 'magic-link'
  const [signInMethod, setSignInMethod] = useState<'google' | 'email' | 'magic-link'>('google');
  
  // Password states for sign-in methods modals
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showConfirmPasswordField, setShowConfirmPasswordField] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPasswordField, setShowCurrentPasswordField] = useState(false);
  
  // Modal states for each sign-in method
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [showEnableEmailModal, setShowEnableEmailModal] = useState(false);
  const [showEnableMagicLinkModal, setShowEnableMagicLinkModal] = useState(false);

  // Watch for defaultTab changes and update activeTab accordingly
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const handleInputChange = (field: string, value: string) => {
    updateUserProfile({ [field]: value });
  };

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully');
    console.log('Profile saved:', userProfile);
  };

  const handleLinkEmail = () => {
    toast.success('Email account linked successfully');
    setShowLinkEmailModal(false);
    setNewPassword('');
  };

  const handleCancelLinkEmail = () => {
    setShowLinkEmailModal(false);
    setEmailAddress('pavan@smuves.com');
    setNewPassword('');
  };

  const handleSetPassword = () => {
    // If updating password, check current password first
    if (hasPassword && !currentPassword) {
      toast.error('Please enter your current password!');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }
    
    setHasPassword(true);
    toast.success(hasPassword ? 'Password updated successfully!' : 'Password set successfully!');
    setPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex gap-1 px-6 pt-4">
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              activeTab === 'profile'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              activeTab === 'columns'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('columns')}
          >
            <Settings className="h-4 w-4" />
            Column Settings
          </Button>
          <Button
            variant="ghost"
            className={`gap-2 rounded-b-none border-b-2 ${
              activeTab === 'connection'
                ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('connection')}
            data-coach-connection-tab
          >
            <Link2 className="h-4 w-4" />
            Connection Status
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'profile' && (
          <div className="px-[1px] py-6 space-y-6">
            {/* Profile Information Section */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-lg text-gray-900 font-bold">Profile Information</CardTitle>
                </div>
                <Avatar className="h-16 w-16 bg-black">
                  <AvatarFallback className="bg-black text-white text-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                    <Input
                      id="firstName"
                      value={userProfile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="bg-white border-gray-200"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userProfile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="bg-white border-gray-200"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-gray-700">Company Name</Label>
                  <Input
                    id="companyName"
                    value={userProfile.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="bg-white border-gray-200"
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyDomain" className="text-gray-700">Company Domain</Label>
                  <Input
                    id="companyDomain"
                    value={userProfile.companyDomain}
                    onChange={(e) => handleInputChange('companyDomain', e.target.value)}
                    className="bg-white border-gray-200"
                    placeholder="Enter your company domain"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleSaveProfile}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sign-in Methods Section */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900 font-bold">Sign-in Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Manage how you sign in to your account. You can set a password for additional login methods.
                </p>

                {/* Google OAuth */}
                <div className="p-4 border border-gray-200 rounded-md bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">Google OAuth</span>
                          {signInMethod === 'google' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Currently Signed In</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">pavan@smuves.com</p>
                      </div>
                    </div>
                    {signInMethod === 'google' && (
                      <Button 
                        onClick={() => hasPassword ? setShowUpdatePasswordModal(true) : setShowSetPasswordModal(true)}
                        variant="outline"
                        className="border-gray-300"
                        data-coach-password
                      >
                        {hasPassword ? 'Update Password' : 'Set Password'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Email Login (Demo Purpose) */}
                <div className="p-4 border border-gray-200 rounded-md bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">Email Login</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Demo Purpose</span>
                          {signInMethod === 'email' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Currently Signed In</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Sign in with email and password</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowUpdatePasswordModal(true)}
                      variant="outline"
                      className="border-gray-300"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>

                {/* Magic Link (Demo Purpose) */}
                <div className="p-4 border border-gray-200 rounded-md bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">Magic Link</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Demo Purpose</span>
                          {signInMethod === 'magic-link' && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Currently Signed In</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Sign in with a link sent to your email</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowSetPasswordModal(true)}
                      variant="outline"
                      className="border-gray-300"
                    >
                      Set Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'columns' && (
          <div className="px-[1px] py-6">
            <ColumnSettingsTab />
          </div>
        )}

        {activeTab === 'connection' && (
          <div className="px-[1px] py-6 space-y-6">
            {/* HubSpot Connection Card */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">HubSpot Connection</h2>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{hubSpotConnected ? 'Connected' : 'Not Connected'}</h3>
                  <p className="text-gray-600 mb-6">{hubSpotConnected ? 'Your HubSpot account is connected.' : 'Connect your account to get started.'}</p>
                  {!hubSpotConnected && (
                    <Button
                      onClick={() => setShowHubSpotModal(true)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 hover:bg-gray-50 h-12"
                      data-coach-hubspot
                    >
                      <Link2 className="h-5 w-5" />
                      Connect HubSpot
                    </Button>
                  )}
                  {hubSpotConnected && (
                    <Button
                      onClick={() => {
                        setHubSpotConnected(false);
                        toast.success('HubSpot disconnected successfully!');
                      }}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 hover:bg-gray-50 h-12"
                      data-coach-hubspot
                    >
                      <Trash2 className="h-5 w-5" />
                      Disconnect HubSpot
                    </Button>
                  )}
                </div>

                {/* HubSpot Info Banners */}
                <div className="space-y-4">
                  {/* Combined Info Banner - Yellow/Amber */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-md border border-amber-300">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-3">HubSpot Account Information</p>
                      <div className="space-y-3 text-sm">
                        {/* Multiple Accounts */}
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-gray-900">Multiple HubSpot Accounts</p>
                            <p className="text-gray-700 mt-1">
                              You can connect and manage multiple HubSpot accounts. Each account can have its own content and settings managed independently.
                            </p>
                          </div>
                        </div>
                        
                        {/* Warning Section */}
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-red-900">Warning: HubSpot Account Removal</p>
                            <p className="text-gray-800 mt-1">
                              <strong>Disconnecting a HubSpot account will permanently delete all associated data</strong> including content, exports and logs.
                            </p>
                            <p className="text-gray-700 mt-1">
                              This action cannot be undone. Please ensure you have exported any important data before disconnecting.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Sheets Connection Card */}
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Google Sheets Connection</h2>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{googleSheetsConnected ? 'Connected' : 'Not Connected'}</h3>
                  <p className="text-gray-600 mb-6">{googleSheetsConnected ? 'Your Google Sheets account is connected.' : 'Connect to bulk edit your content.'}</p>
                  {!googleSheetsConnected && (
                    <Button
                      onClick={() => setShowGoogleSheetsModal(true)}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 hover:bg-gray-50 h-12"
                      data-coach-google-sheets
                    >
                      <FileSpreadsheet className="h-5 w-5" />
                      Connect Google Sheets
                    </Button>
                  )}
                  {googleSheetsConnected && (
                    <Button
                      onClick={() => {
                        setGoogleSheetsConnected(false);
                        toast.success('Google Sheets disconnected successfully!');
                      }}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 hover:bg-gray-50 h-12"
                      data-coach-google-sheets
                    >
                      <Trash2 className="h-5 w-5" />
                      Disconnect Google Sheets
                    </Button>
                  )}
                </div>

                {/* Google Sheets Info Banner */}
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-md border border-green-200">
                  <Info className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">Shared Google Sheets Account</p>
                    <p className="text-sm text-gray-700">
                      Your Google Sheets connection works across <strong>all connected HubSpot accounts</strong>. You only need to connect one Google Sheets account to use it with all your HubSpot portals. Disconnecting Google Sheets only removes the connection, no data is deleted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Link Email Modal */}
      <Dialog open={showLinkEmailModal} onOpenChange={setShowLinkEmailModal}>
        <DialogContent className="sm:max-w-md w-full max-w-lg mx-4">
          <DialogHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <DialogTitle className="text-xl text-gray-900">Update Account</DialogTitle>
              <DialogDescription className="sr-only">Update your email/password or link a new email account</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelLinkEmail}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-gray-600">
              <p>Update your email/password or link a new email account.</p>
              <p>Leave fields blank to keep them unchanged.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailAddress" className="text-gray-900">Email Address</Label>
                <Input
                  id="emailAddress"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="bg-white border-2 border-gray-300 focus:border-gray-400"
                />
                <p className="text-gray-500 text-sm">Enter a new email to link it to your account</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-900">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                    className="bg-white border-2 border-gray-300 focus:border-gray-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelLinkEmail}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLinkEmail}
                className="bg-black text-white hover:bg-gray-800"
              >
                Link Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* HubSpot Connection Modal */}
      <Dialog open={showHubSpotModal} onOpenChange={setShowHubSpotModal}>
        <DialogContent className="w-full max-w-full h-auto flex flex-col p-0">
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
            <div>
              <DialogTitle className="text-2xl text-gray-900">Connect Your HubSpot Account</DialogTitle>
              <DialogDescription className="sr-only">Connect your HubSpot account using a Private App Token or OAuth</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHubSpotModal(false)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>

          <div className="overflow-y-auto p-6">
            <div className="bg-gray-50 rounded-lg p-8 w-full">
              <div className="flex items-start gap-3 mb-6 max-w-6xl mx-auto">
                <Zap className="h-6 w-6 text-gray-700 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">HubSpot Integration</h3>
                  <p className="text-gray-600">Connect your HubSpot account using a Private App Token or OAuth.</p>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-start max-w-6xl mx-auto">
                {/* Private App Token Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">HubSpot Private App Token (Recommended)</h4>
                  <Input
                    placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={hubSpotToken}
                    onChange={(e) => setHubSpotToken(e.target.value)}
                    className="bg-white border-2 border-gray-300 h-12"
                  />
                </div>

                {/* OR Divider */}
                <div className="flex items-center justify-center pt-12">
                  <span className="text-gray-500 font-medium text-lg">OR</span>
                </div>

                {/* OAuth Section */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Sign in with HubSpot (OAuth)</h4>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2"
                    onClick={() => {
                      toast.info('Redirecting to HubSpot OAuth...');
                    }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.5 2h-13C4.7 2 4 2.7 4 3.5v17c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-17c0-.8-.7-1.5-1.5-1.5zm-7 17c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm5.5-4h-11V4h11v11z"/>
                    </svg>
                    Continue with HubSpot
                  </Button>
                </div>
              </div>

              {/* Test & Save Button */}
              <div className="mt-8 max-w-6xl mx-auto">
                <Button
                  className="w-full h-14 bg-black text-white hover:bg-gray-800"
                  onClick={() => {
                    toast.success('Testing CMS connection...');
                    setTimeout(() => {
                      toast.success('HubSpot connected successfully!');
                      setShowHubSpotModal(false);
                      setHubSpotConnected(true);
                    }, 1500);
                  }}
                >
                  Test & Save CMS Connection
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Google Sheets Connection Modal */}
      <Dialog open={showGoogleSheetsModal} onOpenChange={setShowGoogleSheetsModal}>
        <DialogContent className="w-full max-w-full h-auto flex flex-col p-0">
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
            <div>
              <DialogTitle className="text-2xl text-gray-900">Connect Your Google Sheets</DialogTitle>
              <DialogDescription className="sr-only">Link your Google account to bulk edit HubSpot content on Google Sheets</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGoogleSheetsModal(false)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>

          <div className="overflow-y-auto p-6">
            <div className="bg-gray-50 rounded-lg p-8 w-full">
              <div className="flex items-start gap-3 mb-6 max-w-6xl mx-auto">
                <FileSpreadsheet className="h-6 w-6 text-gray-700 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Google Sheets Integration</h3>
                  <p className="text-gray-600">Link your Google account to bulk edit HubSpot content on Google Sheets and much more</p>
                </div>
              </div>

              <div className="mt-8 max-w-6xl mx-auto">
                <Button
                  className="w-full h-14 bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                  onClick={() => {
                    toast.info('Redirecting to Google...');
                    setTimeout(() => {
                      toast.success('Google Sheets connected successfully!');
                      setShowGoogleSheetsModal(false);
                      setGoogleSheetsConnected(true);
                    }, 1500);
                  }}
                >
                  <FileSpreadsheet className="h-5 w-5" />
                  Connect Google Sheets
                </Button>
                <p className="text-gray-500 text-center mt-4">You'll be redirected to Google to authorize access to your Google Sheets</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Password Modal (Google OAuth) */}
      <Dialog open={showSetPasswordModal} onOpenChange={setShowSetPasswordModal}>
        <DialogContent className="sm:max-w-md w-full max-w-lg mx-4">
          <DialogHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <DialogTitle className="text-xl text-gray-900">Set Password</DialogTitle>
              <DialogDescription className="sr-only">Set a password for email login</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSetPasswordModal(false)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-900">
                Set a password to enable login with your email (<strong>pavan@smuves.com</strong>) and password.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="set-password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="set-password"
                    type={showPasswordField ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-gray-200 pr-10"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswordField(!showPasswordField)}
                  >
                    {showPasswordField ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="set-confirm-password" className="text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="set-confirm-password"
                    type={showConfirmPasswordField ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white border-gray-200 pr-10"
                    placeholder="Confirm your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
                  >
                    {showConfirmPasswordField ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSetPasswordModal(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleSetPassword();
                  setShowSetPasswordModal(false);
                }}
                className="bg-black text-white hover:bg-gray-800"
                disabled={!password || !confirmPassword}
              >
                Set Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Password Modal (Google OAuth) */}
      <Dialog open={showUpdatePasswordModal} onOpenChange={setShowUpdatePasswordModal}>
        <DialogContent className="sm:max-w-md w-full max-w-lg mx-4">
          <DialogHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <DialogTitle className="text-xl text-gray-900">Update Password</DialogTitle>
              <DialogDescription className="sr-only">Update your password</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUpdatePasswordModal(false)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="update-current-password" className="text-gray-700">Current Password</Label>
                <div className="relative">
                  <Input
                    id="update-current-password"
                    type={showCurrentPasswordField ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-white border-gray-200 pr-10"
                    placeholder="Enter your current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPasswordField(!showCurrentPasswordField)}
                  >
                    {showCurrentPasswordField ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-password" className="text-gray-700">New Password</Label>
                <div className="relative">
                  <Input
                    id="update-password"
                    type={showPasswordField ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-gray-200 pr-10"
                    placeholder="Enter your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPasswordField(!showPasswordField)}
                  >
                    {showPasswordField ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-confirm-password" className="text-gray-700">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="update-confirm-password"
                    type={showConfirmPasswordField ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white border-gray-200 pr-10"
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPasswordField(!showConfirmPasswordField)}
                  >
                    {showConfirmPasswordField ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowUpdatePasswordModal(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleSetPassword();
                  setShowUpdatePasswordModal(false);
                }}
                className="bg-black text-white hover:bg-gray-800"
                disabled={!password || !confirmPassword || !currentPassword}
              >
                Update Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enable Email Login Modal (Demo) */}
      <Dialog open={showEnableEmailModal} onOpenChange={setShowEnableEmailModal}>
        <DialogContent className="sm:max-w-md w-full max-w-lg mx-4">
          <DialogHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <DialogTitle className="text-xl text-gray-900">Configure Email Login</DialogTitle>
              <DialogDescription className="sr-only">Configure email and password login</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEnableEmailModal(false)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-start gap-2 p-3 bg-gray-100 rounded-md">
              <Info className="h-4 w-4 text-gray-600 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-700">
                This is a demo feature. In a production environment, users would configure email and password authentication here.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="demo-email" className="text-gray-700">Email Address</Label>
                <Input
                  id="demo-email"
                  type="email"
                  value="pavan@smuves.com"
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo-email-password" className="text-gray-700">Password</Label>
                <Input
                  id="demo-email-password"
                  type="password"
                  placeholder="Enter password"
                  className="bg-white border-gray-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEnableEmailModal(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success('Demo: Email Login configured successfully!');
                  setShowEnableEmailModal(false);
                }}
                className="bg-black text-white hover:bg-gray-800"
              >
                Enable
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enable Magic Link Modal (Demo) */}
      <Dialog open={showEnableMagicLinkModal} onOpenChange={setShowEnableMagicLinkModal}>
        <DialogContent className="sm:max-w-md w-full max-w-lg mx-4">
          <DialogHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <DialogTitle className="text-xl text-gray-900">Configure Magic Link</DialogTitle>
              <DialogDescription className="sr-only">Configure magic link authentication</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEnableMagicLinkModal(false)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-md">
              <Info className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
              <p className="text-sm text-purple-900">
                This is a demo feature. In a production environment, users would enable passwordless authentication via magic links sent to their email.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="demo-magic-email" className="text-gray-700">Email Address</Label>
                <Input
                  id="demo-magic-email"
                  type="email"
                  value="pavan@smuves.com"
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
                <p className="text-sm text-gray-500">A magic link will be sent to this email address</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEnableMagicLinkModal(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast.success('Demo: Magic Link configured successfully!');
                  setShowEnableMagicLinkModal(false);
                }}
                className="bg-black text-white hover:bg-gray-800"
              >
                Enable
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}