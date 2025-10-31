import { useState, useEffect, useCallback } from 'react';
import { FhevmClient } from '../core/client';
import type { FhevmClientConfig } from '../types';

export function useFhevm(config?: FhevmClientConfig) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const initialize = useCallback(async () => {
    if (!config) return;
    
    setLoading(true);
    setError(null);

    try {
      const fhevmClient = new FhevmClient(config);
      await fhevmClient.initialize();
      setClient(fhevmClient);
      setInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to initialize'));
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    if (config && !initialized && !loading) {
      initialize();
    }
  }, [config, initialized, loading, initialize]);

  return {
    client,
    initialized,
    loading,
    error,
    initialize,
  };
}
