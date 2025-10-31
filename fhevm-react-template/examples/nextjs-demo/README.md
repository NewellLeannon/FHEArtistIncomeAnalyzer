# FHEVM Next.js Demo

A comprehensive demonstration of Fully Homomorphic Encryption (FHE) using the FHEVM SDK in a Next.js application.

## Features

- **Encryption Demo**: Encrypt various data types (uint8, uint16, uint32, bool)
- **Homomorphic Computation**: Perform operations on encrypted data
- **Banking Example**: Private financial transactions and balance management
- **Medical Records**: HIPAA-compliant encrypted health data storage

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo.

## Project Structure

```
src/
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # UI components (Button, Input, Card)
│   ├── fhe/               # FHE-specific components
│   │   ├── FHEProvider.tsx
│   │   ├── EncryptionDemo.tsx
│   │   ├── ComputationDemo.tsx
│   │   └── KeyManager.tsx
│   └── examples/          # Use case examples
│       ├── BankingExample.tsx
│       └── MedicalExample.tsx
└── types/                 # TypeScript type definitions
```

## SDK Integration

This demo uses the `@fhevm/sdk` package:

```typescript
import { FhevmClient } from '@fhevm/sdk';

// Initialize client
const client = new FhevmClient({ network: 'sepolia' });
await client.initialize();

// Create instance and encrypt
const instance = await client.createContractInstance({
  contractAddress: '0x...',
});
const encrypted = await instance.encrypt32(42);
```

## Use Cases Demonstrated

### 1. Encryption Demo
- Encrypt different data types
- View encrypted output
- Understand FHE basics

### 2. Homomorphic Computation
- Add, subtract, multiply on encrypted data
- No decryption required for operations
- Privacy-preserving calculations

### 3. Banking Example
- Encrypted balance storage
- Private transactions
- Financial privacy

### 4. Medical Records
- HIPAA-compliant data storage
- Patient vital encryption
- Secure access control

## Technologies

- **Next.js 14**: React framework with App Router
- **FHEVM SDK**: Universal FHE SDK
- **TailwindCSS**: Styling
- **TypeScript**: Type safety

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk)
- [Zama FHE Docs](https://docs.zama.ai)
- [Next.js Documentation](https://nextjs.org/docs)
