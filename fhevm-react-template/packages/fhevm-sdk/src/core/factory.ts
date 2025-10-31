/**
 * FHEVM Factory - Factory methods for creating FHEVM clients
 */

import { FhevmClient } from './client';
import type { FhevmClientConfig, SupportedNetwork } from '../types';

/**
 * Create a new FHEVM client
 */
export function createFhevmClient(config: FhevmClientConfig): FhevmClient {
  return new FhevmClient(config);
}

/**
 * Create and initialize a new FHEVM client
 */
export async function createAndInitializeFhevmClient(
  config: FhevmClientConfig
): Promise<FhevmClient> {
  const client = new FhevmClient(config);
  await client.initialize();
  return client;
}

/**
 * Create a quick client with minimal configuration
 */
export async function createQuickClient(
  network: SupportedNetwork = 'sepolia'
): Promise<FhevmClient> {
  return createAndInitializeFhevmClient({ network });
}
