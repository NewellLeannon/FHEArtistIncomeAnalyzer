# FHEVM SDK API Reference

Complete API documentation for the FHEVM SDK.

## Core API

### FhevmClient

Main client class for FHEVM operations.

```typescript
class FhevmClient {
  constructor(config: FhevmClientConfig)
  initialize(): Promise<void>
  createContractInstance(params: InstanceParams): Promise<FhevmInstance>
  getInstance(): FhevmjsInstance | null
  isInitialized(): boolean
  getConfig(): FhevmClientConfig
}
```

#### FhevmClientConfig

```typescript
interface FhevmClientConfig {
  network: SupportedNetwork;
  gatewayUrl?: string;
  aclAddress?: string;
  kmsVerifierAddress?: string;
}

type SupportedNetwork = 'sepolia' | 'localhost' | 'hardhat' | number;
```

### FhevmInstance

Contract-specific encryption instance.

```typescript
interface FhevmInstance {
  encrypt8(value: number): Promise<EncryptionResult>
  encrypt16(value: number): Promise<EncryptionResult>
  encrypt32(value: number): Promise<EncryptionResult>
  encrypt64(value: bigint): Promise<EncryptionResult>
  encryptBool(value: boolean): Promise<EncryptionResult>
  encryptAddress(value: string): Promise<EncryptionResult>
}
```

#### EncryptionResult

```typescript
interface EncryptionResult {
  data: Uint8Array;
  handles: string[];
}
```

## Factory Functions

### createFhevmClient

Create a new FHEVM client.

```typescript
function createFhevmClient(config: FhevmClientConfig): FhevmClient
```

### createAndInitializeFhevmClient

Create and initialize a client in one step.

```typescript
async function createAndInitializeFhevmClient(
  config: FhevmClientConfig
): Promise<FhevmClient>
```

### createQuickClient

Create a client with minimal configuration.

```typescript
async function createQuickClient(
  network: SupportedNetwork = 'sepolia'
): Promise<FhevmClient>
```

## Encryption Utilities

### encrypt8, encrypt16, encrypt32, encrypt64

Encrypt numeric values.

```typescript
async function encrypt32(
  instance: FhevmInstance,
  value: number
): Promise<EncryptionResult>
```

### encryptBool

Encrypt boolean values.

```typescript
async function encryptBool(
  instance: FhevmInstance,
  value: boolean
): Promise<EncryptionResult>
```

### encryptAddress

Encrypt Ethereum addresses.

```typescript
async function encryptAddress(
  instance: FhevmInstance,
  value: string
): Promise<EncryptionResult>
```

### batchEncrypt

Encrypt multiple values at once.

```typescript
async function batchEncrypt(
  instance: FhevmInstance,
  values: Array<{
    type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
    value: number | bigint | boolean | string;
  }>
): Promise<EncryptionResult[]>
```

## Decryption Utilities

### userDecrypt

Decrypt using user's private key (EIP-712 signature).

```typescript
async function userDecrypt<T>(
  params: DecryptionParams
): Promise<DecryptionResult<T>>

interface DecryptionParams {
  contractAddress: string;
  handle: string;
  signer: Signer;
}
```

### publicDecrypt

Decrypt public values.

```typescript
async function publicDecrypt<T>(
  params: PublicDecryptionParams
): Promise<DecryptionResult<T>>

interface PublicDecryptionParams {
  contractAddress: string;
  handle: string;
}
```

### requestDecryption

Request decryption from gateway.

```typescript
async function requestDecryption(
  contract: Contract,
  handle: string,
  signer: Signer
): Promise<DecryptionResult<any>>
```

### batchDecrypt

Decrypt multiple handles.

```typescript
async function batchDecrypt(
  handles: string[],
  params: Omit<DecryptionParams, 'handle'>
): Promise<DecryptionResult<any>[]>
```

## React Hooks

### useFhevm

Main hook for FHEVM client management.

```typescript
function useFhevm(config?: FhevmClientConfig): {
  client: FhevmClient | null;
  initialized: boolean;
  error: Error | null;
  isLoading: boolean;
}
```

### useEncryption

Hook for encryption operations.

```typescript
function useEncryption(
  client: FhevmClient | null,
  contractAddress: string
): {
  encrypt8: (value: number) => Promise<EncryptionResult>;
  encrypt16: (value: number) => Promise<EncryptionResult>;
  encrypt32: (value: number) => Promise<EncryptionResult>;
  encrypt64: (value: bigint) => Promise<EncryptionResult>;
  encryptBool: (value: boolean) => Promise<EncryptionResult>;
  encryptAddress: (value: string) => Promise<EncryptionResult>;
  loading: boolean;
  error: Error | null;
}
```

### useComputation

Hook for homomorphic computations.

```typescript
function useComputation(
  client: FhevmClient | null,
  contractAddress: string
): {
  computeAdd: (a: number, b: number) => Promise<void>;
  computeSub: (a: number, b: number) => Promise<void>;
  computeMul: (a: number, b: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
  result: number | null;
}
```

## Vue Composables

### useFhevm (Vue)

```typescript
function useFhevm(config?: FhevmClientConfig): {
  client: Ref<FhevmClient | null>;
  initialized: Ref<boolean>;
  error: Ref<Error | null>;
  isLoading: Ref<boolean>;
  reinitialize: () => Promise<void>;
}
```

### useEncryption (Vue)

```typescript
function useEncryption(
  client: Ref<FhevmClient | null>,
  contractAddress: string
): {
  encrypt: <T>(value: T, type: EncryptionType) => Promise<EncryptionResult>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
}
```

## Error Classes

```typescript
class FhevmError extends Error
class EncryptionError extends FhevmError
class DecryptionError extends FhevmError
class InitializationError extends FhevmError
class NetworkError extends FhevmError
class SignerError extends FhevmError
```

## Constants

```typescript
const NETWORK_CONFIGS: {
  sepolia: NetworkConfig;
  localhost: NetworkConfig;
  hardhat: NetworkConfig;
}

const ENCRYPTION_TYPES: {
  EUINT8: 'euint8';
  EUINT16: 'euint16';
  EUINT32: 'euint32';
  EUINT64: 'euint64';
  EBOOL: 'ebool';
  EADDRESS: 'eaddress';
}

const DEFAULT_TIMEOUT: 60000;
```
