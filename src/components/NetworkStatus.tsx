import React from 'react';
import { WifiOff, Wifi, WifiLow } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NetworkStatus = () => {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  if (isOnline && !isSlowConnection) return null;

  return (
    <Alert className={`fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up ${
      !isOnline ? 'border-destructive bg-destructive/10' : 'border-yellow-500 bg-yellow-50'
    }`}>
      <div className="flex items-center space-x-2">
        {!isOnline ? (
          <WifiOff className="h-4 w-4 text-destructive" />
        ) : (
          <WifiLow className="h-4 w-4 text-yellow-600" />
        )}
        <AlertDescription className={`text-sm ${
          !isOnline ? 'text-destructive' : 'text-yellow-700'
        }`}>
          {!isOnline 
            ? 'You are offline. Some features may not work.' 
            : 'Slow connection detected. Experience may be limited.'
          }
        </AlertDescription>
      </div>
    </Alert>
  );
};

export default NetworkStatus;