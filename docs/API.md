# FHE Artist Income Analyzer - API Documentation

## Smart Contract API Reference

**Contract Address**: `0xee7272C646331Db35A7217ed4c2a3aA8b17854aE` (Sepolia Testnet)

**Solidity Version**: ^0.8.24

**License**: MIT

---

## Table of Contents

1. [Constants](#constants)
2. [Data Structures](#data-structures)
3. [Public Functions](#public-functions)
   - [Artist Functions](#artist-functions)
   - [Analysis Functions](#analysis-functions)
   - [Administrative Functions](#administrative-functions)
   - [View Functions](#view-functions)
4. [Events](#events)
5. [Modifiers](#modifiers)
6. [Error Codes](#error-codes)

---

## Constants

### Timeout Protection

```solidity
uint256 public constant MIN_ANALYSIS_DURATION = 1 days;
uint256 public constant MAX_ANALYSIS_DURATION = 90 days;
uint256 public constant DECRYPTION_TIMEOUT = 7 days;
```

**Purpose**: Define boundaries for analysis periods and decryption timeouts

- `MIN_ANALYSIS_DURATION`: Minimum time for data collection (1 day)
- `MAX_ANALYSIS_DURATION`: Maximum analysis window (90 days)
- `DECRYPTION_TIMEOUT`: Maximum wait time for Gateway callback (7 days)

---

## Data Structures

### ArtistProfile

```solidity
struct ArtistProfile {
    string artistId;           // Anonymous identifier
    euint64 totalIncome;       // Encrypted total income
    euint32 artworksSold;      // Encrypted artwork count
    euint32 averagePrice;      // Encrypted average price
    euint32 royaltyEarnings;   // Encrypted royalty income
    euint32 commissionEarnings;// Encrypted commission income
    uint256 profileCreated;    // Registration timestamp
    bool isActive;             // Profile status
}
```

### IncomeReport

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

### CreativeAnalytics

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

---

## Public Functions

### Artist Functions

#### registerArtist

```solidity
function registerArtist(string calldata _artistId) external
```

**Description**: Register as an artist with an anonymous identifier

**Parameters**:
- `_artistId` (string): Anonymous artist identifier (3-64 characters)

**Requirements**:
- Caller must not be already registered
- Artist ID must be 3-64 characters long

**Emits**: `ArtistRegistered(address indexed artist, string artistId)`

**Example**:
```javascript
await contract.registerArtist("artist_crypto_123");
```

---

#### submitIncomeData

```solidity
function submitIncomeData(
    uint64 _totalIncome,
    uint32 _artworksSold,
    uint32 _averagePrice,
    uint32 _royaltyEarnings,
    uint32 _commissionEarnings
) external
```

**Description**: Submit encrypted income data to the platform

**Parameters**:
- `_totalIncome` (uint64): Total creative income (encrypted)
- `_artworksSold` (uint32): Number of artworks sold (encrypted)
- `_averagePrice` (uint32): Average artwork price (encrypted)
- `_royaltyEarnings` (uint32): Royalty income (encrypted)
- `_commissionEarnings` (uint32): Commission income (encrypted)

**Requirements**:
- Caller must be a registered artist

**Emits**: `IncomeUpdated(address indexed artist, uint256 timestamp)`

**Example**:
```javascript
// Client-side encryption using fhevmjs
const instance = await createFhevmInstance();
const encryptedIncome = instance.encrypt64(50000);
const encryptedArtworks = instance.encrypt32(25);

await contract.submitIncomeData(
    encryptedIncome,
    encryptedArtworks,
    encryptedAveragePrice,
    encryptedRoyalty,
    encryptedCommission
);
```

---

#### submitCreativeAnalytics

```solidity
function submitCreativeAnalytics(
    uint32 _digitalArt,
    uint32 _physicalArt,
    uint32 _nftSales,
    uint32 _licensing,
    uint32 _workshops,
    uint32 _commissions
) external
```

**Description**: Submit detailed creative analytics across multiple categories

**Parameters**:
- `_digitalArt` (uint32): Digital art sales (encrypted)
- `_physicalArt` (uint32): Physical art sales (encrypted)
- `_nftSales` (uint32): NFT sales revenue (encrypted)
- `_licensing` (uint32): Licensing revenue (encrypted)
- `_workshops` (uint32): Workshop earnings (encrypted)
- `_commissions` (uint32): Custom commission income (encrypted)

**Requirements**:
- Caller must be a registered artist

**Example**:
```javascript
await contract.submitCreativeAnalytics(
    encryptedDigital,
    encryptedPhysical,
    encryptedNFT,
    encryptedLicensing,
    encryptedWorkshops,
    encryptedCommissions
);
```

---

#### claimRefundForFailedDecryption

```solidity
function claimRefundForFailedDecryption(uint256 sessionId) external
```

**Description**: Claim refund if decryption failed for a session

**Parameters**:
- `sessionId` (uint256): Analysis session ID

**Requirements**:
- Caller must be a registered artist
- Decryption must have failed for the session
- Caller must not have already claimed refund

**Emits**: `RefundClaimed(uint256 indexed sessionId, address indexed artist, string reason)`

**Example**:
```javascript
await contract.claimRefundForFailedDecryption(5);
```

---

### Analysis Functions

#### generateIncomeAnalysis

```solidity
function generateIncomeAnalysis(uint256 duration) external
```

**Description**: Generate aggregated income analysis (authorized analysts only)

**Parameters**:
- `duration` (uint256): Analysis window duration in seconds (1-90 days)

**Requirements**:
- Caller must be owner or authorized analyst
- Total artists must be > 0 and ≤ 10,000
- Duration must be within valid range

**Emits**: `AnalysisCompleted(uint256 indexed sessionId, uint256 artistCount)`

**Gas Cost**: High (HCU-intensive due to FHE aggregation)

**Example**:
```javascript
const sevenDays = 7 * 24 * 60 * 60; // 7 days in seconds
await contract.generateIncomeAnalysis(sevenDays);
```

---

#### requestReportDecryption

```solidity
function requestReportDecryption() external
```

**Description**: Request decryption of current session report via Gateway callback

**Requirements**:
- Caller must be owner or authorized analyst
- Report must not be already finalized
- Decryption must not have been already requested
- Analysis period must have expired

**Emits**: `DecryptionRequested(uint256 indexed sessionId, uint256 requestId, uint256 timestamp)`

**Gateway Interaction**: Triggers asynchronous callback to `decryptionCallback()`

**Example**:
```javascript
await contract.requestReportDecryption();
```

---

#### decryptionCallback

```solidity
function decryptionCallback(
    uint256 requestId,
    bytes memory cleartexts,
    bytes memory decryptionProof
) external
```

**Description**: Gateway callback handler for decryption results

**Parameters**:
- `requestId` (uint256): Unique decryption request identifier
- `cleartexts` (bytes): ABI-encoded decrypted values
- `decryptionProof` (bytes): Cryptographic proof from Gateway

**Security**:
- Verifies signatures using `FHE.checkSignatures()`
- Validates request ID mapping
- Prevents double-finalization

**Emits**:
- `DecryptionCompleted(uint256 indexed sessionId, uint256 requestId, uint64 totalIncome)`
- `ReportGenerated(uint256 indexed sessionId, uint256 timestamp)`

**Note**: This function is called by Zama Gateway, not directly by users

---

#### markDecryptionFailed

```solidity
function markDecryptionFailed() external
```

**Description**: Emergency function to mark decryption as failed after timeout

**Requirements**:
- Caller must be owner or authorized analyst
- Decryption must have been requested
- Report must not be finalized
- Timeout period (7 days) must have elapsed

**Emits**: `DecryptionFailed(uint256 indexed sessionId, uint256 requestId, string reason)`

**Example**:
```javascript
// After 7+ days of no callback
await contract.markDecryptionFailed();
```

---

### Administrative Functions

#### authorizeAnalyst

```solidity
function authorizeAnalyst(address _analyst) external
```

**Description**: Grant analyst privileges to an address

**Parameters**:
- `_analyst` (address): Address to authorize

**Requirements**:
- Caller must be owner
- Analyst address must not be zero
- Analyst must not already be authorized

**Emits**: `AnalystAuthorized(address indexed analyst)`

**Example**:
```javascript
await contract.authorizeAnalyst("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
```

---

#### revokeAnalyst

```solidity
function revokeAnalyst(address _analyst) external
```

**Description**: Revoke analyst privileges from an address

**Parameters**:
- `_analyst` (address): Address to revoke

**Requirements**:
- Caller must be owner
- Analyst must be currently authorized

**Example**:
```javascript
await contract.revokeAnalyst("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
```

---

#### transferOwnership

```solidity
function transferOwnership(address newOwner) external
```

**Description**: Transfer contract ownership to a new address

**Parameters**:
- `newOwner` (address): New owner address

**Requirements**:
- Caller must be current owner
- New owner address must not be zero
- New owner must not be current owner

**Security**: No timelock or multi-sig (implement externally if needed)

**Example**:
```javascript
await contract.transferOwnership("0xNewOwnerAddress");
```

---

#### deactivateArtist

```solidity
function deactivateArtist(address _artist) external
```

**Description**: Emergency deactivation of artist profile

**Parameters**:
- `_artist` (address): Artist address to deactivate

**Requirements**:
- Caller must be owner

**Example**:
```javascript
await contract.deactivateArtist("0xArtistAddress");
```

---

#### reactivateArtist

```solidity
function reactivateArtist(address _artist) external
```

**Description**: Reactivate a previously registered artist profile

**Parameters**:
- `_artist` (address): Artist address to reactivate

**Requirements**:
- Caller must be owner
- Artist must have been previously registered

**Example**:
```javascript
await contract.reactivateArtist("0xArtistAddress");
```

---

### View Functions

#### getMyProfile

```solidity
function getMyProfile() external view returns (
    string memory artistId,
    uint256 profileCreated,
    bool isActive
)
```

**Description**: Get caller's artist profile information

**Returns**:
- `artistId` (string): Anonymous artist identifier
- `profileCreated` (uint256): Registration timestamp
- `isActive` (bool): Profile activation status

**Requirements**:
- Caller must be a registered artist

**Example**:
```javascript
const [artistId, created, active] = await contract.getMyProfile();
```

---

#### getPlatformStats

```solidity
function getPlatformStats() external view returns (
    uint256 totalArtistsCount,
    uint256 currentSessionId,
    uint256 lastReportTimestamp
)
```

**Description**: Get platform-wide statistics

**Returns**:
- `totalArtistsCount` (uint256): Total registered artists
- `currentSessionId` (uint256): Current analysis session ID
- `lastReportTimestamp` (uint256): Last report generation time

**Example**:
```javascript
const [total, sessionId, lastReport] = await contract.getPlatformStats();
```

---

#### getReportInfo

```solidity
function getReportInfo(uint256 _sessionId) external view returns (
    uint256 reportTimestamp,
    uint256 artistCount,
    bool isFinalized,
    bool decryptionFailed,
    uint64 revealedTotalIncome,
    uint256 expiryTime
)
```

**Description**: Get detailed report information for a session

**Parameters**:
- `_sessionId` (uint256): Analysis session ID

**Returns**:
- `reportTimestamp` (uint256): Report creation time
- `artistCount` (uint256): Number of participating artists
- `isFinalized` (bool): Whether report is finalized
- `decryptionFailed` (bool): Whether decryption failed
- `revealedTotalIncome` (uint64): Decrypted total income (if finalized)
- `expiryTime` (uint256): Analysis period expiry time

**Example**:
```javascript
const info = await contract.getReportInfo(5);
console.log(`Total Income: ${info.revealedTotalIncome}`);
```

---

#### getDecryptionStatus

```solidity
function getDecryptionStatus(uint256 _sessionId) external view returns (
    uint256 decryptionRequestId,
    uint256 decryptionRequestTime,
    bool callbackExecuted,
    bool decryptionFailed
)
```

**Description**: Get decryption status for a specific session

**Parameters**:
- `_sessionId` (uint256): Analysis session ID

**Returns**:
- `decryptionRequestId` (uint256): Gateway request ID
- `decryptionRequestTime` (uint256): Request timestamp
- `callbackExecuted` (bool): Whether callback was executed
- `decryptionFailed` (bool): Whether decryption failed

**Example**:
```javascript
const status = await contract.getDecryptionStatus(5);
if (status.callbackExecuted) {
    console.log("Decryption completed successfully");
}
```

---

#### isRegisteredArtist

```solidity
function isRegisteredArtist(address _artist) external view returns (bool)
```

**Description**: Check if an address is a registered artist

**Parameters**:
- `_artist` (address): Address to check

**Returns**:
- `bool`: True if registered and active

**Example**:
```javascript
const isRegistered = await contract.isRegisteredArtist("0xArtistAddress");
```

---

#### getRegisteredArtistsCount

```solidity
function getRegisteredArtistsCount() external view returns (uint256)
```

**Description**: Get total number of registered artists

**Returns**:
- `uint256`: Total artist count

**Example**:
```javascript
const count = await contract.getRegisteredArtistsCount();
```

---

## Events

### ArtistRegistered

```solidity
event ArtistRegistered(address indexed artist, string artistId);
```

**Emitted When**: Artist successfully registers

**Parameters**:
- `artist` (address, indexed): Artist wallet address
- `artistId` (string): Anonymous identifier

---

### IncomeUpdated

```solidity
event IncomeUpdated(address indexed artist, uint256 timestamp);
```

**Emitted When**: Artist submits income data

**Parameters**:
- `artist` (address, indexed): Artist wallet address
- `timestamp` (uint256): Submission timestamp

---

### AnalysisCompleted

```solidity
event AnalysisCompleted(uint256 indexed sessionId, uint256 artistCount);
```

**Emitted When**: Income analysis generation completes

**Parameters**:
- `sessionId` (uint256, indexed): Analysis session ID
- `artistCount` (uint256): Number of participating artists

---

### ReportGenerated

```solidity
event ReportGenerated(uint256 indexed sessionId, uint256 timestamp);
```

**Emitted When**: Report is finalized with decrypted data

**Parameters**:
- `sessionId` (uint256, indexed): Analysis session ID
- `timestamp` (uint256): Generation timestamp

---

### AnalystAuthorized

```solidity
event AnalystAuthorized(address indexed analyst);
```

**Emitted When**: New analyst is authorized

**Parameters**:
- `analyst` (address, indexed): Authorized analyst address

---

### DecryptionRequested

```solidity
event DecryptionRequested(
    uint256 indexed sessionId,
    uint256 requestId,
    uint256 timestamp
);
```

**Emitted When**: Decryption is requested from Gateway

**Parameters**:
- `sessionId` (uint256, indexed): Analysis session ID
- `requestId` (uint256): Gateway request ID
- `timestamp` (uint256): Request timestamp

---

### DecryptionCompleted

```solidity
event DecryptionCompleted(
    uint256 indexed sessionId,
    uint256 requestId,
    uint64 totalIncome
);
```

**Emitted When**: Gateway callback successfully completes

**Parameters**:
- `sessionId` (uint256, indexed): Analysis session ID
- `requestId` (uint256): Gateway request ID
- `totalIncome` (uint64): Decrypted total income

---

### DecryptionFailed

```solidity
event DecryptionFailed(
    uint256 indexed sessionId,
    uint256 requestId,
    string reason
);
```

**Emitted When**: Decryption is marked as failed

**Parameters**:
- `sessionId` (uint256, indexed): Analysis session ID
- `requestId` (uint256): Gateway request ID
- `reason` (string): Failure reason

---

### RefundClaimed

```solidity
event RefundClaimed(
    uint256 indexed sessionId,
    address indexed artist,
    string reason
);
```

**Emitted When**: Artist claims refund for failed decryption

**Parameters**:
- `sessionId` (uint256, indexed): Analysis session ID
- `artist` (address, indexed): Artist claiming refund
- `reason` (string): Refund reason

---

## Modifiers

### onlyOwner

```solidity
modifier onlyOwner()
```

**Description**: Restricts access to contract owner

**Usage**: Administrative functions

---

### onlyAuthorized

```solidity
modifier onlyAuthorized()
```

**Description**: Restricts access to owner or authorized analysts

**Usage**: Analysis and decryption functions

---

### onlyRegisteredArtist

```solidity
modifier onlyRegisteredArtist()
```

**Description**: Restricts access to registered and active artists

**Usage**: Income submission and refund claiming

---

## Error Codes

| Error Message | Cause | Solution |
|--------------|-------|----------|
| `"Not authorized"` | Caller is not owner | Use owner account |
| `"Not authorized analyst"` | Caller is not analyst | Get authorized by owner |
| `"Not registered artist"` | Artist not registered | Call `registerArtist()` |
| `"Already registered"` | Artist already has profile | Use existing profile |
| `"Invalid string length"` | String out of bounds | Check length constraints |
| `"Value out of range"` | Numeric value invalid | Check constant bounds |
| `"No artists registered"` | Zero participants | Wait for registrations |
| `"Too many artists for single analysis"` | > 10,000 artists | Split into batches |
| `"Report already finalized"` | Report already complete | Use next session |
| `"Decryption already requested"` | Request in progress | Wait for callback |
| `"Analysis period not expired"` | Premature request | Wait until expiry |
| `"Invalid request ID"` | Unknown request | Check sessionIdByRequestId |
| `"Timeout period not reached"` | Too early | Wait 7 days |
| `"Decryption did not fail"` | Report succeeded | No refund needed |
| `"Refund already claimed"` | Double-claim attempt | Already processed |

---

## Usage Examples

### Complete Artist Registration Flow

```javascript
// 1. Connect wallet
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(ADDRESS, ABI, signer);

// 2. Register as artist
await contract.registerArtist("artist_anonymous_001");

// 3. Encrypt income data using fhevmjs
const instance = await createFhevmInstance();
const encryptedIncome = instance.encrypt64(75000);
const encryptedArtworks = instance.encrypt32(30);
const encryptedPrice = instance.encrypt32(2500);
const encryptedRoyalty = instance.encrypt32(15000);
const encryptedCommission = instance.encrypt32(20000);

// 4. Submit encrypted income
await contract.submitIncomeData(
    encryptedIncome,
    encryptedArtworks,
    encryptedPrice,
    encryptedRoyalty,
    encryptedCommission
);

// 5. Submit creative analytics
await contract.submitCreativeAnalytics(
    encryptedDigital,
    encryptedPhysical,
    encryptedNFT,
    encryptedLicensing,
    encryptedWorkshops,
    encryptedCommissions
);
```

### Complete Analysis Flow

```javascript
// 1. Generate analysis (analyst only)
const thirtyDays = 30 * 24 * 60 * 60;
await contract.generateIncomeAnalysis(thirtyDays);

// 2. Wait for analysis period to expire
// (30 days later)

// 3. Request decryption
await contract.requestReportDecryption();

// 4. Wait for Gateway callback
// (automatic, 1-10 minutes typically)

// 5. Check results
const sessionId = await contract.analysisSessionId();
const info = await contract.getReportInfo(sessionId - 1);
console.log(`Total Platform Income: ${info.revealedTotalIncome}`);
```

---

## Gas Costs (Estimates)

| Function | Approximate Gas | Notes |
|----------|----------------|-------|
| `registerArtist()` | 150,000 | FHE initialization |
| `submitIncomeData()` | 250,000 | Multiple FHE operations |
| `submitCreativeAnalytics()` | 200,000 | FHE permissions |
| `generateIncomeAnalysis()` | 50,000 + (2,000 × artists) | Loop-dependent |
| `requestReportDecryption()` | 180,000 | Gateway call |
| `decryptionCallback()` | 120,000 | Callback processing |
| `claimRefundForFailedDecryption()` | 50,000 | Simple state update |

**Note**: Actual costs vary based on network congestion and FHE computation complexity

---

## Security Considerations

1. **Never decrypt individual data**: Only aggregate statistics should be decrypted
2. **Validate all inputs**: Use provided validation functions
3. **Monitor callback execution**: Set up alerts for timeout scenarios
4. **Test with small datasets**: Verify FHE operations before production
5. **Audit permissions**: Regularly review authorized analysts

---

## Support

For technical support or bug reports:
- GitHub Issues: [Repository Issues](https://github.com/your-repo/issues)
- Documentation: [Technical Architecture](./ARCHITECTURE.md)
- Zama Support: [Zama Discord](https://discord.gg/zama)

---

**Last Updated**: 2024-01-20
**API Version**: 2.0
**Contract Version**: 2.0.0
