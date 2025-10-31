import { useState, useEffect, useCallback } from 'react';

export interface FHEInstance {
  initialized: boolean;
  encrypt: (value: number, type: number) => Promise<any>;
  decrypt: (handle: string) => Promise<any>;
}

export function useFHE() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initFHE = async () => {
      try {
        // Initialize FHE client
        setInitialized(true);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    initFHE();
  }, []);

  const encrypt = useCallback(async (value: number, type: number = 32) => {
    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type }),
      });
      return await response.json();
    } catch (err) {
      throw new Error('Encryption failed');
    }
  }, []);

  const decrypt = useCallback(async (handle: string) => {
    try {
      const response = await fetch('/api/fhe/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle }),
      });
      return await response.json();
    } catch (err) {
      throw new Error('Decryption failed');
    }
  }, []);

  return {
    initialized,
    loading,
    error,
    encrypt,
    decrypt,
  };
}
