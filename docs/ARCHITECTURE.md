# FHE Artist Income Analyzer - Technical Architecture

## Overview

The FHE Artist Income Analyzer is a privacy-preserving analytics platform built on Zama's Fully Homomorphic Encryption (FHE) technology. The platform enables artists to submit confidential income data while maintaining complete privacy through encrypted on-chain computation.

## Architectural Components

### 1. Smart Contract Layer

**Contract**: `PrivateArtistIncomeAnalyzer.sol`

The smart contract implements the core business logic using FHE operations from Zama's fhEVM library.

#### Key Components:

- **Artist Registration**: Anonymous profile creation with privacy-preserving identifiers
- **Income Submission**: Encrypted data storage and aggregation
- **Gateway Callback System**: Asynchronous decryption handling
- **Timeout Protection**: Duration constraints and emergency fallbacks
- **Refund Mechanism**: Recovery for failed decryption operations

### 2. Data Structures

#### ArtistProfile
```solidity
struct ArtistProfile {
    string artistId;           // Anonymous identifier (3-64 chars)
    euint64 totalIncome;       // Encrypted total income
    euint32 artworksSold;      // Encrypted artwork count
    euint32 averagePrice;      // Encrypted average price
    euint32 royaltyEarnings;   // Encrypted royalty income
    euint32 commissionEarnings;// Encrypted commission income
    uint256 profileCreated;    // Registration timestamp
    bool isActive;             // Profile status
}
```

#### IncomeReport
```solidity
struct IncomeReport {
    euint64 totalPlatformIncome;      // Encrypted aggregate income
    euint32 averageArtistIncome;      // Encrypted average
    euint32 medianIncome;             // Encrypted median
    euint32 topPercentileIncome;      // Encrypted top percentile
    uint256 reportTimestamp;          // Report creation time
    uint256 artistCount;              // Number of participants
    bool isFinalized;                 // Report completion status
    uint256 decryptionRequestId;      // Gateway request ID
    uint256 decryptionRequestTime;    // Request timestamp
    uint256 expiryTime;               // Analysis period expiry
    bool decryptionFailed;            // Failure flag
    uint64 revealedTotalIncome;       // Decrypted result
}
```

#### CreativeAnalytics
```solidity
struct CreativeAnalytics {
    euint32 digitalArtSales;     // Encrypted digital art revenue
    euint32 physicalArtSales;    // Encrypted physical art revenue
    euint32 nftSales;            // Encrypted NFT sales
    euint32 licensingRevenue;    // Encrypted licensing income
    euint32 workshopEarnings;    // Encrypted workshop income
    euint32 customCommissions;   // Encrypted commission income
}
```

## Gateway Callback Architecture

The platform uses an **asynchronous Gateway callback pattern** for secure decryption of encrypted data.

### Workflow:

```
┌─────────────────┐
│  1. Generate    │
│  Analysis       │
│  (encrypted)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. Request     │
│  Decryption     │
│  (Gateway call) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. Gateway     │
│  Processing     │
│  (off-chain)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. Callback    │
│  Execution      │
│  (on-chain)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. Report      │
│  Finalized      │
│  (revealed)     │
└─────────────────┘
```

### Implementation Details:

**Step 1: Request Decryption**
```solidity
function requestReportDecryption() external onlyAuthorized {
    // Convert encrypted data to bytes32
    bytes32[] memory cts = new bytes32[](1);
    cts[0] = FHE.toBytes32(report.totalPlatformIncome);

    // Request decryption with callback selector
    uint256 requestId = FHE.requestDecryption(
        cts,
        this.decryptionCallback.selector
    );

    // Track request
    report.decryptionRequestId = requestId;
    sessionIdByRequestId[requestId] = analysisSessionId;
}
```

**Step 2: Gateway Callback Handler**
```solidity
function decryptionCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external {
    // Verify cryptographic signatures
    FHE.checkSignatures(requestId, cleartexts, decryptionProof);

    // Decode cleartext result
    uint64 revealedTotalIncome = abi.decode(cleartexts, (uint64));

    // Finalize report
    report.revealedTotalIncome = revealedTotalIncome;
    report.isFinalized = true;
}
```

### Security Features:

1. **Cryptographic Verification**: `FHE.checkSignatures()` validates Gateway authenticity
2. **Request ID Mapping**: Prevents callback mixing between sessions
3. **State Guards**: Prevents double-finalization
4. **Access Control**: Only authorized analysts can trigger decryption

