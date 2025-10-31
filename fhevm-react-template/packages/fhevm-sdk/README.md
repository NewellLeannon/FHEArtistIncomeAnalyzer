# FHEVM SDK

Universal SDK for building confidential dApps with Fully Homomorphic Encryption.

## Features

- **Framework Agnostic**: Works with React, Vue, Node.js, and vanilla JavaScript
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Easy to Use**: Wagmi-like API structure familiar to Web3 developers
- **Complete**: Handles encryption, decryption, and contract interactions
- **Modular**: Import only what you need

## Installation

```bash
npm install @fhevm/sdk
```

## Quick Start

### Basic Usage

```typescript
import { FhevmClient } from '@fhevm/sdk';

// Initialize client
const client = new FhevmClient({ network: 'sepolia' });
await client.initialize();

// Create contract instance
const instance = await client.createContractInstance({
  contractAddress: '0x...',
});

// Encrypt data
const encrypted = await instance.encrypt32(42);

// Use in contract
await contract.submitData(encrypted.data);
```

### React

```typescript
import { useFhevm, useEncryption } from '@fhevm/sdk/react';

function MyComponent() {
  const { client, initialized } = useFhevm();
  const { encrypt32, loading } = useEncryption(client, contractAddress);

  const handleSubmit = async (value) => {
    const encrypted = await encrypt32(value);
    await contract.submitData(encrypted.data);
  };

  return <button onClick={() => handleSubmit(42)}>Submit</button>;
}
```

### Vue

```vue
<script setup>
import { useFhevm, useEncryption } from '@fhevm/sdk/vue';

const { client } = useFhevm();
const { encrypt } = useEncryption(client, contractAddress);

const handleSubmit = async (value) => {
  const encrypted = await encrypt(value, 'uint32');
  await contract.submitData(encrypted.data);
};
</script>
```

## API Overview

### Core Classes

- `FhevmClient`: Main client for FHEVM operations
- `FhevmInstance`: Contract-specific encryption instance

### Factory Functions

- `createFhevmClient()`: Create a new client
- `createAndInitializeFhevmClient()`: Create and initialize in one step
- `createQuickClient()`: Quick client with minimal config

### Encryption Functions

- `encrypt8()`, `encrypt16()`, `encrypt32()`, `encrypt64()`: Encrypt integers
- `encryptBool()`: Encrypt booleans
- `encryptAddress()`: Encrypt Ethereum addresses
- `batchEncrypt()`: Encrypt multiple values

### Decryption Functions

- `userDecrypt()`: Decrypt with user's private key
- `publicDecrypt()`: Decrypt public values
- `requestDecryption()`: Request decryption from gateway
- `batchDecrypt()`: Decrypt multiple values

### React Hooks

- `useFhevm()`: Client management hook
- `useEncryption()`: Encryption operations hook
- `useComputation()`: Homomorphic computation hook

### Vue Composables

- `useFhevm()`: Client management composable
- `useEncryption()`: Encryption operations composable

## Encryption Types

| Type | Size | Range |
|------|------|-------|
| uint8 | 8 bits | 0 - 255 |
| uint16 | 16 bits | 0 - 65,535 |
| uint32 | 32 bits | 0 - 4,294,967,295 |
| uint64 | 64 bits | 0 - 2^64 - 1 |
| bool | 1 bit | true/false |
| address | 160 bits | Ethereum address |

## Configuration

### Networks

- `sepolia`: Sepolia testnet
- `localhost`: Local development (1337)
- `hardhat`: Hardhat network (31337)
- Custom: Any chain ID (number)

### Advanced Options

```typescript
const client = new FhevmClient({
  network: 'sepolia',
  gatewayUrl: 'https://custom-gateway.example.com',
  aclAddress: '0x...',
  kmsVerifierAddress: '0x...',
});
```

## Examples

See the [examples](../../examples/) directory for complete working examples:

- **Next.js Demo**: Full-featured Next.js application
- **Artist Income Analyzer**: Privacy-preserving income analysis
- **Banking Example**: Encrypted balance management
- **Medical Records**: HIPAA-compliant health data

## Documentation

- [Getting Started](../../docs/GETTING_STARTED.md)
- [API Reference](../../docs/API.md)
- [Best Practices](../../docs/BEST_PRACTICES.md)

## Building

```bash
# Build all exports
npm run build:all

# Build core SDK
npm run build

# Build React
npm run build:react

# Build Vue
npm run build:vue
```

## Testing

```bash
npm test
```

## Type Checking

```bash
npm run type-check
```

## Linting

```bash
npm run lint
```

## License

BSD 3-Clause Clear License

## Links

- [FHEVM Documentation](https://docs.fhevm.zama.ai)
- [Zama Documentation](https://docs.zama.ai)
- [GitHub Repository](https://github.com/NewellLeannon/fhevm-react-template)
