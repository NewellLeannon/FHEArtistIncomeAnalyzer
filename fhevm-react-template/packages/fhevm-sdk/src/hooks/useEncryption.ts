/**
 * React hook for encryption operations
 */

import { useState, useCallback } from 'react';
import type { FhevmClient } from '../core/client';
import type { EncryptionResult } from '../types';
import { EncryptionError } from '../errors';

export interface UseEncryptionResult {
  encrypt8: (value: number) => Promise<EncryptionResult>;
  encrypt16: (value: number) => Promise<EncryptionResult>;
  encrypt32: (value: number) => Promise<EncryptionResult>;
  encrypt64: (value: bigint) => Promise<EncryptionResult>;
  encryptBool: (value: boolean) => Promise<EncryptionResult>;
  encryptAddress: (value: string) => Promise<EncryptionResult>;
  loading: boolean;
  error: Error | null;
}

export function useEncryption(
  client: FhevmClient | null,
  contractAddress: string
): UseEncryptionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createEncryptionFunction = useCallback(
    <T extends number | bigint | boolean | string>(
      encryptFn: (instance: any, value: T) => Promise<EncryptionResult>
    ) => {
      return async (value: T): Promise<EncryptionResult> => {
        if (!client || !client.isInitialized()) {
          const err = new EncryptionError('Client not initialized');
          setError(err);
          throw err;
        }

        try {
          setLoading(true);
          setError(null);

          const instance = await client.createContractInstance({
            contractAddress,
          });

          const result = await encryptFn(instance, value);
          return result;
        } catch (err) {
          const error = err instanceof Error ? err : new EncryptionError('Encryption failed');
          setError(error);
          throw error;
        } finally {
          setLoading(false);
        }
      };
    },
    [client, contractAddress]
  );

  return {
    encrypt8: createEncryptionFunction((instance, value: number) =>
      instance.encrypt8(value)
    ),
    encrypt16: createEncryptionFunction((instance, value: number) =>
      instance.encrypt16(value)
    ),
    encrypt32: createEncryptionFunction((instance, value: number) =>
      instance.encrypt32(value)
    ),
    encrypt64: createEncryptionFunction((instance, value: bigint) =>
      instance.encrypt64(value)
    ),
    encryptBool: createEncryptionFunction((instance, value: boolean) =>
      instance.encryptBool(value)
    ),
    encryptAddress: createEncryptionFunction((instance, value: string) =>
      instance.encryptAddress(value)
    ),
    loading,
    error,
  };
}
