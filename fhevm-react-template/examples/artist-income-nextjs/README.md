# Artist Income Analyzer - Next.js Example

A privacy-preserving artist income analysis platform built with Next.js and FHEVM SDK.

## Overview

This example demonstrates the FHEVM SDK integration with Next.js for building confidential dApps. Artists can submit encrypted income data while maintaining complete privacy through Fully Homomorphic Encryption.

## Features

- **Next.js 14** with App Router
- **FHEVM SDK Integration** for encryption/decryption
- **Privacy-Preserving Analytics** on encrypted data
- **Web3 Wallet Integration** (MetaMask)
- **TailwindCSS** for styling
- **TypeScript** for type safety

## Live Demo

**Application**: [https://fhe-artist-income-analyzer.vercel.app/](https://fhe-artist-income-analyzer.vercel.app/)

**Contract**: 0xee7272C646331Db35A7217ed4c2a3aA8b17854aE (Sepolia)

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your environment variables

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## SDK Usage

### Initialize FHEVM Client

```typescript
import { FhevmClient } from '@fhevm/sdk';

const client = new FhevmClient({
  network: 'sepolia',
});

await client.initialize();
```

### Encrypt Data

```typescript
const instance = await client.createContractInstance(contractAddress);
const encryptedIncome = await instance.encrypt32(50000);
```

### Submit to Contract

```typescript
await contract.submitIncomeData(
  encryptedIncome.data,
  encryptedArtworksSold.data,
  encryptedAveragePrice.data,
  encryptedRoyalties.data,
  encryptedCommissions.data
);
```

## Project Structure

```
artist-income-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ConnectWallet.tsx
│   │   ├── EncryptionDemo.tsx
│   │   └── StatsDisplay.tsx
│   └── lib/
│       └── fhevm.ts
├── public/
├── package.json
└── next.config.js
```

## Environment Variables

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xee7272C646331Db35A7217ed4c2a3aA8b17854aE
NEXT_PUBLIC_NETWORK=sepolia
NEXT_PUBLIC_GATEWAY_URL=https://gateway.sepolia.fhenix.zone
```

## Key Components

### Artist Registration

```typescript
async function registerArtist(artistId: string) {
  const tx = await contract.registerArtist(artistId);
  await tx.wait();
}
```

### Income Submission

```typescript
async function submitIncome(data: IncomeData) {
  const instance = await client.createContractInstance(contractAddress);
  
  const encrypted = {
    totalIncome: await instance.encrypt64(BigInt(data.totalIncome)),
    artworksSold: await instance.encrypt32(data.artworksSold),
    averagePrice: await instance.encrypt32(data.averagePrice),
    royalties: await instance.encrypt32(data.royalties),
    commissions: await instance.encrypt32(data.commissions),
  };
  
  await contract.submitIncomeData(
    encrypted.totalIncome.data,
    encrypted.artworksSold.data,
    encrypted.averagePrice.data,
    encrypted.royalties.data,
    encrypted.commissions.data
  );
}
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama Documentation](https://docs.zama.ai)
- [fhEVM Documentation](https://docs.fhevm.zama.ai)

## License

BSD-3-Clause-Clear
