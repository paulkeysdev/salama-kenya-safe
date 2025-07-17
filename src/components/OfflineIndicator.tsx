import { Wifi, WifiOff, RotateCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

export const OfflineIndicator = () => {
  const { isOnline, pendingSyncCount } = useOfflineStorage();

  if (isOnline && pendingSyncCount === 0) {
    return null;
  }

  return (
    <Alert className={`mb-4 ${isOnline ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' : 'border-red-500 bg-red-50 dark:bg-red-950'}`}>
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <RotateCw className="h-4 w-4 text-yellow-600 dark:text-yellow-400 animate-spin" />
            <div className="text-yellow-800 dark:text-yellow-200">
              <AlertDescription>
                Syncing {pendingSyncCount} pending incident{pendingSyncCount !== 1 ? 's' : ''}...
              </AlertDescription>
            </div>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
            <div className="text-red-800 dark:text-red-200">
              <AlertDescription>
                You are offline. Emergency contacts and voice alerts are still available.
                {pendingSyncCount > 0 && ` ${pendingSyncCount} incident${pendingSyncCount !== 1 ? 's' : ''} will sync when connection is restored.`}
              </AlertDescription>
            </div>
          </>
        )}
      </div>
    </Alert>
  );
};