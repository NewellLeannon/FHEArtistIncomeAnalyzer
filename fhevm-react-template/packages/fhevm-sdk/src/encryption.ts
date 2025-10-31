/**
 * Encryption utilities for FHEVM
 */

import type { FhevmInstance, EncryptionResult } from './types';

/**
 * Encrypt an 8-bit unsigned integer
 */
export async function encrypt8(
  instance: FhevmInstance,
  value: number
): Promise<EncryptionResult> {
  return instance.encrypt8(value);
}

/**
 * Encrypt a 16-bit unsigned integer
 */
export async function encrypt16(
  instance: FhevmInstance,
  value: number
): Promise<EncryptionResult> {
  return instance.encrypt16(value);
}

/**
 * Encrypt a 32-bit unsigned integer
 */
export async function encrypt32(
  instance: FhevmInstance,
  value: number
): Promise<EncryptionResult> {
  return instance.encrypt32(value);
}

/**
 * Encrypt a 64-bit unsigned integer
 */
export async function encrypt64(
  instance: FhevmInstance,
  value: bigint
): Promise<EncryptionResult> {
  return instance.encrypt64(value);
}

/**
 * Encrypt a boolean value
 */
export async function encryptBool(
  instance: FhevmInstance,
  value: boolean
): Promise<EncryptionResult> {
  return instance.encryptBool(value);
}

/**
 * Encrypt an Ethereum address
 */
export async function encryptAddress(
  instance: FhevmInstance,
  value: string
): Promise<EncryptionResult> {
  return instance.encryptAddress(value);
}

/**
 * Batch encrypt multiple values
 */
export async function batchEncrypt(
  instance: FhevmInstance,
  values: Array<{
    type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
    value: number | bigint | boolean | string;
  }>
): Promise<EncryptionResult[]> {
  const results: EncryptionResult[] = [];

  for (const { type, value } of values) {
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
        throw new Error(`Unsupported encryption type: ${type}`);
    }

    results.push(result);
  }

  return results;
}
