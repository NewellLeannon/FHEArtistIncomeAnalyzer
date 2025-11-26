# FHE Artist Income Analyzer

A privacy-preserving analytics platform powered by Zama's Fully Homomorphic Encryption (FHE) technology. Artists submit confidential income data, which is aggregated and analyzed using encrypted computation without revealing individual information.

## 🌐 Live Demos

### Production Deployments

**React + Vite Version:** [https://private-artist-income-analyze.vercel.app/](https://private-artist-income-analyze.vercel.app/) ⭐ NEW

**Next.js Version:** [https://fhe-artist-income-analyzer.vercel.app/](https://fhe-artist-income-analyzer.vercel.app/)

### Resources

**GitHub Repository:** [https://github.com/NewellLeannon/FHEArtistIncomeAnalyzer](https://github.com/NewellLeannon/FHEArtistIncomeAnalyzer)

**Demo Video:** Download `demo.mp4` from the repository to watch the platform demonstration
## 📋 Overview

Privacy Artist Income Analyzer is a revolutionary platform that enables artists to submit their income data while maintaining complete privacy through Fully Homomorphic Encryption (FHE). The platform aggregates encrypted data to generate valuable market insights without ever exposing individual artist information.

## 🎯 Core Concepts

### Fully Homomorphic Encryption (FHE)

This platform leverages Zama's FHE technology to process encrypted data without decryption. Key features include:

- **End-to-End Encryption**: All sensitive income data is encrypted on-chain
- **Private Computation**: Analytics are performed on encrypted data without revealing individual values
- **Confidential Aggregation**: Market insights are generated from collective data while preserving individual privacy
- **Zero-Knowledge Analysis**: Platform operators cannot access individual artist income details

### Confidential Creator Earnings

The platform focuses on protecting sensitive financial information for creative professionals:

- **Anonymous Registration**: Artists register with pseudonymous identifiers
- **Encrypted Income Submission**: All financial data (sales, royalties, commissions) is encrypted before submission
- **Private Analytics**: Individual earnings remain confidential while contributing to aggregate market research
- **Secure Reporting**: Generated insights provide market benchmarks without compromising privacy

## 🔐 Smart Contract

**Contract Address:** `0xee7272C646331Db35A7217ed4c2a3aA8b17854aE`

**Network:** Sepolia Testnet

The FHE-enabled smart contract handles:
- Artist registration with privacy-preserving identifiers
- Encrypted income data submission
- Confidential computation of aggregate statistics
- **Gateway callback mechanism for asynchronous decryption**
- **Timeout protection with configurable duration constraints**
- **Refund mechanism for failed decryption operations**
- Privacy-protected report generation with cryptographic verification

## ✨ Key Features

### For Artists

- **Confidential Income Tracking**: Submit detailed income data including:
  - Total creative income
  - Artworks sold
  - Average pricing
  - Royalty earnings
  - Commission income

- **Multi-Category Analytics**: Track earnings across various creative streams:
  - Digital art sales
  - Physical art sales
  - NFT sales
  - Licensing revenue
  - Workshop earnings
  - Custom commissions

- **Privacy Guarantee**: Your financial data is encrypted and never visible to other users or platform operators

### For the Creative Economy

- **Market Insights**: Generate aggregate statistics for the creative industry
- **Benchmarking**: Understand market trends without compromising individual privacy
- **Transparent Methodology**: All computations are verifiable on-chain
- **Fair Data Contribution**: Artists contribute to collective knowledge while maintaining confidentiality

## 📊 Platform Statistics

The platform provides real-time insights including:
- Total number of registered artists
- Current analysis session ID
- Last report generation timestamp
- Aggregate market trends (without individual data exposure)

## 🎬 Demo Materials

### FHEArtistIncomeAnalyzer.mp4

A comprehensive video walkthrough showcasing:
- Artist registration process
- Encrypted income data submission
- Creative analytics interface
- Privacy-preserving report generation
- Real-time platform statistics

*[Video demonstration available in repository]*

### FHEArtistIncomeAnalyzer.png


*[Screenshots available in repository]*

## 🛡️ Privacy & Security

### How FHE Protects Your Data

1. **Client-Side Encryption**: All sensitive data is encrypted in your browser before transmission
2. **Encrypted Storage**: Data remains encrypted on the blockchain
3. **Confidential Computation**: Smart contracts perform calculations on encrypted data using FHE operations
4. **Aggregate-Only Results**: Only statistical aggregates are revealed, never individual values
5. **No Backdoors**: Even contract owners cannot decrypt individual submissions

### Advanced Security Features

**Gateway Callback Architecture**:
- Asynchronous decryption requests to Zama Gateway network
- Cryptographic proof verification using `FHE.checkSignatures()`
- Request ID mapping prevents callback mixing between analyses
- State guards prevent double-finalization

**Timeout Protection**:
- Configurable analysis periods (1-90 days)
- Automatic failure detection after 7-day decryption timeout
- Emergency fallback mechanism prevents permanent lockup
- Gas-optimized timeout checks

**Refund Mechanism**:
- Automatic refunds for failed decryption operations
- Double-claim prevention using per-session tracking
- Zero-knowledge refund claims (no manual verification needed)
- Transparent event logging for all refund operations

**Input Validation & Access Control**:
- Strict parameter validation (string length, numeric ranges)
- Role-based access control (owner, analysts, artists)
- Address zero-checks prevent invalid operations
- Overflow protection through Solidity 0.8.24 native checking

### What Information Remains Private

- ✅ Your exact income amounts
- ✅ Number of artworks sold
- ✅ Pricing strategies
- ✅ Revenue breakdown by category
- ✅ Financial performance metrics

### What Information Is Public

- ✅ Your wallet address (pseudonymous)
- ✅ Participation in the platform
- ✅ Contribution to aggregate statistics
- ✅ Transaction timestamps

## 🎨 Use Cases

### Individual Artists

- **Competitive Analysis**: Understand your position in the market without revealing your earnings
- **Income Diversification**: Track performance across multiple revenue streams
- **Financial Planning**: Maintain private records while contributing to industry benchmarks

### Creative Economy Research

- **Market Studies**: Generate reliable data for creative economy research
- **Policy Development**: Inform arts policy with privacy-protected data
- **Grant Allocation**: Better understand artist needs without invasive data collection

### Platforms & Marketplaces

- **Vendor Insights**: Offer value to creators without collecting sensitive data
- **Market Reports**: Publish industry reports based on confidential data
- **Fair Compensation**: Establish fair pricing standards using aggregate data

## 🏗️ Enhanced Architecture

### Gateway Callback Pattern

The platform implements an innovative **asynchronous Gateway callback mechanism** for secure decryption:

1. **Submission Phase**: Artists encrypt and submit income data (stays encrypted on-chain)
2. **Analysis Phase**: Encrypted aggregation using FHE operations (no decryption possible)
3. **Decryption Request**: Analyst requests result decryption from Zama Gateway
4. **Gateway Processing**: Off-chain decryption with cryptographic proof generation
5. **Callback Execution**: Gateway automatically calls `decryptionCallback()` with verified results
6. **Report Finalization**: Aggregate statistics revealed with cryptographic guarantees

**Benefits**:
- ✅ Prevents premature data exposure
- ✅ Enables asynchronous processing
- ✅ Zero-knowledge proof verification
- ✅ Automatic error handling with timeouts

### Security Mechanisms

**Privacy Protection**:
- All individual data remains encrypted throughout analysis
- Only aggregate totals are ever decrypted
- Privacy-preserving hashing for artist identifiers
- Temporal privacy (results hidden until finalization)

**Reliability Features**:
- 7-day timeout protection against Gateway failures
- Automatic refund mechanism for failed operations
- Emergency pause functionality for admin
- Complete event audit trail

**Input Protection**:
- Artist ID length constraints (3-64 characters)
- Analysis duration bounds (1-90 days)
- Decryption timeout window (7 days)
- Maximum artist threshold (10,000 per analysis)

## 🔬 Technical Architecture

### Frontend Implementations

We provide **two production-ready frontend implementations** to demonstrate different modern web development approaches:

#### 1. React + Vite Version (NEW) ⚡

**Location:** `artist-income-react/`

**Live Demo:** [https://private-artist-income-analyze.vercel.app/](https://private-artist-income-analyze.vercel.app/)

**Technology Stack:**
- **React 18** - Modern React with hooks and functional components
- **Vite 5** - Next-generation frontend tooling with lightning-fast HMR
- **TypeScript 5** - Full type safety throughout the application
- **Ethers.js 5.7** - Ethereum wallet and contract interaction
- **fhevmjs 0.5** - Zama's FHE library for client-side encryption

**Architecture:**
- Fully componentized React architecture with 6 specialized components:
  - `ArtistRegistration.tsx` - Privacy-preserving artist registration
  - `IncomeSubmission.tsx` - Encrypted income data submission form
  - `CreativeAnalytics.tsx` - Multi-category analytics tracking
  - `PlatformStats.tsx` - Real-time platform statistics display
  - `AnalysisControls.tsx` - Analysis generation and report finalization
  - `ProfileInfo.tsx` - User profile management
- Modern gradient-based UI with glassmorphism effects
- Responsive design for all device sizes
- Real-time transaction status updates
- Web3 wallet integration (MetaMask)

**Development Experience:**
```bash
cd artist-income-react
npm install
npm run dev        # Start Vite dev server (ultra-fast HMR)
npm run build      # Production build
```

**Key Benefits:**
- ⚡ Ultra-fast development with Vite's instant HMR
- 📦 Smaller bundle size compared to Next.js
- 🎯 Simple deployment (static files)
- 🛠️ Excellent developer experience
- 🚀 Optimized production builds

#### 2. Next.js Version

**Technology Stack:**
- Next.js 14 with App Router
- React 18
- TailwindCSS
- Ethers.js

**Features:**
- Server-side rendering (SSR) support
- API routes for backend logic
- Optimized SEO
- Image optimization

### Smart Contract Layer

- Solidity-based FHE contracts
- Encrypted state variables
- Privacy-preserving computation functions
- Event emission for transparency
- Access control mechanisms

### Encryption Layer

- Zama fhEVM integration
- Client-side encryption
- Homomorphic operations on-chain
- Secure key management
- Decryption prevention

## 📈 How It Works

### For Artists

1. **Connect Wallet**: Connect your Web3 wallet to the platform
2. **Register**: Create an anonymous artist profile with a unique identifier (3-64 characters)
3. **Submit Data**: Enter your income data which is automatically encrypted before transmission
4. **Track Analytics**: Submit detailed breakdowns across creative categories
5. **View Aggregate Reports**: Access market insights generated from collective encrypted data
6. **Claim Refunds**: If decryption fails, automatically claim refund after 7-day timeout

### For Analysts

1. **Monitor Participation**: View total number of contributing artists and statistics
2. **Generate Analysis**: Trigger FHE computation on encrypted dataset with configurable duration (1-90 days)
3. **Request Decryption**: Submit request to Zama Gateway for cryptographic verification
4. **Receive Results**: Automatically receive decrypted aggregates via Gateway callback
5. **Access Insights**: Review market trends and benchmarks with confidence
6. **Handle Failures**: Mark decryption as failed and trigger refund mechanism if needed

### Security Flow

```
Artist Data Submission
  ↓ (Encrypted in browser)
Smart Contract
  ↓ (Stored encrypted)
Analysis Generation
  ↓ (FHE computations)
Decryption Request
  ↓ (To Zama Gateway)
Gateway Processing
  ↓ (Off-chain decryption)
Callback with Proof
  ↓ (Cryptographic verification)
Report Finalization
  ↓ (On-chain storage)
Results Available
```

## 🌟 Benefits

### Privacy-First Design

Traditional income surveys require artists to trust third parties with sensitive data. This platform eliminates that risk through cryptographic guarantees.

### Verifiable Integrity

All operations occur on-chain, providing transparency about the analysis methodology while maintaining data confidentiality.

### Collective Intelligence

By protecting individual privacy, the platform encourages broader participation, resulting in more comprehensive and representative data.

### Economic Empowerment

Artists gain access to market insights that were previously only available to large platforms and corporations.

## 🤝 Contributing

This project demonstrates the potential of FHE for privacy-preserving data analytics in the creative economy. The methodology can be adapted for other industries requiring confidential data aggregation.

## 📜 License

This project is open source and available for research and educational purposes.

## 🔗 Links

- **Live Platform**: [https://fhe-artist-income-analyzer.vercel.app/](https://fhe-artist-income-analyzer.vercel.app/)
- **GitHub**: [https://github.com/NewellLeannon/FHEArtistIncomeAnalyzer](https://github.com/NewellLeannon/FHEArtistIncomeAnalyzer)
- **Contract Address**: `0xee7272C646331Db35A7217ed4c2a3aA8b17854aE`
- **Zama Documentation**: [https://docs.zama.ai](https://docs.zama.ai)
- **fhEVM Documentation**: [https://docs.fhevm.zama.ai](https://docs.fhevm.zama.ai)

## 🎯 Project Structure

```
D:\
├── artist-income-react/          # React + Vite implementation ⭐ NEW
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ArtistRegistration.tsx
│   │   │   ├── IncomeSubmission.tsx
│   │   │   ├── CreativeAnalytics.tsx
│   │   │   ├── PlatformStats.tsx
│   │   │   ├── AnalysisControls.tsx
│   │   │   └── ProfileInfo.tsx
│   │   ├── App.tsx              # Main application
│   │   ├── main.tsx             # Entry point
│   │   └── App.css              # Styles
│   ├── package.json
│   ├── vite.config.ts
│   └── README.md
│
├── fhevm-react-template/        # Complete FHEVM SDK template
│   ├── packages/fhevm-sdk/      # Universal FHEVM SDK
│   ├── examples/                # Multiple example implementations
│   ├── templates/               # Starter templates
│   └── docs/                    # Documentation
│
├── contracts/                   # Smart contracts
├── demo.mp4                     # Platform demonstration
└── README.md                    # This file
```

## 🚀 Quick Start

### Option 1: React + Vite (Recommended for Development)

```bash
cd artist-income-react
npm install
npm run dev
```

Access at: `http://localhost:5173`

### Option 2: FHEVM Template Examples

```bash
cd fhevm-react-template/examples/artist-income-nextjs
npm install
npm run dev
```

## 📊 Implementation Comparison

| Feature | React + Vite | Next.js |
|---------|-------------|---------|
| **Framework** | React 18 | Next.js 14 |
| **Build Tool** | Vite 5 | Next.js |
| **Dev Speed** | ⚡ Ultra Fast | Fast |
| **Bundle Size** | Small | Medium |
| **SSR Support** | ❌ | ✅ |
| **API Routes** | ❌ | ✅ |
| **SEO** | Basic | Advanced |
| **Deployment** | Static Files | Vercel/Node |
| **HMR Speed** | Instant | Fast |
| **Best For** | SPA, Fast Dev | Full-stack Apps |
| **Live Demo** | ✅ | ✅ |

## 📚 Documentation

### For Developers

- **[Architecture Documentation](./docs/ARCHITECTURE.md)** - Technical design, security mechanisms, and privacy guarantees
- **[API Documentation](./docs/API.md)** - Complete smart contract function reference with examples
- **[FHE Concepts](https://docs.zama.ai/fhevm)** - Zama's FHE documentation

### Key Concepts Explained

- **Gateway Callback**: Asynchronous decryption mechanism with cryptographic proofs
- **Timeout Protection**: Prevents permanent lockup with 7-day fallback
- **Refund Mechanism**: Automatic recovery for failed operations
- **Privacy Preservation**: Homomorphic encryption ensures data stays encrypted

## 💡 Future Enhancements

- Multi-chain support for broader adoption
- Advanced analytics with statistical hypothesis testing
- Time-series analysis for trend detection across multiple periods
- Collaborative research tools for academic and institutional use
- REST API access for third-party integrations
- Mobile application for easier data submission
- Vue.js implementation (planned)
- Svelte implementation (planned)
- Threshold decryption for multi-party approval
- Privacy pools for group anonymity

---

## 🏗️ Built With

**Frontend:**
- React 18 / Next.js 14
- Vite 5
- TypeScript 5
- Ethers.js 5.7

**Blockchain:**
- Zama fhEVM
- Solidity
- Sepolia Testnet

**Encryption:**
- fhevmjs 0.5
- Fully Homomorphic Encryption (FHE)

---

**Built with privacy at its core. Powered by Zama FHE technology.**

*Protecting artist privacy while advancing creative economy research.*

---

## 🔒 Security & Audits

### Contract Security Features

- ✅ Gateway callback verification with cryptographic proofs
- ✅ Timeout protection against decryption failures
- ✅ Automatic refund mechanism for reliability
- ✅ Input validation for all parameters
- ✅ Role-based access control (owner, analysts, artists)
- ✅ Solidity 0.8.24 overflow/underflow protection
- ✅ FHE operation proof verification

### Audit Status

- Regular security reviews by FHE specialists
- Comprehensive test coverage (unit, integration, edge cases)
- Fuzzing tests for input validation
- Gas optimization audits

**Recommended**: Third-party security audit before production deployment

---

## 📞 Support & Contact

For questions, issues, or contributions:
- **Documentation**: Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md) and [API.md](./docs/API.md)
- **GitHub Issues**: Report bugs and feature requests
- **Zama Community**: Join [Zama Discord](https://discord.gg/zama) for FHE discussions
- **Technical Support**: Check fhevm-react-template documentation
