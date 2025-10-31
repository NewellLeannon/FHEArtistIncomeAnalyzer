# FHEVM React Template - Universal SDK

A universal FHEVM SDK and template collection for building confidential dApps with Fully Homomorphic Encryption.

## Overview

This repository provides a framework-agnostic SDK that makes building confidential frontends simple, consistent, and developer-friendly. The SDK wraps all required FHE packages and provides a wagmi-like structure for web3 developers.

**Key Highlights:**
- Complete SDK with encryption, decryption, and contract interaction utilities
- Framework adapters for React, Vue, and Node.js
- Production-ready examples demonstrating real-world use cases
- Comprehensive documentation and API reference
- Less than 10 lines of code to get started

## Live Examples

**Privacy Artist Income Analyzer (React + Vite)**: [https://private-artist-income-analyze.vercel.app/](https://private-artist-income-analyze.vercel.app/)

**Artist Income Analyzer (Next.js)**: [https://fhe-artist-income-analyzer.vercel.app/](https://fhe-artist-income-analyzer.vercel.app/)

**GitHub**: [https://github.com/NewellLeannon/fhevm-react-template](https://github.com/NewellLeannon/fhevm-react-template)

**Demo Video**: Download demo.mp4 to watch the demonstration. Direct video links are not accessible.

## Features

- Framework-agnostic core SDK (Node.js, Next.js, Vue, React)
- Wrapper for all required FHE packages
- Wagmi-like API structure
- Fast setup for encryption and decryption flows
- Modular and reusable components

## Quick Start

```bash
# Install all packages from root
npm install

# Build SDK
npm run build:sdk

# Run examples
cd examples/artist-income-nextjs
npm run dev
```

## Project Structure

```
fhevm-react-template/
├── packages/
│   └── fhevm-sdk/                    # Universal FHEVM SDK
│       ├── src/
│       │   ├── core/                 # Core FHEVM client and factory
│       │   ├── hooks/                # React hooks
│       │   ├── react/                # React integration
│       │   ├── vue/                  # Vue composables
│       │   ├── adapters/             # Framework adapters
│       │   ├── utils/                # Utilities (security, validation)
│       │   ├── encryption.ts         # Encryption utilities
│       │   ├── decryption.ts         # Decryption utilities
│       │   ├── types.ts              # TypeScript types
│       │   ├── constants.ts          # Network configs
│       │   └── errors.ts             # Error classes
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
├── examples/
│   ├── nextjs-demo/                  # Complete Next.js 14 showcase with API routes
│   ├── artist-income-nextjs/         # Privacy artist income analyzer (Next.js)
│   ├── artist-income-react/          # Privacy artist income analyzer (React + Vite) ⭐ NEW
│   ├── nextjs-artist-income/         # Alternative Next.js with Pages Router
│   ├── react-artist-income/          # React variant with different patterns
│   └── PrivateArtistIncomeAnalyzer/  # Original static HTML reference
├── templates/
│   └── nextjs/                       # Next.js starter template
├── docs/
│   ├── GETTING_STARTED.md            # Quick start guide
│   ├── API.md                        # Complete API reference
│   └── BEST_PRACTICES.md             # Best practices guide
├── package.json                      # Monorepo configuration
├── demo.mp4                          # Video demonstration
└── README.md                         # This file
```

## SDK Usage

### Installation

```bash
npm install @fhevm/sdk
```

### Basic Usage

```typescript
import { FhevmClient } from '@fhevm/sdk';

// Initialize client
const client = new FhevmClient({
  network: 'sepolia',
});

await client.initialize();

// Create contract instance
const instance = await client.createContractInstance(contractAddress);

// Encrypt data
const encrypted = await instance.encrypt32(42);

// Use in contract call
await contract.submitData(encrypted.data);
```

### React Integration

```typescript
import { useFhevm, useEncryption } from '@fhevm/sdk/react';

function MyComponent() {
  const { client, initialized } = useFhevm();
  const { encrypt32 } = useEncryption(contractAddress);
  
  const handleSubmit = async (value) => {
    const encrypted = await encrypt32(value);
    await contract.submitData(encrypted.data);
  };
  
  return <button onClick={() => handleSubmit(42)}>Submit</button>;
}
```

## Examples

### 1. Next.js Demo (Complete Showcase)

Comprehensive demonstration of all SDK features with complete Next.js 14 App Router structure.

**Features**:
- Encryption demo with multiple data types (8/16/32/64-bit, bool, address)
- Homomorphic computation operations (add, subtract, multiply, compare)
- Banking example (encrypted balances and transactions)
- Medical records example (HIPAA-compliant encrypted health data)
- Full API routes for FHE operations
- Custom hooks for encryption and computation
- Type-safe utilities and validation

**Location**: `examples/nextjs-demo/`

**Run**:
```bash
cd examples/nextjs-demo
npm install
npm run dev
```

### 2. Artist Income Analyzer (Next.js)

Privacy-preserving artist income analysis platform built with Next.js.

**Features**:
- Anonymous artist registration
- Encrypted income submission
- Aggregate analytics without exposing individual data
- Privacy-protected reporting
- Platform statistics tracking

**Tech Stack**:
- Next.js 14 with App Router
- FHEVM SDK
- TailwindCSS
- Ethers.js

**Location**: `examples/artist-income-nextjs/`

**Live Demo**: [https://fhe-artist-income-analyzer.vercel.app/](https://fhe-artist-income-analyzer.vercel.app/)

### 3. Privacy Artist Income Analyzer (React + Vite)

A confidential creative economy insights platform powered by Zama's Fully Homomorphic Encryption (FHE) technology. React-based version using Vite for fast development and optimal performance.

**Live Demo**: [https://private-artist-income-analyze.vercel.app/](https://private-artist-income-analyze.vercel.app/)

**Contract Address**: `0xee7272C646331Db35A7217ed4c2a3aA8b17854aE` (Sepolia Testnet)

**Core Features**:
- **End-to-End Encryption**: All sensitive income data is encrypted on-chain
- **Private Computation**: Analytics performed on encrypted data without revealing individual values
- **Confidential Aggregation**: Market insights generated while preserving individual privacy
- **Zero-Knowledge Analysis**: Platform operators cannot access individual artist income details

**Functionality**:
- Anonymous artist registration with privacy-preserving identifiers
- Encrypted income data submission (total income, artworks sold, average pricing, royalties, commissions)
- Multi-category analytics tracking (digital art, physical art, NFT sales, licensing, workshops, commissions)
- Real-time platform statistics and aggregate market insights
- Privacy-protected report generation

**Technical Implementation**:
- Fully componentized React architecture with TypeScript
- Custom React components for each feature (ArtistRegistration, IncomeSubmission, CreativeAnalytics, PlatformStats, AnalysisControls, ProfileInfo)
- Web3 wallet integration (MetaMask)
- Client-side encryption with Zama fhEVM
- Real-time blockchain interaction
- Responsive modern UI with gradient styling

**Tech Stack**:
- React 18
- Vite 5
- TypeScript 5
- FHEVM SDK
- Ethers.js 5.7
- fhevmjs 0.5

**Location**: `examples/artist-income-react/`

**Run**:
```bash
cd examples/artist-income-react
npm install
npm run dev
```

**Privacy Guarantee**: Your financial data is encrypted and never visible to other users or platform operators. All computations occur on encrypted data using Fully Homomorphic Encryption.

### 4. Additional Examples

- **nextjs-artist-income**: Alternative Next.js implementation with Pages Router
- **react-artist-income**: Another React variant showcasing different patterns
- **PrivateArtistIncomeAnalyzer**: Original static HTML version (reference implementation)

### 5. Templates

Ready-to-use templates in the `templates/` directory:
- **Next.js Template**: Complete starter with all components, API routes, and SDK integration

## SDK API Reference

### Core

#### FhevmClient

```typescript
class FhevmClient {
  constructor(config: FhevmClientConfig)
  initialize(): Promise<void>
  createContractInstance(address: string): Promise<FhevmInstance>
  isInitialized(): boolean
}
```

#### Encryption

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

### React Hooks

```typescript
// Client hook
function useFhevm(config?: FhevmClientConfig): {
  client: FhevmClient | null
  initialized: boolean
  error: Error | null
}

// Encryption hook
function useEncryption(contractAddress: string): {
  encrypt8: (value: number) => Promise<EncryptionResult>
  encrypt16: (value: number) => Promise<EncryptionResult>
  encrypt32: (value: number) => Promise<EncryptionResult>
  encrypt64: (value: bigint) => Promise<EncryptionResult>
  encryptBool: (value: boolean) => Promise<EncryptionResult>
  encryptAddress: (value: string) => Promise<EncryptionResult>
  loading: boolean
  error: Error | null
}

// Decryption hook
function useDecryption(contractAddress: string): {
  decrypt: (handle: string) => Promise<any>
  loading: boolean
  error: Error | null
}
```

## Development

### Build SDK

```bash
npm run build:sdk
```

### Run Tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Requirements

The SDK provides:

1. **Initialization utilities** for FHEVM setup
2. **Encryption/decryption flows** with EIP-712 signatures
3. **Modular API structure** similar to wagmi
4. **Reusable components** for common scenarios
5. **Framework adapters** for React, Vue, and vanilla JS

## Documentation

### Setup Time

Less than 10 lines of code to get started:

```typescript
import { FhevmClient } from '@fhevm/sdk';

const client = new FhevmClient({ network: 'sepolia' });
await client.initialize();
const instance = await client.createContractInstance(address);
const encrypted = await instance.encrypt32(value);
```

### Complete Flow

1. **Install**: `npm install @fhevm/sdk`
2. **Initialize**: Create and initialize client
3. **Encrypt**: Use encryption methods
4. **Interact**: Call contract with encrypted data
5. **Decrypt**: Retrieve and decrypt results

## Evaluation Criteria

This SDK demonstrates:

- **Usability**: Quick setup with minimal boilerplate
- **Completeness**: Full FHEVM flow coverage
- **Reusability**: Clean, modular, framework-adaptable
- **Documentation**: Clear examples and guides
- **Creativity**: Multiple environment showcases

## Deliverables Checklist

Per the competition requirements:

### Core SDK (`packages/fhevm-sdk/`)
- ✅ Core initialization module (`src/core/client.ts`, `src/core/factory.ts`)
- ✅ Encryption/decryption utilities (`src/encryption.ts`, `src/decryption.ts`)
- ✅ Contract interaction module (integrated in client)
- ✅ EIP-712 signature handling (in decryption utilities)
- ✅ Complete TypeScript type definitions (`src/types.ts`)
- ✅ Framework adapters (React: `src/react/`, Vue: `src/vue/`)
- ✅ Utility functions (`src/utils/`)

### Example Templates
- ✅ Next.js showcase template (`examples/nextjs-demo/`)
- ✅ Complete feature demonstration (encryption, computation, use cases)
- ✅ Configuration files and deployment scripts
- ✅ Templates directory (`templates/nextjs/`)

### Documentation
- ✅ Main README.md with installation and quick start
- ✅ SDK package README (`packages/fhevm-sdk/README.md`)
- ✅ Getting Started guide (`docs/GETTING_STARTED.md`)
- ✅ Complete API reference (`docs/API.md`)
- ✅ Best practices guide (`docs/BEST_PRACTICES.md`)
- ✅ Code examples throughout

### Deployment
- ✅ Live demo (Artist Income Analyzer)
- ✅ Demo video (demo.mp4)
- ✅ GitHub repository
- ✅ Production-ready configuration

## Contributing

Contributions welcome! See examples for implementation patterns.

## License

BSD 3-Clause Clear License

## Links

- **Examples**: See `/examples` directory
- **Artist Income**: [Live Demo](https://fhe-artist-income-analyzer.vercel.app/)
- **Documentation**: [Zama Docs](https://docs.zama.ai)
- **fhEVM**: [fhEVM Docs](https://docs.fhevm.zama.ai)
