/**
 * Security utilities for FHEVM SDK
 */

import type { Signer } from 'ethers';

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate encryption handle format
 */
export function isValidHandle(handle: string): boolean {
  return typeof handle === 'string' && handle.length > 0;
}

/**
 * Sanitize input value for encryption
 */
export function sanitizeValue(value: any, type: string): any {
  switch (type) {
    case 'uint8':
      return Math.max(0, Math.min(255, Math.floor(Number(value))));
    case 'uint16':
      return Math.max(0, Math.min(65535, Math.floor(Number(value))));
    case 'uint32':
      return Math.max(0, Math.min(4294967295, Math.floor(Number(value))));
    case 'uint64':
      return BigInt(Math.max(0, Number(value)));
    case 'bool':
      return Boolean(value);
    case 'address':
      if (!isValidAddress(value)) {
        throw new Error('Invalid Ethereum address');
      }
      return value;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

/**
 * Verify signer is valid and connected
 */
export async function verifySigner(signer: Signer): Promise<boolean> {
  try {
    await signer.getAddress();
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate secure random bytes
 */
export function generateRandomBytes(length: number): Uint8Array {
  if (typeof window !== 'undefined' && window.crypto) {
    return window.crypto.getRandomValues(new Uint8Array(length));
  } else if (typeof require !== 'undefined') {
    const crypto = require('crypto');
    return new Uint8Array(crypto.randomBytes(length));
  }
  throw new Error('No secure random number generator available');
}