## Timeout Protection

### Duration Constraints:

```solidity
uint256 public constant MIN_ANALYSIS_DURATION = 1 days;
uint256 public constant MAX_ANALYSIS_DURATION = 90 days;
uint256 public constant DECRYPTION_TIMEOUT = 7 days;
```

### Protection Mechanisms:

1. **Analysis Duration Validation**
   - Enforces minimum/maximum analysis periods
   - Prevents premature or indefinite analysis windows

2. **Decryption Request Timing**
   - Only allowed after analysis expiry
   - Prevents manipulation during active submission period

3. **Timeout Fallback**
   - Emergency function to mark decryption as failed
   - Activated after `DECRYPTION_TIMEOUT` period
   - Enables refund mechanism for participants

### Implementation:

```solidity
function markDecryptionFailed() external onlyAuthorized {
    require(
        block.timestamp >= report.decryptionRequestTime + DECRYPTION_TIMEOUT,
        "Timeout period not reached"
    );

    report.decryptionFailed = true;
    report.isFinalized = true;
}
```

## Refund Mechanism

### Failure Scenarios:

1. **Decryption Timeout**: Gateway fails to respond within 7 days
2. **Gateway Unavailability**: Network or service disruption
3. **Invalid Proof**: Cryptographic verification failure

### Refund Process:

```solidity
function claimRefundForFailedDecryption(uint256 sessionId)
    external
    onlyRegisteredArtist
{
    require(report.decryptionFailed, "Decryption did not fail");
    require(!hasClaimedRefund[sessionId][msg.sender], "Already claimed");

    hasClaimedRefund[sessionId][msg.sender] = true;
    emit RefundClaimed(sessionId, msg.sender, "Decryption failed");

    // Gas rebate or analysis credits distribution
}
```

### Protection Against Abuse:

- **Single Claim**: `hasClaimedRefund` mapping prevents double-claiming
- **Artist Verification**: Only registered participants eligible
- **Failure Validation**: Requires `decryptionFailed` flag
- **Timeout Enforcement**: Only after emergency timeout period

## Security Architecture

### Input Validation

**String Length Validation**:
```solidity
function _validateStringLength(
    string calldata str,
    uint256 minLength,
    uint256 maxLength
) internal pure {
    uint256 length = bytes(str).length;
    require(length >= minLength && length <= maxLength, "Invalid string length");
}
```

Applied to:
- Artist ID: 3-64 characters
- Report metadata fields

**Value Range Validation**:
```solidity
function _validateValueRange(
    uint256 value,
    uint256 min,
    uint256 max
) internal pure {
    require(value >= min && value <= max, "Value out of range");
}
```

Applied to:
- Analysis duration: 1-90 days
- Artist count: 0-10,000

### Access Control

**Role-Based Permissions**:

1. **Owner** (`onlyOwner` modifier)
   - Authorize/revoke analysts
   - Transfer ownership
   - Emergency controls

2. **Authorized Analysts** (`onlyAuthorized` modifier)
   - Generate analysis reports
   - Request decryption
   - Mark decryption failures

3. **Registered Artists** (`onlyRegisteredArtist` modifier)
   - Submit income data
   - Submit creative analytics
   - Claim refunds

**Permission Checks**:
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
}

modifier onlyAuthorized() {
    require(
        msg.sender == owner || authorizedAnalysts[msg.sender],
        "Not authorized analyst"
    );
    _;
}

modifier onlyRegisteredArtist() {
    require(artistProfiles[msg.sender].isActive, "Not registered artist");
    _;
}
```

### Overflow Protection

**Solidity 0.8.24 Safeguards**:
- Native checked arithmetic (automatic overflow/underflow detection)
- All mathematical operations revert on overflow

**Additional Validations**:
- Maximum artist count (10,000) prevents unbounded loops
- Array length checks before iteration
- Zero-value checks before division operations

### FHE Operation Security

**Permission Management**:
```solidity
// Grant contract access
FHE.allowThis(encryptedValue);

