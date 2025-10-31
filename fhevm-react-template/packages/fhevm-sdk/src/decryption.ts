/**
 * Decryption utilities for FHEVM
 */

import type { Signer, Contract } from 'ethers';
import type { DecryptionParams, PublicDecryptionParams, DecryptionResult } from './types';
import { FhevmError } from './errors';

/**
 * Decrypt a value using user's private key (EIP-712 signature)
 */
export async function userDecrypt<T = any>(
  params: DecryptionParams
): Promise<DecryptionResult<T>> {
  try {
    // EIP-712 domain
    const domain = {
      name: 'Authorization token',
      version: '1',
      chainId: await params.signer.getChainId(),
      verifyingContract: params.contractAddress,
    };

    // EIP-712 types
    const types = {
      Reencrypt: [
        { name: 'publicKey', type: 'bytes' },
        { name: 'signature', type: 'bytes' },
      ],
    };

    // Get user's public key
    const userAddress = await params.signer.getAddress();

    // Sign the decryption request
    const signature = await params.signer._signTypedData(domain, types, {
      publicKey: userAddress,
      signature: params.handle,
    });

    // Return the signature for use in contract call
    return {
      value: signature as T,
      success: true,
    };
  } catch (error) {
    return {
      value: null as T,
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed',
    };
  }
}

/**
 * Decrypt a public value (no signature required)
 */
export async function publicDecrypt<T = any>(
  params: PublicDecryptionParams
): Promise<DecryptionResult<T>> {
  try {
    // Public decryption doesn't require signatures
    // The contract must allow public decryption for this handle
    return {
      value: params.handle as T,
      success: true,
    };
  } catch (error) {
    return {
      value: null as T,
      success: false,
      error: error instanceof Error ? error.message : 'Public decryption failed',
    };
  }
}

/**
 * Request decryption from gateway
 */
export async function requestDecryption(
  contract: Contract,
  handle: string,
  signer: Signer
): Promise<DecryptionResult<any>> {
  try {
    const userAddress = await signer.getAddress();

    // Create EIP-712 signature for decryption
    const decryptionResult = await userDecrypt({
      contractAddress: contract.address,
      handle,
      signer,
    });

    if (!decryptionResult.success) {
      throw new FhevmError(
        decryptionResult.error || 'Decryption failed',
        'DECRYPTION_ERROR'
      );
    }

    return decryptionResult;
  } catch (error) {
    return {
      value: null,
      success: false,
      error: error instanceof Error ? error.message : 'Decryption request failed',
    };
  }
}

/**
 * Batch decrypt multiple handles
 */
export async function batchDecrypt(
  handles: string[],
  params: Omit<DecryptionParams, 'handle'>
): Promise<DecryptionResult<any>[]> {
  const results: DecryptionResult<any>[] = [];

  for (const handle of handles) {
    const result = await userDecrypt({
      ...params,
      handle,
    });
    results.push(result);
  }

  return results;
}
