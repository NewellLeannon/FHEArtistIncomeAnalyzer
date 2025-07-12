const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=====================================");
  console.log("Privacy Artist Income Analyzer");
  console.log("Deployment Script");
  console.log("=====================================
");

  // Get network information
  const network = await ethers.provider.getNetwork();
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);

  console.log("Deployment Configuration:");
  console.log("------------------------");
  console.log(`Network Name: ${network.name}`);
  console.log(`Chain ID: ${network.chainId}`);
  console.log(`Deployer Address: ${deployerAddress}`);
  console.log(`Deployer Balance: ${ethers.utils.formatEther(balance)} ETH
`);

  // Check balance
  if (balance.isZero()) {
    console.error("Error: Deployer account has no balance");
    process.exit(1);
  }

  // Get the contract factory
  console.log("Compiling contracts...");
  const PrivateArtistIncomeAnalyzer = await ethers.getContractFactory("PrivateArtistIncomeAnalyzer");

  console.log("Deploying PrivateArtistIncomeAnalyzer contract...");
  console.log("This may take a few moments...
");

  // Deploy the contract
  const contract = await PrivateArtistIncomeAnalyzer.deploy();
  await contract.deployed();

  const deploymentTx = contract.deployTransaction;

  console.log("=====================================");
  console.log("Deployment Successful!");
  console.log("=====================================
");

  console.log("Contract Details:");
  console.log("----------------");
  console.log(`Contract Address: ${contract.address}`);
  console.log(`Transaction Hash: ${deploymentTx.hash}`);
  console.log(`Block Number: ${deploymentTx.blockNumber}`);
  console.log(`Gas Used: ${deploymentTx.gasLimit.toString()}`);
  console.log(`Gas Price: ${ethers.utils.formatUnits(deploymentTx.gasPrice, 'gwei')} gwei
`);

  // Wait for confirmations
  console.log("Waiting for 3 block confirmations...");
  await contract.deployTransaction.wait(3);
  console.log("Confirmations received
");

  // Verify contract state
  try {
    console.log("Verifying Contract State:");
    console.log("------------------------");
    const owner = await contract.owner();
    const totalArtists = await contract.totalArtists();
    const sessionId = await contract.analysisSessionId();

    console.log(`Owner: ${owner}`);
    console.log(`Total Artists: ${totalArtists.toString()}`);
    console.log(`Analysis Session ID: ${sessionId.toString()}
`);

  } catch (error) {
    console.warn("Warning: Could not verify contract state:", error.message);
    console.log();
  }

  // Save deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId,
    contractAddress: contract.address,
    deployerAddress: deployerAddress,
    transactionHash: deploymentTx.hash,
    blockNumber: deploymentTx.blockNumber,
    gasUsed: deploymentTx.gasLimit.toString(),
    gasPrice: ethers.utils.formatUnits(deploymentTx.gasPrice, 'gwei'),
    timestamp: new Date().toISOString(),
    contractName: "PrivateArtistIncomeAnalyzer"
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filename = `${network.name}_${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));

  console.log("Deployment Information Saved:");
  console.log(`File: ${filepath}
`);

  console.log("=====================================");
  console.log("Next Steps:");
  console.log("=====================================");
  console.log("1. Verify contract on Etherscan:");
  console.log(`   npm run verify
`);
  console.log("2. Update CONTRACT_ADDRESS in frontend:");
  console.log(`   const CONTRACT_ADDRESS = "${contract.address}";
`);
  console.log("3. Interact with the contract:");
  console.log(`   npm run interact
`);
  console.log("4. Start development server:");
  console.log(`   npm run dev
`);

  if (network.name === "sepolia") {
    console.log("View on Etherscan:");
    console.log(`https://sepolia.etherscan.io/address/${contract.address}`);
  }

  console.log("
=====================================
");

  return {
    contract: contract.address,
    deployer: deployerAddress,
    network: network.name
  };
}

// Execute deployment
main()
  .then((result) => {
    console.log("Deployment completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("
=====================================");
    console.error("Deployment Failed");
    console.error("=====================================");
    console.error(error);
    process.exit(1);
  });
