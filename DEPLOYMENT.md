# Deployment Information

## Contract Details

### Privacy Artist Income Analyzer

**Contract Name:** PrivateArtistIncomeAnalyzer

**Network:** Sepolia Testnet

**Contract Address:** `0xee7272C646331Db35A7217ed4c2a3aA8b17854aE`

**Deployment Date:** 2024

**Deployer Address:** (To be updated upon deployment)

**Transaction Hash:** (To be updated upon deployment)

---

## Network Information

### Sepolia Testnet

- **Chain ID:** 11155111
- **RPC URL:** https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- **Block Explorer:** https://sepolia.etherscan.io/
- **Faucets:** 
  - https://sepoliafaucet.com/
  - https://www.alchemy.com/faucets/ethereum-sepolia

### Contract on Etherscan

**Verified Contract:**
https://sepolia.etherscan.io/address/0xee7272C646331Db35A7217ed4c2a3aA8b17854aE

---

## Deployment Guide

### Prerequisites

1. Node.js v18.x or v20.x
2. npm or yarn package manager
3. Sepolia testnet ETH for deployment
4. Infura or Alchemy API key
5. Etherscan API key (for verification)

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd privacy-artist-income-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Deployment Steps

#### 1. Compile Contracts

```bash
npm run compile
```

This will compile all Solidity contracts and generate artifacts.

#### 2. Run Tests (Optional but Recommended)

```bash
npm test
```

Run simulation locally:
```bash
npm run simulate
```

#### 3. Deploy to Sepolia

```bash
npm run deploy
```

The deployment script will:
- Deploy the PrivateArtistIncomeAnalyzer contract
- Wait for confirmations
- Display contract address and transaction hash
- Save deployment information to `deployments/` directory

#### 4. Verify on Etherscan

```bash
npm run verify
```

This will verify the contract source code on Etherscan.

#### 5. Interact with Contract

```bash
npm run interact
```

This script allows you to:
- Read contract state
- Check platform statistics
- Perform test interactions

---

## Contract Functions

### Public Functions

#### For Artists

- `registerArtist(string artistId)` - Register as an artist
- `submitIncomeData(...)` - Submit encrypted income data
- `submitCreativeAnalytics(...)` - Submit analytics breakdown
- `getMyProfile()` - Get your artist profile

#### For Everyone

- `getPlatformStats()` - Get platform statistics
- `isRegisteredArtist(address)` - Check if address is registered
- `getReportInfo(uint256)` - Get report information

#### For Owner/Analysts

- `authorizeAnalyst(address)` - Authorize an analyst (owner only)
- `generateIncomeAnalysis()` - Generate income analysis
- `finalizeReport()` - Finalize analysis report

---

## Testing

### Local Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run coverage

# Run simulation
npm run simulate
```

### Testnet Testing

1. Get Sepolia ETH from faucet
2. Deploy contract: `npm run deploy`
3. Interact: `npm run interact`

---

## CI/CD Pipeline

### GitHub Actions

The project includes automated CI/CD workflows:

**Workflow:** `.github/workflows/test.yml`

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**
1. **Test on Node.js 18.x**
   - Install dependencies
   - Run Solhint linter
   - Compile contracts
   - Run tests
   - Generate coverage
   - Upload to Codecov

2. **Test on Node.js 20.x**
   - Same as above for Node 20.x

3. **Code Quality Checks**
   - Solidity linting
   - Contract size checks

4. **Security Audit**
   - npm audit for dependencies

### Code Coverage

Coverage reports are automatically uploaded to Codecov on every CI run.

**Codecov Configuration:** `codecov.yml`

---

## Verification

### Manual Verification

If automatic verification fails, verify manually on Etherscan:

1. Go to https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
2. Click "Contract" tab
3. Click "Verify and Publish"
4. Select:
   - Compiler Type: Solidity (Single file)
   - Compiler Version: v0.8.24
   - License: BSD-3-Clause-Clear
5. Paste contract code
6. Verify

---

## Deployment Checklist

- [ ] Install all dependencies (`npm install`)
- [ ] Configure `.env` file with API keys
- [ ] Get Sepolia testnet ETH
- [ ] Compile contracts (`npm run compile`)
- [ ] Run tests locally (`npm test`)
- [ ] Deploy to Sepolia (`npm run deploy`)
- [ ] Save contract address
- [ ] Verify on Etherscan (`npm run verify`)
- [ ] Test contract interaction (`npm run interact`)
- [ ] Update frontend with contract address
- [ ] Push to GitHub for CI/CD
- [ ] Monitor GitHub Actions workflow
- [ ] Check Codecov for coverage reports

---

## Troubleshooting

### Common Issues

**Issue:** Deployment fails with "insufficient funds"
- **Solution:** Get more Sepolia ETH from faucet

**Issue:** Verification fails
- **Solution:** Check Etherscan API key, try manual verification

**Issue:** Tests fail locally
- **Solution:** Check Node.js version (18.x or 20.x required)

**Issue:** GitHub Actions failing
- **Solution:** Check workflow logs, ensure all dependencies are in `package.json`

---

## Support & Resources

- **Zama FHE Documentation:** https://docs.zama.ai
- **fhEVM Documentation:** https://docs.fhevm.zama.ai
- **Hardhat Documentation:** https://hardhat.org/docs
- **Etherscan API:** https://docs.etherscan.io/

---

## Security Considerations

1. **Never commit `.env` file** - Contains private keys
2. **Use testnet first** - Test thoroughly before mainnet
3. **Audit contract** - Consider professional audit for production
4. **Monitor contract** - Set up monitoring for suspicious activity
5. **Limit permissions** - Only authorize trusted analysts

---

## License

BSD 3-Clause Clear License - See LICENSE file for details

---

## Updates Log

| Date | Version | Changes |
|------|---------|---------|
| 2024 | 1.0.0 | Initial deployment to Sepolia |

---

**Last Updated:** 2024

**Maintainer:** Privacy Artist Analytics Team
