import { Badge } from './ui/badge';
import { LogEntry } from './LogsContext';

interface StatusBadgeSimpleProps {
  status: LogEntry['status'];
}

export function StatusBadgeSimple({ status }: StatusBadgeSimpleProps) {
  // Only show success or error statuses
  if (status !== 'success' && status !== 'error') {
    return null;
  }

  const variants = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <Badge variant="secondary" className={`${variants[status]} border`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}