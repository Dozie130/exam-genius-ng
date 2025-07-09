import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const checkConnection = () => {
        const isSlowConnection = connection.effectiveType === 'slow-2g' || 
                                connection.effectiveType === '2g' || 
                                connection.downlink < 1;
        setIsSlowConnection(isSlowConnection);
      };
      
      checkConnection();
      connection.addEventListener('change', checkConnection);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', checkConnection);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isSlowConnection };
}