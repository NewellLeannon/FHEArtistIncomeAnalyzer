// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, euint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PrivateArtistIncomeAnalyzer is SepoliaConfig {

    address public owner;
    uint256 public totalArtists;
    uint256 public analysisSessionId;

    struct ArtistProfile {
        string artistId; // Anonymous identifier
        euint64 totalIncome;
        euint32 artworksSold;
        euint32 averagePrice;
        euint32 royaltyEarnings;
        euint32 commissionEarnings;
        uint256 profileCreated;
        bool isActive;
    }

    struct IncomeReport {
        euint64 totalPlatformIncome;
        euint32 averageArtistIncome;
        euint32 medianIncome;
        euint32 topPercentileIncome;
        uint256 reportTimestamp;
        uint256 artistCount;
        bool isFinalized;
    }

    struct CreativeAnalytics {
        euint32 digitalArtSales;
        euint32 physicalArtSales;
        euint32 nftSales;
        euint32 licensingRevenue;
        euint32 workshopEarnings;
        euint32 customCommissions;
    }

    mapping(address => ArtistProfile) public artistProfiles;
    mapping(address => CreativeAnalytics) public artistAnalytics;
    mapping(uint256 => IncomeReport) public incomeReports;
    mapping(address => bool) public authorizedAnalysts;

    address[] public registeredArtists;

    event ArtistRegistered(address indexed artist, string artistId);
    event IncomeUpdated(address indexed artist, uint256 timestamp);
    event AnalysisCompleted(uint256 indexed sessionId, uint256 artistCount);
    event ReportGenerated(uint256 indexed sessionId, uint256 timestamp);
    event AnalystAuthorized(address indexed analyst);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || authorizedAnalysts[msg.sender], "Not authorized analyst");
        _;
    }

    modifier onlyRegisteredArtist() {
        require(artistProfiles[msg.sender].isActive, "Not registered artist");
        _;
    }

    constructor() {
        owner = msg.sender;
        analysisSessionId = 1;
        totalArtists = 0;
    }

    // Register as an artist with anonymous identifier
    function registerArtist(string calldata _artistId) external {
        require(!artistProfiles[msg.sender].isActive, "Already registered");
        require(bytes(_artistId).length > 0, "Invalid artist ID");

        artistProfiles[msg.sender] = ArtistProfile({
            artistId: _artistId,
            totalIncome: FHE.asEuint64(0),
            artworksSold: FHE.asEuint32(0),
            averagePrice: FHE.asEuint32(0),
            royaltyEarnings: FHE.asEuint32(0),
            commissionEarnings: FHE.asEuint32(0),
            profileCreated: block.timestamp,
            isActive: true
        });

        artistAnalytics[msg.sender] = CreativeAnalytics({
            digitalArtSales: FHE.asEuint32(0),
            physicalArtSales: FHE.asEuint32(0),
            nftSales: FHE.asEuint32(0),
            licensingRevenue: FHE.asEuint32(0),
            workshopEarnings: FHE.asEuint32(0),
            customCommissions: FHE.asEuint32(0)
        });

        registeredArtists.push(msg.sender);
        totalArtists++;

        emit ArtistRegistered(msg.sender, _artistId);
    }

    // Submit encrypted income data
    function submitIncomeData(
        uint64 _totalIncome,
        uint32 _artworksSold,
        uint32 _averagePrice,
        uint32 _royaltyEarnings,
        uint32 _commissionEarnings
    ) external onlyRegisteredArtist {

        euint64 encryptedTotalIncome = FHE.asEuint64(_totalIncome);
        euint32 encryptedArtworksSold = FHE.asEuint32(_artworksSold);
        euint32 encryptedAveragePrice = FHE.asEuint32(_averagePrice);
        euint32 encryptedRoyalty = FHE.asEuint32(_royaltyEarnings);
        euint32 encryptedCommission = FHE.asEuint32(_commissionEarnings);

        artistProfiles[msg.sender].totalIncome = encryptedTotalIncome;
        artistProfiles[msg.sender].artworksSold = encryptedArtworksSold;
        artistProfiles[msg.sender].averagePrice = encryptedAveragePrice;
        artistProfiles[msg.sender].royaltyEarnings = encryptedRoyalty;
        artistProfiles[msg.sender].commissionEarnings = encryptedCommission;

        // Grant access permissions
        FHE.allowThis(encryptedTotalIncome);
        FHE.allowThis(encryptedArtworksSold);
        FHE.allowThis(encryptedAveragePrice);
        FHE.allowThis(encryptedRoyalty);
        FHE.allowThis(encryptedCommission);

        FHE.allow(encryptedTotalIncome, msg.sender);
        FHE.allow(encryptedArtworksSold, msg.sender);
        FHE.allow(encryptedAveragePrice, msg.sender);
        FHE.allow(encryptedRoyalty, msg.sender);
        FHE.allow(encryptedCommission, msg.sender);

        emit IncomeUpdated(msg.sender, block.timestamp);
    }

    // Submit detailed creative analytics
    function submitCreativeAnalytics(
        uint32 _digitalArt,
        uint32 _physicalArt,
        uint32 _nftSales,
        uint32 _licensing,
        uint32 _workshops,
        uint32 _commissions
    ) external onlyRegisteredArtist {

        euint32 encryptedDigital = FHE.asEuint32(_digitalArt);
        euint32 encryptedPhysical = FHE.asEuint32(_physicalArt);
        euint32 encryptedNFT = FHE.asEuint32(_nftSales);
        euint32 encryptedLicensing = FHE.asEuint32(_licensing);
        euint32 encryptedWorkshops = FHE.asEuint32(_workshops);
        euint32 encryptedCommissions = FHE.asEuint32(_commissions);

        artistAnalytics[msg.sender] = CreativeAnalytics({
            digitalArtSales: encryptedDigital,
            physicalArtSales: encryptedPhysical,
            nftSales: encryptedNFT,
            licensingRevenue: encryptedLicensing,
            workshopEarnings: encryptedWorkshops,
            customCommissions: encryptedCommissions
        });

        // Grant access permissions
        FHE.allowThis(encryptedDigital);
        FHE.allowThis(encryptedPhysical);
        FHE.allowThis(encryptedNFT);
        FHE.allowThis(encryptedLicensing);
        FHE.allowThis(encryptedWorkshops);
        FHE.allowThis(encryptedCommissions);

        FHE.allow(encryptedDigital, msg.sender);
        FHE.allow(encryptedPhysical, msg.sender);
        FHE.allow(encryptedNFT, msg.sender);
        FHE.allow(encryptedLicensing, msg.sender);
        FHE.allow(encryptedWorkshops, msg.sender);
        FHE.allow(encryptedCommissions, msg.sender);
    }

    // Generate aggregated income analysis (only for authorized analysts)
    function generateIncomeAnalysis() external onlyAuthorized {
        require(totalArtists > 0, "No artists registered");

        euint64 totalPlatformIncome = FHE.asEuint64(0);

        // Calculate aggregated statistics using FHE operations
        for (uint i = 0; i < registeredArtists.length; i++) {
            address artist = registeredArtists[i];
            if (artistProfiles[artist].isActive) {
                totalPlatformIncome = FHE.add(totalPlatformIncome, artistProfiles[artist].totalIncome);
            }
        }

        // Create income report
        incomeReports[analysisSessionId] = IncomeReport({
            totalPlatformIncome: totalPlatformIncome,
            averageArtistIncome: FHE.asEuint32(0), // Will be calculated
            medianIncome: FHE.asEuint32(0), // Will be calculated
            topPercentileIncome: FHE.asEuint32(0), // Will be calculated
            reportTimestamp: block.timestamp,
            artistCount: totalArtists,
            isFinalized: false
        });

        // Grant permissions for the report
        FHE.allowThis(totalPlatformIncome);

        emit AnalysisCompleted(analysisSessionId, totalArtists);
    }

    // Finalize report with decrypted aggregate data (async callback)
    function finalizeReport() external onlyAuthorized {
        require(!incomeReports[analysisSessionId].isFinalized, "Report already finalized");

        // Request decryption for aggregate statistics
        bytes32[] memory cts = new bytes32[](1);
        cts[0] = FHE.toBytes32(incomeReports[analysisSessionId].totalPlatformIncome);
        FHE.requestDecryption(cts, this.processReportFinalization.selector);
    }

    // Process decrypted report data
    function processReportFinalization(
        uint256 requestId,
        bytes memory decryptedData,
        bytes memory signatures
    ) external {
        // Verify signatures with 3 parameters
        FHE.checkSignatures(requestId, decryptedData, signatures);

        // Decode the decrypted data to get totalIncome
        uint64 totalIncome = abi.decode(decryptedData, (uint64));

        incomeReports[analysisSessionId].isFinalized = true;

        emit ReportGenerated(analysisSessionId, block.timestamp);

        // Move to next session
        analysisSessionId++;
    }

    // Authorize analyst for data access
    function authorizeAnalyst(address _analyst) external onlyOwner {
        authorizedAnalysts[_analyst] = true;
        emit AnalystAuthorized(_analyst);
    }

    // Revoke analyst authorization
    function revokeAnalyst(address _analyst) external onlyOwner {
        authorizedAnalysts[_analyst] = false;
    }

    // Get artist profile info (encrypted data visible only to artist)
    function getMyProfile() external view onlyRegisteredArtist returns (
        string memory artistId,
        uint256 profileCreated,
        bool isActive
    ) {
        ArtistProfile storage profile = artistProfiles[msg.sender];
        return (
            profile.artistId,
            profile.profileCreated,
            profile.isActive
        );
    }

    // Get platform statistics
    function getPlatformStats() external view returns (
        uint256 totalArtistsCount,
        uint256 currentSessionId,
        uint256 lastReportTimestamp
    ) {
        uint256 lastTimestamp = 0;
        if (analysisSessionId > 1) {
            lastTimestamp = incomeReports[analysisSessionId - 1].reportTimestamp;
        }

        return (
            totalArtists,
            analysisSessionId,
            lastTimestamp
        );
    }

    // Get report info (public aggregate data only)
    function getReportInfo(uint256 _sessionId) external view returns (
        uint256 reportTimestamp,
        uint256 artistCount,
        bool isFinalized
    ) {
        IncomeReport storage report = incomeReports[_sessionId];
        return (
            report.reportTimestamp,
            report.artistCount,
            report.isFinalized
        );
    }

    // Check if address is registered artist
    function isRegisteredArtist(address _artist) external view returns (bool) {
        return artistProfiles[_artist].isActive;
    }

    // Get registered artists count
    function getRegisteredArtistsCount() external view returns (uint256) {
        return registeredArtists.length;
    }

    // Emergency deactivate artist profile
    function deactivateArtist(address _artist) external onlyOwner {
        artistProfiles[_artist].isActive = false;
    }

    // Reactivate artist profile
    function reactivateArtist(address _artist) external onlyOwner {
        require(bytes(artistProfiles[_artist].artistId).length > 0, "Artist never registered");
        artistProfiles[_artist].isActive = true;
    }
}