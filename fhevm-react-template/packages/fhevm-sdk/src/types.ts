import type { Signer, Contract } from 'ethers';

export type SupportedNetwork = 'sepolia' | 'localhost' | 'hardhat' | number;

export interface FhevmClientConfig {
  network: SupportedNetwork;
  gatewayUrl?: string;
  aclAddress?: string;
  kmsVerifierAddress?: string;
}

export interface EncryptionResult {
  data: Uint8Array;
  handles: string[];
}

export interface DecryptionParams {
  contractAddress: string;
  handle: string;
  signer: Signer;
}

export interface PublicDecryptionParams {
  contractAddress: string;
  handle: string;
}

export interface InstanceParams {
  contractAddress: string;
  signer?: Signer;
}

export interface FhevmInstance {
  encrypt8(value: number): Promise<EncryptionResult>;
  encrypt16(value: number): Promise<EncryptionResult>;
  encrypt32(value: number): Promise<EncryptionResult>;
  encrypt64(value: bigint): Promise<EncryptionResult>;
  encryptBool(value: boolean): Promise<EncryptionResult>;
  encryptAddress(value: string): Promise<EncryptionResult>;
}

export interface ContractInteractionConfig {
  contract: Contract;
  instance: FhevmInstance;
  signer: Signer;
}

export type EncryptedValue = {
  data: Uint8Array;
  type: 'euint8' | 'euint16' | 'euint32' | 'euint64' | 'ebool' | 'eaddress';
};

export type DecryptionMethod = 'user' | 'public';

export interface DecryptionResult<T = any> {
  value: T;
  success: boolean;
  error?: string;
}
