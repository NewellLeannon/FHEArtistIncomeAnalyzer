const { run, ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function main() {
  console.log("=====================================");
  console.log("Contract Verification Script");
  console.log("=====================================
");

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${network.chainId}
`);

  // Check if Etherscan API key is configured
  if (!process.env.ETHERSCAN_API_KEY) {
    console.error("Error: ETHERSCAN_API_KEY not found in environment variables");
    console.error("Please add it to your .env file");
    process.exit(1);
  }

  // Get contract address
  let contractAddress;

  // Try to read from most recent deployment file
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (fs.existsSync(deploymentsDir)) {
    const files = fs.readdirSync(deploymentsDir)
      .filter(f => f.startsWith(network.name) && f.endsWith('.json'))
      .sort()
      .reverse();

    if (files.length > 0) {
      const latestDeployment = JSON.parse(
        fs.readFileSync(path.join(deploymentsDir, files[0]), 'utf8')
      );
      contractAddress = latestDeployment.contractAddress;
      console.log(`Found deployment: ${contractAddress}
`);
    }
  }

  // If not found, prompt for address
  if (!contractAddress) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    contractAddress = await new Promise((resolve) => {
      rl.question('Enter contract address to verify: ', (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  if (!contractAddress || !ethers.utils.isAddress(contractAddress)) {
    console.error("Error: Invalid contract address");
    process.exit(1);
  }

  console.log(`Verifying contract at: ${contractAddress}
`);

  try {
    console.log("Submitting for verification...");
    console.log("This may take a few moments...
");

    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log("
=====================================");
    console.log("Verification Successful!");
    console.log("=====================================
");
    console.log(`Contract verified at: ${contractAddress}
`);

    if (network.name === "sepolia") {
      console.log("View on Etherscan:");
      console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code
`);
    }

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("
=====================================");
      console.log("Contract Already Verified");
      console.log("=====================================
");
      console.log(`Contract at ${contractAddress} is already verified
`);

      if (network.name === "sepolia") {
        console.log("View on Etherscan:");
        console.log(`https://sepolia.etherscan.io/address/${contractAddress}#code
`);
      }
    } else {
      console.error("
=====================================");
      console.error("Verification Failed");
      console.error("=====================================");
      console.error(error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => {
    console.log("Verification process completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Verification error:", error);
    process.exit(1);
  });
