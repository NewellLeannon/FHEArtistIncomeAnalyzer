// FHE Type definitions

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export interface EncryptedData {
  data: Uint8Array;
  type: FHEDataType;
  handle: string;
}

export interface DecryptionRequest {
  handle: string;
  signature: string;
}

export interface ComputationRequest {
  operation: 'add' | 'sub' | 'mul' | 'div' | 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
  operands: EncryptedData[];
}

export interface FHEConfig {
  network: string;
  contractAddress?: string;
  chainId: number;
}
