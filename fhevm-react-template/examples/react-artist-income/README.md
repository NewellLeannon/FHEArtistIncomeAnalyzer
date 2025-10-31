# React Artist Income Analyzer

React implementation with FHEVM SDK integration.

## Overview

This example demonstrates FHEVM SDK usage in a standard React application (Create React App or Vite).

## Features

- React 18
- FHEVM SDK integration
- React Hooks for FHE operations
- Reusable components

## Quick Start

```bash
npm install
npm run dev
```

## SDK Integration

### Using React Hooks

```typescript
import { useFhevm, useEncryption } from '@fhevm/sdk/react';

function IncomeForm() {
  const { client, initialized } = useFhevm({
    network: 'sepolia',
  });
  
  const { encrypt32, loading } = useEncryption(contractAddress);
  
  const handleSubmit = async (value: number) => {
    const encrypted = await encrypt32(value);
    await contract.submitData(encrypted.data);
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(42);
    }}>
      <button disabled={!initialized || loading}>
        Submit
      </button>
    </form>
  );
}
```

## Learn More

- [FHEVM SDK React Hooks](../../packages/fhevm-sdk/README.md#react-hooks)
- [React Documentation](https://react.dev)

## License

BSD-3-Clause-Clear
