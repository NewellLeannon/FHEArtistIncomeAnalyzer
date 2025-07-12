require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

// Hardhat tasks
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  console.log('Available accounts:');
  for (const account of accounts) {
    const balance = await hre.ethers.provider.getBalance(account.address);
    console.log(`${account.address} - Balance: ${hre.ethers.utils.formatEther(balance)} ETH`);
  }
});

task('balance', 'Prints an account's balance')
  .addParam('account', 'The account's address')
  .setAction(async (taskArgs, hre) => {
    const balance = await hre.ethers.provider.getBalance(taskArgs.account);
    console.log(`Balance: ${hre.ethers.utils.formatEther(balance)} ETH`);
  });

task('block-number', 'Prints the current block number', async (taskArgs, hre) => {
  const blockNumber = await hre.ethers.provider.getBlockNumber();
  console.log(`Current block number: ${blockNumber}`);
});

task('contract-info', 'Displays contract information')
  .addParam('address', 'The contract address')
  .setAction(async (taskArgs, hre) => {
    const code = await hre.ethers.provider.getCode(taskArgs.address);

    if (code === '0x') {
      console.log('No contract found at this address');
      return;
    }

    console.log('Contract found at:', taskArgs.address);
    console.log('Bytecode length:', code.length);

    const Contract = await hre.ethers.getContractFactory('PrivateArtistIncomeAnalyzer');
    const contract = Contract.attach(taskArgs.address);

    try {
      const owner = await contract.owner();
      const totalArtists = await contract.totalArtists();
      const sessionId = await contract.analysisSessionId();

      console.log('
Contract State:');
      console.log('- Owner:', owner);
      console.log('- Total Artists:', totalArtists.toString());
      console.log('- Analysis Session ID:', sessionId.toString());
    } catch (error) {
      console.log('Could not read contract state:', error.message);
    }
  });

task('deploy-status', 'Check deployment status on network', async (taskArgs, hre) => {
  const network = await hre.ethers.provider.getNetwork();
  const blockNumber = await hre.ethers.provider.getBlockNumber();

  console.log('Network Information:');
  console.log('- Name:', network.name);
  console.log('- Chain ID:', network.chainId);
  console.log('- Block Number:', blockNumber);
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: false,
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 'auto',
      gas: 'auto',
      timeout: 60000,
    },
    hardhat: {
      chainId: 1337,
      forking: process.env.MAINNET_RPC_URL ? {
        url: process.env.MAINNET_RPC_URL,
        enabled: false,
      } : undefined,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || '',
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
    scripts: './scripts',
  },
  mocha: {
    timeout: 60000,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};
