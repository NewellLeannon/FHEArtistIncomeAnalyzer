const { ethers } = require("hardhat");

async function main() {
  console.log("=====================================");
  console.log("Privacy Artist Income Analyzer");
  console.log("Simulation Script");
  console.log("=====================================\n");

  console.log("Deploying contract to local network...\n");

  const PrivateArtistIncomeAnalyzer = await ethers.getContractFactory("PrivateArtistIncomeAnalyzer");
  const contract = await PrivateArtistIncomeAnalyzer.deploy();
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
  console.log("\n=====================================");
  console.log("Running Simulation");
  console.log("=====================================\n");

  const [owner, artist1, artist2, artist3, analyst] = await ethers.getSigners();

  console.log("Test Accounts:");
  console.log("--------------");
  console.log("Owner:", owner.address);
  console.log("Artist 1:", artist1.address);
  console.log("Artist 2:", artist2.address);
  console.log("Artist 3:", artist3.address);
  console.log("Analyst:", analyst.address, "\n");

  // Step 1: Authorize analyst
  console.log("Step 1: Authorizing analyst...");
  const authTx = await contract.connect(owner).authorizeAnalyst(analyst.address);
  await authTx.wait();
  console.log("Analyst authorized\n");

  // Step 2: Register artists
  console.log("Step 2: Registering artists...");
  
  const reg1 = await contract.connect(artist1).registerArtist("digital_artist_001");
  await reg1.wait();
  console.log("Artist 1 registered");

  const reg2 = await contract.connect(artist2).registerArtist("traditional_painter_002");
  await reg2.wait();
  console.log("Artist 2 registered");

  const reg3 = await contract.connect(artist3).registerArtist("nft_creator_003");
  await reg3.wait();
  console.log("Artist 3 registered\n");

  // Step 3: Submit income data
  console.log("Step 3: Submitting income data...");
  
  const income1 = await contract.connect(artist1).submitIncomeData(
    75000,  // totalIncome
    15,     // artworksSold
    5000,   // averagePrice
    10000,  // royaltyEarnings
    15000   // commissionEarnings
  );
  await income1.wait();
  console.log("Artist 1 income submitted");

  const income2 = await contract.connect(artist2).submitIncomeData(
    60000,
    12,
    5000,
    8000,
    12000
  );
  await income2.wait();
  console.log("Artist 2 income submitted");

  const income3 = await contract.connect(artist3).submitIncomeData(
    90000,
    20,
    4500,
    15000,
    20000
  );
  await income3.wait();
  console.log("Artist 3 income submitted\n");

  // Step 4: Submit creative analytics
  console.log("Step 4: Submitting creative analytics...");
  
  const analytics1 = await contract.connect(artist1).submitCreativeAnalytics(
    30000,  // digitalArtSales
    10000,  // physicalArtSales
    20000,  // nftSales
    5000,   // licensingRevenue
    8000,   // workshopEarnings
    2000    // customCommissions
  );
  await analytics1.wait();
  console.log("Artist 1 analytics submitted");

  const analytics2 = await contract.connect(artist2).submitCreativeAnalytics(
    5000,
    40000,
    0,
    10000,
    5000,
    0
  );
  await analytics2.wait();
  console.log("Artist 2 analytics submitted");

  const analytics3 = await contract.connect(artist3).submitCreativeAnalytics(
    25000,
    5000,
    50000,
    8000,
    2000,
    0
  );
  await analytics3.wait();
  console.log("Artist 3 analytics submitted\n");

  // Step 5: Get platform statistics
  console.log("Step 5: Checking platform statistics...");
  const stats = await contract.getPlatformStats();
  console.log("Total Artists:", stats.totalArtistsCount.toString());
  console.log("Current Session ID:", stats.currentSessionId.toString());
  console.log("Last Report Timestamp:", stats.lastReportTimestamp.toString(), "\n");

  // Step 6: Generate income analysis
  console.log("Step 6: Generating income analysis...");
  const analysisTx = await contract.connect(analyst).generateIncomeAnalysis();
  await analysisTx.wait();
  console.log("Income analysis generated\n");

  // Step 7: Verify artist profiles
  console.log("Step 7: Verifying artist profiles...");
  
  const profile1 = await contract.connect(artist1).getMyProfile();
  console.log("\nArtist 1 Profile:");
  console.log("  Artist ID:", profile1.artistId);
  console.log("  Is Active:", profile1.isActive);

  const profile2 = await contract.connect(artist2).getMyProfile();
  console.log("\nArtist 2 Profile:");
  console.log("  Artist ID:", profile2.artistId);
  console.log("  Is Active:", profile2.isActive);

  const profile3 = await contract.connect(artist3).getMyProfile();
  console.log("\nArtist 3 Profile:");
  console.log("  Artist ID:", profile3.artistId);
  console.log("  Is Active:", profile3.isActive);

  console.log("\n=====================================");
  console.log("Simulation Completed Successfully");
  console.log("=====================================\n");

  console.log("Summary:");
  console.log("--------");
  console.log("- 3 artists registered");
  console.log("- Income data submitted for all artists");
  console.log("- Creative analytics submitted for all artists");
  console.log("- Income analysis generated");
  console.log("- All profiles verified\n");

  console.log("Contract Address:", contract.address);
  console.log("Owner Address:", owner.address);
  console.log("Analyst Address:", analyst.address, "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nSimulation Failed:");
    console.error(error);
    process.exit(1);
  });
