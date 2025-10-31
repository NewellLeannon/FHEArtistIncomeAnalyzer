# FHEVM SDK Best Practices

Guidelines for building secure and efficient privacy-preserving applications.

## Security

### 1. Validate Inputs

Always validate data before encryption:

```typescript
function sanitizeValue(value: number, max: number): number {
  return Math.max(0, Math.min(max, Math.floor(value)));
}

const safeValue = sanitizeValue(userInput, 4294967295);
const encrypted = await instance.encrypt32(safeValue);
```

### 2. Verify Contract Addresses

```typescript
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

if (!isValidAddress(contractAddress)) {
  throw new Error('Invalid contract address');
}
```

### 3. Handle Errors Gracefully

```typescript
try {
  const encrypted = await instance.encrypt32(value);
  await contract.submitData(encrypted.data);
} catch (error) {
  if (error instanceof EncryptionError) {
    console.error('Encryption failed:', error.message);
    // Handle encryption-specific errors
  } else {
    console.error('Unexpected error:', error);
    // Handle other errors
  }
}
```

## Performance

### 1. Reuse Client Instances

```typescript
// Good: Reuse client
const client = await createQuickClient('sepolia');
const instance1 = await client.createContractInstance({ contractAddress: addr1 });
const instance2 = await client.createContractInstance({ contractAddress: addr2 });

// Bad: Create multiple clients
const client1 = await createQuickClient('sepolia');
const client2 = await createQuickClient('sepolia');
```

### 2. Batch Operations

```typescript
// Good: Batch encrypt
const values = [
  { type: 'uint32', value: 100 },
  { type: 'uint32', value: 200 },
  { type: 'uint32', value: 300 },
];
const encrypted = await batchEncrypt(instance, values);

// Bad: Individual encryptions
const enc1 = await instance.encrypt32(100);
const enc2 = await instance.encrypt32(200);
const enc3 = await instance.encrypt32(300);
```

### 3. Use Appropriate Types

Choose the smallest type that fits your data:

```typescript
// Good: Use uint8 for small values
const age = await instance.encrypt8(25);

// Bad: Use uint32 for small values
const age = await instance.encrypt32(25);
```

## React Best Practices

### 1. Use Context for Global State

```typescript
import { createContext, useContext } from 'react';
import { useFhevm } from '@fhevm/sdk/react';

const FhevmContext = createContext(null);

export function FhevmProvider({ children }) {
  const fhevm = useFhevm();
  return <FhevmContext.Provider value={fhevm}>{children}</FhevmContext.Provider>;
}

export function useFhevmContext() {
  return useContext(FhevmContext);
}
```

### 2. Handle Loading States

```typescript
function MyComponent() {
  const { client, initialized, isLoading } = useFhevm();

  if (isLoading) {
    return <div>Initializing FHEVM...</div>;
  }

  if (!initialized) {
    return <div>Failed to initialize</div>;
  }

  return <div>Ready!</div>;
}
```

### 3. Cleanup on Unmount

```typescript
useEffect(() => {
  const controller = new AbortController();

  async function encrypt() {
    try {
      const encrypted = await instance.encrypt32(value);
      if (!controller.signal.aborted) {
        setEncryptedData(encrypted);
      }
    } catch (error) {
      console.error(error);
    }
  }

  encrypt();

  return () => controller.abort();
}, [value]);
```

## Data Privacy

### 1. Never Log Encrypted Data in Production

```typescript
// Good
console.log('Data encrypted successfully');

// Bad
console.log('Encrypted data:', encrypted.data);
```

### 2. Clear Sensitive Data

```typescript
function handleSubmit() {
  const encrypted = await instance.encrypt32(sensitiveValue);
  await contract.submitData(encrypted.data);

  // Clear the input
  setSensitiveValue('');
}
```

### 3. Use HTTPS for All Connections

Ensure your gateway URL uses HTTPS in production:

```typescript
const client = new FhevmClient({
  network: 'sepolia',
  gatewayUrl: 'https://gateway.example.com', // Not http://
});
```

## Testing

### 1. Mock the Client in Tests

```typescript
jest.mock('@fhevm/sdk', () => ({
  FhevmClient: jest.fn().mockImplementation(() => ({
    initialize: jest.fn().mockResolvedValue(undefined),
    createContractInstance: jest.fn().mockResolvedValue({
      encrypt32: jest.fn().mockResolvedValue({
        data: new Uint8Array([1, 2, 3]),
        handles: ['0x123'],
      }),
    }),
  })),
}));
```

### 2. Test Error Scenarios

```typescript
it('handles encryption errors', async () => {
  const instance = {
    encrypt32: jest.fn().mockRejectedValue(new Error('Encryption failed')),
  };

  await expect(instance.encrypt32(42)).rejects.toThrow('Encryption failed');
});
```

## Deployment

### 1. Environment Variables

```typescript
const client = new FhevmClient({
  network: process.env.NEXT_PUBLIC_FHEVM_NETWORK,
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL,
});
```

### 2. Separate Dev and Production Configs

```typescript
const config = process.env.NODE_ENV === 'production'
  ? { network: 'sepolia', gatewayUrl: 'https://prod-gateway.example.com' }
  : { network: 'localhost', gatewayUrl: 'http://localhost:8545' };

const client = new FhevmClient(config);
```

## Common Pitfalls

### ❌ Don't: Initialize multiple clients

```typescript
// Bad
function MyComponent() {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const init = async () => {
      const c = new FhevmClient({ network: 'sepolia' });
      await c.initialize();
      setClient(c);
    };
    init();
  }, []);
}
```

### ✅ Do: Use the useFhevm hook

```typescript
// Good
function MyComponent() {
  const { client, initialized } = useFhevm();
}
```

### ❌ Don't: Encrypt on every render

```typescript
// Bad
function MyComponent({ value }) {
  const encrypted = instance.encrypt32(value); // Re-encrypts on every render
}
```

### ✅ Do: Use callbacks or effects

```typescript
// Good
function MyComponent({ value }) {
  const handleEncrypt = useCallback(async () => {
    const encrypted = await instance.encrypt32(value);
  }, [value]);
}
```
