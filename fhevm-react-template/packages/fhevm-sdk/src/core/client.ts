/**
 * FHEVM Client - Core client for managing FHEVM instances
 */

import { createInstance, FhevmInstance as FhevmjsInstance } from 'fhevmjs';
import type { Signer } from 'ethers';
import type { FhevmClientConfig, FhevmInstance, InstanceParams } from '../types';
import { FhevmError } from '../errors';
import { NETWORK_CONFIGS } from '../constants';

export class FhevmClient {
  private instance: FhevmjsInstance | null = null;
  private config: FhevmClientConfig;
  private initialized = false;

  constructor(config: FhevmClientConfig) {
    this.config = config;
  }

  /**
   * Initialize the FHEVM client
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const networkConfig = typeof this.config.network === 'number'
        ? { chainId: this.config.network }
        : NETWORK_CONFIGS[this.config.network];

      this.instance = await createInstance({
        chainId: networkConfig.chainId,
        publicKey: networkConfig.publicKey,
        gatewayUrl: this.config.gatewayUrl || networkConfig.gatewayUrl,
        aclAddress: this.config.aclAddress || networkConfig.aclAddress,
        kmsVerifierAddress: this.config.kmsVerifierAddress || networkConfig.kmsVerifierAddress,
      });

      this.initialized = true;
    } catch (error) {
      throw new FhevmError(
        'Failed to initialize FHEVM client',
        'INITIALIZATION_ERROR',
        error
      );
    }
  }

  /**
   * Create a contract instance for encryption/decryption
   */
  async createContractInstance(params: InstanceParams): Promise<FhevmInstance> {
    if (!this.initialized || !this.instance) {
      throw new FhevmError(
        'Client not initialized. Call initialize() first',
        'NOT_INITIALIZED'
      );
    }

    const contractInstance = this.instance.createEncryptedInput(
      params.contractAddress,
      params.signer?.getAddress ? await params.signer.getAddress() : undefined
    );

    return {
      encrypt8: async (value: number) => {
        const encrypted = contractInstance.add8(value);
        return {
          data: encrypted.handles[0],
          handles: encrypted.handles,
        };
      },
      encrypt16: async (value: number) => {
        const encrypted = contractInstance.add16(value);
        return {
          data: encrypted.handles[0],
          handles: encrypted.handles,
        };
      },
      encrypt32: async (value: number) => {
        const encrypted = contractInstance.add32(value);
        return {
          data: encrypted.handles[0],
          handles: encrypted.handles,
        };
      },
      encrypt64: async (value: bigint) => {
        const encrypted = contractInstance.add64(value);
        return {
          data: encrypted.handles[0],
          handles: encrypted.handles,
        };
      },
      encryptBool: async (value: boolean) => {
        const encrypted = contractInstance.addBool(value);
        return {
          data: encrypted.handles[0],
          handles: encrypted.handles,
        };
      },
      encryptAddress: async (value: string) => {
        const encrypted = contractInstance.addAddress(value);
        return {
          data: encrypted.handles[0],
          handles: encrypted.handles,
        };
      },
    };
  }

  /**
   * Get the underlying fhevmjs instance
   */
  getInstance(): FhevmjsInstance | null {
    return this.instance;
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get client configuration
   */
  getConfig(): FhevmClientConfig {
    return { ...this.config };
  }
}
