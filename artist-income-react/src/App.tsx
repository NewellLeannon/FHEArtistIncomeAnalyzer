import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import ArtistRegistration from './components/ArtistRegistration';
import IncomeSubmission from './components/IncomeSubmission';
import CreativeAnalytics from './components/CreativeAnalytics';
import PlatformStats from './components/PlatformStats';
import AnalysisControls from './components/AnalysisControls';
import ProfileInfo from './components/ProfileInfo';

const CONTRACT_ADDRESS = "0xee7272C646331Db35A7217ed4c2a3aA8b17854aE";
const CONTRACT_ABI = [
  "function registerArtist(string calldata _artistId) external",
  "function submitIncomeData(uint64 _totalIncome, uint32 _artworksSold, uint32 _averagePrice, uint32 _royaltyEarnings, uint32 _commissionEarnings) external",
  "function submitCreativeAnalytics(uint32 _digitalArt, uint32 _physicalArt, uint32 _nftSales, uint32 _licensing, uint32 _workshops, uint32 _commissions) external",
  "function generateIncomeAnalysis() external",
  "function finalizeReport() external",
  "function getMyProfile() external view returns (string memory artistId, uint256 profileCreated, bool isActive)",
  "function getPlatformStats() external view returns (uint256 totalArtistsCount, uint256 currentSessionId, uint256 lastReportTimestamp)",
  "function isRegisteredArtist(address _artist) external view returns (bool)"
];

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [status, setStatus] = useState<{ message: string; type: string }>({
    message: 'Please connect your wallet to continue',
    type: 'warning'
  });
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        await connectWallet(web3Provider);
      } catch (error) {
        console.error('Initialization error:', error);
        setStatus({ message: 'Failed to initialize application', type: 'error' });
      }
    } else {
      setStatus({ message: 'Please install MetaMask to use this application', type: 'error' });
    }
  };

  const connectWallet = async (web3Provider: ethers.providers.Web3Provider) => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();

      setSigner(web3Signer);
      setUserAddress(address);

      const artistContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer);
      setContract(artistContract);

      setStatus({
        message: `Connected: ${formatAddress(address)}`,
        type: 'success'
      });

      // Check registration status
      const registered = await artistContract.isRegisteredArtist(address);
      setIsRegistered(registered);

    } catch (error) {
      console.error('Wallet connection error:', error);
      setStatus({ message: 'Failed to connect wallet', type: 'error' });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎨 Privacy Artist Income Analyzer</h1>
        <p>Confidential creative economy insights powered by Zama FHE technology</p>
      </div>

      <div className={`status ${status.type}`}>
        {status.type === 'warning' && '⚠️ '}
        {status.type === 'success' && '✅ '}
        {status.type === 'error' && '❌ '}
        {status.message}
      </div>

      <div className="dashboard">
        <ArtistRegistration
          contract={contract}
          isRegistered={isRegistered}
          setIsRegistered={setIsRegistered}
          setStatus={setStatus}
        />

        <IncomeSubmission
          contract={contract}
          setStatus={setStatus}
        />

        <CreativeAnalytics
          contract={contract}
          setStatus={setStatus}
        />

        <PlatformStats
          contract={contract}
        />

        <AnalysisControls
          contract={contract}
          setStatus={setStatus}
        />

        <ProfileInfo
          contract={contract}
          setStatus={setStatus}
        />
      </div>

      <div className="privacy-notice">
        <h4>🔐 Privacy & Security</h4>
        <p>
          This platform uses Zama's Fully Homomorphic Encryption (FHE) technology to ensure that your
          income data remains completely private. Your sensitive financial information is encrypted
          end-to-end and can only be used for aggregate analysis without revealing individual details.
          No personal income data is ever exposed to other users, platform operators, or third parties.
        </p>
      </div>
    </div>
  );
}

export default App;
