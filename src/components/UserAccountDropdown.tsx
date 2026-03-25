import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User, CreditCard, Gift, Palette, LogOut, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useUser } from './UserContext';

interface UserAccountDropdownProps {
  onShowProfile: () => void;
}

export function UserAccountDropdown({ onShowProfile }: UserAccountDropdownProps) {
  const { getUserInitials } = useUser();
  const handleLogout = () => {
    console.log('Logging out...');
    // Add logout logic here
  };

  const handleTheme = () => {
    console.log('Theme settings...');
    // Add theme logic here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" data-coach-profile>
          <Avatar className="h-8 w-8 bg-black">
            <AvatarFallback className="bg-black text-white text-sm">{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-72 p-0 bg-white border border-gray-200 shadow-lg rounded-lg"
        sideOffset={8}
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">My Account</h3>
        </div>
        
        <div className="py-2">
          <DropdownMenuItem 
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
            onClick={onShowProfile}
          >
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-base text-gray-900">Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <span className="text-base text-gray-900">Change Plan</span>
            </div>
            <Badge variant="outline" className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              Coming Soon
            </Badge>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-gray-600" />
              <span className="text-base text-gray-900">Referrals</span>
            </div>
            <Badge variant="outline" className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              Coming Soon
            </Badge>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
            onClick={handleTheme}
          >
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-gray-600" />
              <span className="text-base text-gray-900">Theme</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 text-gray-600" />
            <span className="text-base text-gray-900">Logout</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}