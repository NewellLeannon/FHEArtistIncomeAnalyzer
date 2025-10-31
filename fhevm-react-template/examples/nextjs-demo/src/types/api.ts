// API type definitions

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptionRequest {
  value: number | string;
  type: number;
}

export interface EncryptionResponse {
  encrypted: boolean;
  handle?: string;
  data?: string;
}

export interface DecryptionRequest {
  handle: string;
  signature?: string;
}

export interface DecryptionResponse {
  decrypted: boolean;
  value?: number | string;
}

export interface ComputationRequest {
  operation: string;
  operands: any[];
}

export interface ComputationResponse {
  result: any;
  operation: string;
}

export interface KeysResponse {
  publicKey: string;
  chainId: number;
}
