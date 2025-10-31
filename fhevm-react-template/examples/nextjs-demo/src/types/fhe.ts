// FHE type definitions for the application

export type FHEBitSize = 8 | 16 | 32 | 64;

export interface FHEInstance {
  encrypt: (value: number, bits: FHEBitSize) => Promise<EncryptedValue>;
  decrypt: (handle: string) => Promise<DecryptedValue>;
  initialized: boolean;
}

export interface EncryptedValue {
  data: string;
  handle: string;
  type: FHEBitSize;
}

export interface DecryptedValue {
  value: number | bigint;
  type: FHEBitSize;
}

export interface FHEContext {
  instance: FHEInstance | null;
  loading: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
}
