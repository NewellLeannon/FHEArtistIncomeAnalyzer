# Getting Started with FHEVM SDK

This guide will help you get started with the FHEVM SDK for building privacy-preserving decentralized applications.

## Installation

```bash
npm install @fhevm/sdk
```

## Quick Start

### 1. Initialize the Client

```typescript
import { FhevmClient } from '@fhevm/sdk';

const client = new FhevmClient({
  network: 'sepolia',
});

await client.initialize();
```

### 2. Encrypt Data

```typescript
const instance = await client.createContractInstance({
  contractAddress: '0x...',
});

const encrypted = await instance.encrypt32(42);
```

### 3. Use in Smart Contract

```typescript
import { ethers } from 'ethers';

const contract = new ethers.Contract(address, abi, signer);
await contract.submitData(encrypted.data);
```

## Framework Integration

### React

```typescript
import { useFhevm, useEncryption } from '@fhevm/sdk/react';

function MyComponent() {
  const { client, initialized } = useFhevm();
  const { encrypt32, loading } = useEncryption(client, contractAddress);

  const handleSubmit = async (value: number) => {
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

const { client, initialized } = useFhevm();
const { encrypt, loading } = useEncryption(client, contractAddress);

const handleSubmit = async (value) => {
  const encrypted = await encrypt(value, 'uint32');
  await contract.submitData(encrypted.data);
};
</script>
```

### Node.js

```typescript
import { createQuickClient } from '@fhevm/sdk';

const client = await createQuickClient('sepolia');
const instance = await client.createContractInstance({
  contractAddress: '0x...',
});

const encrypted = await instance.encrypt32(42);
```

## Configuration

### Network Options

- `sepolia`: Sepolia testnet
- `localhost`: Local development
- `hardhat`: Hardhat network
- Custom chain ID (number)

### Advanced Configuration

```typescript
const client = new FhevmClient({
  network: 'sepolia',
  gatewayUrl: 'https://custom-gateway.example.com',
  aclAddress: '0x...',
  kmsVerifierAddress: '0x...',
});
```

## Encryption Types

| Type | Size | Range |
|------|------|-------|
| uint8 | 8 bits | 0 - 255 |
| uint16 | 16 bits | 0 - 65,535 |
| uint32 | 32 bits | 0 - 4,294,967,295 |
| uint64 | 64 bits | 0 - 18,446,744,073,709,551,615 |
| bool | 1 bit | true/false |
| address | 160 bits | Ethereum address |

## Example Use Cases

- **Private Banking**: Encrypted balance management
- **Medical Records**: HIPAA-compliant health data
- **Voting Systems**: Anonymous voting with verifiable results
- **Auction Systems**: Sealed-bid auctions
- **Gaming**: Hidden game state

## Next Steps

- [API Reference](./API.md)
- [Examples](../examples/)
- [Best Practices](./BEST_PRACTICES.md)
