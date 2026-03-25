import { useUser } from './UserContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Lock, ShieldAlert, CheckCircle } from 'lucide-react';

export function AccessStatusDemoControl() {
  const { accessStatus, setAccessStatus } = useUser();

  return (
    <Card className="border-dashed border-2 border-purple-300 bg-purple-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <span>🔧</span> Demo: Access Status Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-purple-700 mb-4 text-sm">
          Test different user access states. Current status: <span className="font-semibold">{accessStatus}</span>
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setAccessStatus('active')}
            variant={accessStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Active Access
          </Button>
          <Button
            onClick={() => setAccessStatus('pending')}
            variant={accessStatus === 'pending' ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <Lock className="h-4 w-4" />
            Pending Access
          </Button>
          <Button
            onClick={() => setAccessStatus('suspended')}
            variant={accessStatus === 'suspended' ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <ShieldAlert className="h-4 w-4" />
            Suspended
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
