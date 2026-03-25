import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, MoreHorizontal } from 'lucide-react';

interface SignInMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowLinkEmail: () => void;
}

export function SignInMethodsModal({ isOpen, onClose, onShowLinkEmail }: SignInMethodsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="modal-override">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Sign-in Methods</DialogTitle>
        </DialogHeader>
        
        <div className="modal-scrollable px-6">
          <div className="py-6 space-y-8">
            {/* Email Accounts Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-muted-foreground mb-4">Email Accounts</h3>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No email accounts linked</p>
                  <Button 
                    variant="outline" 
                    onClick={onShowLinkEmail}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Link Email Account
                  </Button>
                </div>
              </div>
            </div>

            {/* Google Accounts Section */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-muted-foreground">Google Accounts</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">G</span>
                      </div>
                      <div>
                        <p className="font-medium">pavan@smuves.com</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                            Connected
                          </Badge>
                          <span className="text-sm text-muted-foreground">Google</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Last sign in: 8 days ago</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}