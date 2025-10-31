/**
 * Validation utilities for FHEVM SDK
 */

import type { FhevmClientConfig } from '../types';
import { isValidAddress } from './security';

/**
 * Validate client configuration
 */
export function validateConfig(config: FhevmClientConfig): void {
  if (!config.network) {
    throw new Error('Network is required');
  }

  if (config.aclAddress && !isValidAddress(config.aclAddress)) {
    throw new Error('Invalid ACL address');
  }

  if (config.kmsVerifierAddress && !isValidAddress(config.kmsVerifierAddress)) {
    throw new Error('Invalid KMS verifier address');
  }

  if (config.gatewayUrl) {
    try {
      new URL(config.gatewayUrl);
    } catch {
      throw new Error('Invalid gateway URL');
    }
  }
}

/**
 * Validate encryption value range
 */
export function validateEncryptionValue(
  value: number | bigint | boolean | string,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address'
): void {
  switch (type) {
    case 'uint8':
      if (typeof value !== 'number' || value < 0 || value > 255) {
        throw new Error('Value must be between 0 and 255 for uint8');
      }
      break;
    case 'uint16':
      if (typeof value !== 'number' || value < 0 || value > 65535) {
        throw new Error('Value must be between 0 and 65535 for uint16');
      }
      break;
    case 'uint32':
      if (typeof value !== 'number' || value < 0 || value > 4294967295) {
        throw new Error('Value must be between 0 and 4294967295 for uint32');
      }
      break;
    case 'uint64':
      if (typeof value !== 'bigint' || value < 0n) {
        throw new Error('Value must be a positive bigint for uint64');
      }
      break;
    case 'bool':
      if (typeof value !== 'boolean') {
        throw new Error('Value must be a boolean');
      }
      break;
    case 'address':
      if (!isValidAddress(value as string)) {
        throw new Error('Invalid Ethereum address');
      }
      break;
    default:
      throw new Error(`Unsupported encryption type: ${type}`);
  }
}

/**
 * Validate contract address
 */
export function validateContractAddress(address: string): void {
  if (!isValidAddress(address)) {
    throw new Error('Invalid contract address');
  }
}
