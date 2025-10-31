/**
 * React hook for homomorphic computation operations
 */

import { useState, useCallback } from 'react';
import type { FhevmClient } from '../core/client';

export interface UseComputationResult {
  computeAdd: (a: number, b: number) => Promise<void>;
  computeSub: (a: number, b: number) => Promise<void>;
  computeMul: (a: number, b: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
  result: number | null;
}

export function useComputation(
  client: FhevmClient | null,
  contractAddress: string
): UseComputationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const compute = useCallback(
    async (a: number, b: number, operation: 'add' | 'sub' | 'mul') => {
      if (!client || !client.isInitialized()) {
        const err = new Error('Client not initialized');
        setError(err);
        throw err;
      }

      try {
        setLoading(true);
        setError(null);

        const instance = await client.createContractInstance({
          contractAddress,
        });

        // Encrypt both operands
        await instance.encrypt32(a);
        await instance.encrypt32(b);

        // Simulate computation (in real scenario, this would be done on-chain)
        let computedResult: number;
        switch (operation) {
          case 'add':
            computedResult = a + b;
            break;
          case 'sub':
            computedResult = a - b;
            break;
          case 'mul':
            computedResult = a * b;
            break;
        }

        setResult(computedResult);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Computation failed');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [client, contractAddress]
  );

  return {
    computeAdd: useCallback((a: number, b: number) => compute(a, b, 'add'), [compute]),
    computeSub: useCallback((a: number, b: number) => compute(a, b, 'sub'), [compute]),
    computeMul: useCallback((a: number, b: number) => compute(a, b, 'mul'), [compute]),
    loading,
    error,
    result,
  };
}
