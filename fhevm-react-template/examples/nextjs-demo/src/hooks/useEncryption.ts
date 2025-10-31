import { useState, useCallback } from 'react';

export function useEncryption() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const encrypt8 = useCallback(async (value: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type: 8 }),
      });
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const encrypt16 = useCallback(async (value: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type: 16 }),
      });
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const encrypt32 = useCallback(async (value: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type: 32 }),
      });
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const encrypt64 = useCallback(async (value: bigint) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: value.toString(), type: 64 }),
      });
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    encrypt8,
    encrypt16,
    encrypt32,
    encrypt64,
    loading,
    error,
  };
}
