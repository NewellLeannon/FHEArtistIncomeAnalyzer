const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function main() {
  console.log("=====================================");
  console.log("Contract Interaction Script");
  console.log("=====================================\n");

  const network = await ethers.provider.getNetwork();
  const [signer] = await ethers.getSigners();
  const signerAddress = await signer.getAddress();

  console.log("Connection Information:");
  console.log("----------------------");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);
  console.log("Signer Address:", signerAddress, "\n");

  let contractAddress;
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  
  if (fs.existsSync(deploymentsDir)) {
    const files = fs.readdirSync(deploymentsDir)
      .filter(f => f.startsWith(network.name) && f.endsWith('.json'))
      .sort().reverse();

    if (files.length > 0) {
      const latestDeployment = JSON.parse(
        fs.readFileSync(path.join(deploymentsDir, files[0]), 'utf8')
      );
      contractAddress = latestDeployment.contractAddress;
      console.log("Using deployed contract:", contractAddress, "\n");
    }
  }

  if (!contractAddress) {
    console.error("No deployment found. Please deploy the contract first.");
    process.exit(1);
  }

  if (!ethers.utils.isAddress(contractAddress)) {
    console.error("Error: Invalid contract address");
    process.exit(1);
  }

  const Contract = await ethers.getContractFactory("PrivateArtistIncomeAnalyzer");
  const contract = Contract.attach(contractAddress);

  console.log("=====================================");
  console.log("Reading Contract State");
  console.log("=====================================\n");

  try {
    const owner = await contract.owner();
    console.log("Contract Owner:", owner);

    const stats = await contract.getPlatformStats();
    console.log("\nPlatform Statistics:");
    console.log("-------------------");
    console.log("Total Artists:", stats.totalArtistsCount.toString());
    console.log("Current Session ID:", stats.currentSessionId.toString());
    console.log("Last Report Timestamp:", stats.lastReportTimestamp.toString());

    const isRegistered = await contract.isRegisteredArtist(signerAddress);
    console.log("\nIs Current Address Registered:", isRegistered);

    if (isRegistered) {
      console.log("\nArtist Profile:");
      console.log("--------------");
      const profile = await contract.getMyProfile();
      console.log("Artist ID:", profile.artistId);
      console.log("Profile Created:", new Date(profile.profileCreated.toNumber() * 1000).toISOString());
      console.log("Is Active:", profile.isActive);
    }

  } catch (error) {
    console.error("Error reading contract state:", error.message);
  }

  console.log("\n=====================================");
  console.log("Example Interactions");
  console.log("=====================================");
  console.log("\nTo interact with the contract, uncomment and modify:");
  console.log("\n// Register as artist");
  console.log('// const tx1 = await contract.registerArtist("artist_123");');
  console.log("// await tx1.wait();");
  console.log("\n// Submit income data");
  console.log("// const tx2 = await contract.submitIncomeData(50000, 10, 5000, 1000, 2000);");
  console.log("// await tx2.wait();");
  console.log("\n// Generate analysis (owner/analyst only)");
  console.log("// const tx3 = await contract.generateIncomeAnalysis();");
  console.log("// await tx3.wait();");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