// Grant user access
FHE.allow(encryptedValue, msg.sender);
```

**Proof Verification**:
```solidity
euint64 weight = FHE.fromExternal(encryptedWeight, inputProof);
// Invalid proofs automatically revert
```

## Gas Optimization

### HCU (Homomorphic Computation Units)

FHE operations consume HCU based on operation complexity:

| Operation | Approximate HCU Cost | Usage |
|-----------|---------------------|-------|
| `FHE.asEuint64()` | Low | Initialization |
| `FHE.add()` | Medium | Aggregation |
| `FHE.eq()` | Medium | Comparison |
| `FHE.select()` | Medium | Conditional logic |
| `FHE.allowThis()` | Low | Permissions |
| `FHE.toBytes32()` | Low | Conversion |
| `FHE.requestDecryption()` | High | Gateway call |

### Optimization Strategies:

1. **Batch Operations**: Aggregate multiple values before FHE operations
2. **Lazy Evaluation**: Defer expensive computations until necessary
3. **State Caching**: Store intermediate results to avoid recomputation
4. **Minimal Decryption**: Only decrypt aggregate statistics, never individual data

## Privacy Guarantees

### What Remains Private:

✅ Individual artist income amounts
✅ Number of artworks sold per artist
✅ Pricing strategies
✅ Revenue breakdown by category
✅ Financial performance metrics

### What Is Revealed:

✅ Aggregate platform statistics (after decryption)
✅ Total artist count
✅ Analysis session IDs
✅ Report timestamps

### Privacy Techniques:

1. **End-to-End Encryption**: Data encrypted before blockchain submission
2. **Homomorphic Computation**: Statistics computed on encrypted data
3. **Aggregate-Only Decryption**: Only totals revealed, never individual values
4. **Temporal Privacy**: Results hidden until official resolution

## Edge Case Handling

### Division by Zero Protection

**Problem**: FHE division operations can leak information about divisors

**Solution**: Use multiplication-based obfuscation
```solidity
// Instead of: result = encryptedValue / encryptedDivisor
// Use randomized multiplier approach:
euint64 randomMultiplier = FHE.asEuint64(getRandom());
euint64 obfuscated = FHE.mul(encryptedValue, randomMultiplier);
```

### Price Leakage Prevention

**Problem**: Repeated queries can reveal price patterns

**Solution**: Fuzzing and batching
- Add random noise to encrypted values
- Batch multiple submissions before aggregation
- Enforce minimum participant thresholds

### Asynchronous Handling

**Problem**: Gateway callback may never execute

**Solution**: Timeout mechanism
- 7-day timeout period
- Emergency failure marking
- Refund mechanism for participants

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                      │
│  (React/Vite - User Interface)                  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              Web3 Provider                      │
│  (MetaMask, WalletConnect)                      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│          Ethereum Network (Sepolia)             │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  PrivateArtistIncomeAnalyzer Contract     │ │
│  │  (FHE-enabled smart contract)             │ │
│  └───────────────┬───────────────────────────┘ │
│                  │                             │
└──────────────────┼─────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│            Zama Gateway Network                 │
│  (Decryption Oracle Service)                    │
└─────────────────────────────────────────────────┘
```

## API Reference

See [API.md](./API.md) for complete function documentation.

## Security Audit Recommendations

### Critical Areas:

1. **Gateway Callback Verification**
   - Verify `FHE.checkSignatures()` implementation
   - Test with invalid proofs and malformed data

2. **Timeout Mechanism**
   - Ensure timeout cannot be bypassed
   - Test emergency failure marking

3. **Refund Logic**
   - Verify double-claim prevention
   - Test all failure scenarios

4. **Access Control**
   - Audit all modifier implementations
   - Test unauthorized access attempts

5. **FHE Operations**
   - Verify correct FHE operation usage
   - Test with extreme values (zero, max uint)

### Testing Recommendations:

- Comprehensive unit tests for all functions
- Integration tests for Gateway callback flow
- Fuzzing tests for input validation
- Gas optimization profiling
- Security audit by FHE experts

## Future Enhancements

1. **Multi-Chain Support**: Deploy on multiple FHE-enabled networks
2. **Advanced Analytics**: Statistical functions beyond aggregation
3. **Time-Series Analysis**: Trend detection over multiple periods
4. **Privacy Pools**: Group anonymity for small cohorts
5. **Threshold Decryption**: Multi-party approval for sensitive revelations
6. **ZK-SNARK Integration**: Additional privacy layer for metadata

## References

- [Zama fhEVM Documentation](https://docs.zama.ai/fhevm)
- [FHE Whitepaper](https://whitepaper.zama.ai/)
- [Solidity Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Gateway Callback Specification](https://docs.zama.ai/fhevm/fundamentals/decryption)

---

**Last Updated**: 2024-01-20
**Version**: 2.0
**License**: MIT
