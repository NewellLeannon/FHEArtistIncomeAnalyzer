/**
 * Vue composables for FHEVM SDK
 */

import { ref, onMounted, type Ref } from 'vue';
import { FhevmClient } from '../core/client';
import type { FhevmClientConfig, EncryptionResult } from '../types';

/**
 * Vue composable for FHEVM client
 */
export function useFhevm(config?: FhevmClientConfig) {
  const client: Ref<FhevmClient | null> = ref(null);
  const initialized = ref(false);
  const error: Ref<Error | null> = ref(null);
  const isLoading = ref(true);

  const init = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const fhevmClient = new FhevmClient(config || { network: 'sepolia' });
      await fhevmClient.initialize();

      client.value = fhevmClient;
      initialized.value = true;
    } catch (err) {
      console.error('FHEVM initialization error:', err);
      error.value = err instanceof Error ? err : new Error('Unknown error');
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    init();
  });

  return {
    client,
    initialized,
    error,
    isLoading,
    reinitialize: init,
  };
}

/**
 * Vue composable for encryption
 */
export function useEncryption(client: Ref<FhevmClient | null>, contractAddress: string) {
  const loading = ref(false);
  const error: Ref<Error | null> = ref(null);

  const encrypt = async <T extends number | bigint | boolean | string>(
    value: T,
    type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address'
  ): Promise<EncryptionResult> => {
    if (!client.value || !client.value.isInitialized()) {
      throw new Error('Client not initialized');
    }

    try {
      loading.value = true;
      error.value = null;

      const instance = await client.value.createContractInstance({
        contractAddress,
      });

      let result: EncryptionResult;
      switch (type) {
        case 'uint8':
          result = await instance.encrypt8(value as number);
          break;
        case 'uint16':
          result = await instance.encrypt16(value as number);
          break;
        case 'uint32':
          result = await instance.encrypt32(value as number);
          break;
        case 'uint64':
          result = await instance.encrypt64(value as bigint);
          break;
        case 'bool':
          result = await instance.encryptBool(value as boolean);
          break;
        case 'address':
          result = await instance.encryptAddress(value as string);
          break;
        default:
          throw new Error(`Unsupported type: ${type}`);
      }

      return result;
    } catch (err) {
      const encryptionError = err instanceof Error ? err : new Error('Encryption failed');
      error.value = encryptionError;
      throw encryptionError;
    } finally {
      loading.value = false;
    }
  };

  return {
    encrypt,
    loading,
    error,
  };
}
