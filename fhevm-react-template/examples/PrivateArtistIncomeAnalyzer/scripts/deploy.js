const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Privacy Artist Income Analyzer contract...");

  // Get the contract factory
  const PrivateArtistIncomeAnalyzer = await ethers.getContractFactory("PrivateArtistIncomeAnalyzer");

  // Deploy the contract
  const contract = await PrivateArtistIncomeAnalyzer.deploy();
  await contract.deployed();

  console.log("✅ PrivateArtistIncomeAnalyzer deployed to:", contract.address);
  console.log("📊 Transaction hash:", contract.deployTransaction.hash);

  // Wait for a few confirmations
  console.log("⏳ Waiting for confirmations...");
  await contract.deployTransaction.wait(3);

  console.log("🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Details:");
  console.log("- Address:", contract.address);
  console.log("- Network:", (await contract.provider.getNetwork()).name);
  console.log("- Deployer:", await contract.owner());

  // Verify contract interaction
  try {
    const totalArtists = await contract.totalArtists();
    const sessionId = await contract.analysisSessionId();

    console.log("\n📈 Initial State:");
    console.log("- Total Artists:", totalArtists.toString());
    console.log("- Analysis Session ID:", sessionId.toString());

  } catch (error) {
    console.warn("⚠️ Could not verify contract state:", error.message);
  }

  console.log("\n🔧 Next Steps:");
  console.log("1. Update CONTRACT_ADDRESS in public/app.js");
  console.log("2. Run: npm run dev");
  console.log("3. Open http://localhost:8080");

  return contract.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });