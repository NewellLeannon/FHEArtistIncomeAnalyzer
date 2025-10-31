export const NETWORK_CONFIGS = {
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia',
    publicKey: '',
    gatewayUrl: 'https://gateway.sepolia.fhenix.zone',
    aclAddress: '0x339EcE85B9E11a3A3AA557582784a15d7F82AAf2',
    kmsVerifierAddress: '0x9D6891A6240D6130c54ae243d8005063D05fE14b',
  },
  localhost: {
    chainId: 1337,
    name: 'Localhost',
    publicKey: '',
    gatewayUrl: 'http://localhost:8545',
  },
  hardhat: {
    chainId: 31337,
    name: 'Hardhat',
    publicKey: '',
    gatewayUrl: 'http://127.0.0.1:8545',
  },
};

export const DEFAULT_TIMEOUT = 60000; // 60 seconds

export const ENCRYPTION_TYPES = {
  EUINT8: 'euint8',
  EUINT16: 'euint16',
  EUINT32: 'euint32',
  EUINT64: 'euint64',
  EBOOL: 'ebool',
  EADDRESS: 'eaddress',
} as const;

export const EIP712_DOMAIN = {
  name: 'FHEVM',
  version: '1',
};
