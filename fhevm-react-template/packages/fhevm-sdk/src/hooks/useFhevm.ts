/**
 * React hook for FHEVM client management
 */

import { useState, useEffect } from 'react';
import { FhevmClient } from '../core/client';
import type { FhevmClientConfig } from '../types';

export interface UseFhevmResult {
  client: FhevmClient | null;
  initialized: boolean;
  error: Error | null;
  isLoading: boolean;
}

export function useFhevm(config?: FhevmClientConfig): UseFhevmResult {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initClient = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const fhevmClient = new FhevmClient(config || { network: 'sepolia' });
        await fhevmClient.initialize();

        setClient(fhevmClient);
        setInitialized(true);
      } catch (err) {
        console.error('FHEVM initialization error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    initClient();
  }, [config?.network, config?.gatewayUrl]);

  return {
    client,
    initialized,
    error,
    isLoading,
  };
}
