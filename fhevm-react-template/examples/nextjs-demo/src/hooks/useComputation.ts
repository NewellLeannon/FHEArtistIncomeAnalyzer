import { useState, useCallback } from 'react';

export type ComputationOperation = 'add' | 'subtract' | 'multiply' | 'compare';

export function useComputation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const compute = useCallback(
    async (operation: ComputationOperation, operands: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/fhe/compute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation, operands }),
        });
        const result = await response.json();
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const add = useCallback(
    async (a: any, b: any) => {
      return compute('add', [a, b]);
    },
    [compute]
  );

  const subtract = useCallback(
    async (a: any, b: any) => {
      return compute('subtract', [a, b]);
    },
    [compute]
  );

  const multiply = useCallback(
    async (a: any, b: any) => {
      return compute('multiply', [a, b]);
    },
    [compute]
  );

  const compare = useCallback(
    async (a: any, b: any) => {
      return compute('compare', [a, b]);
    },
    [compute]
  );

  return {
    compute,
    add,
    subtract,
    multiply,
    compare,
    loading,
    error,
  };
}
