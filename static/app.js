// Privacy Artist Income Analyzer
let provider, signer, contract;
let userAddress;

// Contract address on Zama network
const CONTRACT_ADDRESS = "0xee7272C646331Db35A7217ed4c2a3aA8b17854aE";
const CONTRACT_ABI = [
    "function registerArtist(string calldata _artistId) external",
    "function submitIncomeData(uint64 _totalIncome, uint32 _artworksSold, uint32 _averagePrice, uint32 _royaltyEarnings, uint32 _commissionEarnings) external",
    "function submitCreativeAnalytics(uint32 _digitalArt, uint32 _physicalArt, uint32 _nftSales, uint32 _licensing, uint32 _workshops, uint32 _commissions) external",
    "function generateIncomeAnalysis() external",
    "function finalizeReport() external",
    "function getMyProfile() external view returns (string memory artistId, uint256 profileCreated, bool isActive)",
    "function getPlatformStats() external view returns (uint256 totalArtistsCount, uint256 currentSessionId, uint256 lastReportTimestamp)",
    "function isRegisteredArtist(address _artist) external view returns (bool)",
    "function getRegisteredArtistsCount() external view returns (uint256)",
    "event ArtistRegistered(address indexed artist, string artistId)",
    "event IncomeUpdated(address indexed artist, uint256 timestamp)",
    "event AnalysisCompleted(uint256 indexed sessionId, uint256 artistCount)",
    "event ReportGenerated(uint256 indexed sessionId, uint256 timestamp)"
];

// Network configuration for Sepolia testnet
const ZAMA_NETWORK = {
    chainId: '0xaa36a7', // Sepolia chain ID
    chainName: 'Sepolia test network',
    nativeCurrency: {
        name: 'SepoliaETH',
        symbol: 'SepoliaETH',
        decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
};

// Initialize application
async function init() {
    try {
        if (typeof window.ethereum !== 'undefined') {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await checkAndSwitchNetwork();
            await connectWallet();
            setupEventListeners();
            await loadPlatformStats();
        } else {
            showStatus('Please install MetaMask to use this application', 'error');
        }
    } catch (error) {
        console.error('Initialization error:', error);
        showStatus('Failed to initialize application', 'error');
    }
}

// Check and switch to Zama network
async function checkAndSwitchNetwork() {
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId !== ZAMA_NETWORK.chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: ZAMA_NETWORK.chainId }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [ZAMA_NETWORK],
                    });
                } else {
                    throw switchError;
                }
            }
        }
    } catch (error) {
        console.error('Network switch error:', error);
        showStatus('Please switch to Zama Devnet network', 'warning');
    }
}

// Connect to MetaMask wallet
async function connectWallet() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        showStatus(`✅ Connected: ${formatAddress(userAddress)}`, 'success');

        // Check if user is registered artist
        await checkRegistrationStatus();

    } catch (error) {
        console.error('Wallet connection error:', error);
        showStatus('Failed to connect wallet', 'error');
    }
}

// Check if current user is a registered artist
async function checkRegistrationStatus() {
    try {
        const isRegistered = await contract.isRegisteredArtist(userAddress);
        if (isRegistered) {
            showStatus('✅ You are registered as an artist', 'success');
            document.getElementById('registerBtn').textContent = 'Already Registered';
            document.getElementById('registerBtn').disabled = true;
        } else {
            showStatus('ℹ️ Please register as an artist to submit data', 'warning');
        }
    } catch (error) {
        console.error('Registration check error:', error);
    }
}

// Register as an artist
async function registerArtist() {
    const artistId = document.getElementById('artistId').value.trim();

    if (!artistId) {
        showStatus('Please enter an artist ID', 'error');
        return;
    }

    try {
        document.getElementById('registerBtn').disabled = true;
        document.getElementById('registerBtn').textContent = 'Registering...';

        const tx = await contract.registerArtist(artistId);
        showStatus('⏳ Registration transaction submitted...', 'warning');
        await tx.wait();

        showStatus('✅ Successfully registered as artist!', 'success');
        document.getElementById('registerBtn').textContent = 'Registered';
        await loadPlatformStats();

    } catch (error) {
        console.error('Registration error:', error);
        showStatus('Registration failed: ' + (error.reason || error.message), 'error');
        document.getElementById('registerBtn').disabled = false;
        document.getElementById('registerBtn').textContent = 'Register as Artist';
    }
}

// Submit income data
async function submitIncomeData() {
    const totalIncome = document.getElementById('totalIncome').value;
    const artworksSold = document.getElementById('artworksSold').value;
    const averagePrice = document.getElementById('averagePrice').value;
    const royaltyEarnings = document.getElementById('royaltyEarnings').value;
    const commissionEarnings = document.getElementById('commissionEarnings').value;

    if (!totalIncome || !artworksSold || !averagePrice || !royaltyEarnings || !commissionEarnings) {
        showStatus('Please fill in all income fields', 'error');
        return;
    }

    try {
        document.getElementById('submitIncomeBtn').disabled = true;
        document.getElementById('submitIncomeBtn').textContent = 'Encrypting & Submitting...';

        const tx = await contract.submitIncomeData(
            ethers.BigNumber.from(totalIncome),
            parseInt(artworksSold),
            parseInt(averagePrice),
            parseInt(royaltyEarnings),
            parseInt(commissionEarnings)
        );

        showStatus('⏳ Income data transaction submitted...', 'warning');
        await tx.wait();

        showStatus('✅ Income data submitted successfully!', 'success');

        // Clear form
        document.getElementById('totalIncome').value = '';
        document.getElementById('artworksSold').value = '';
        document.getElementById('averagePrice').value = '';
        document.getElementById('royaltyEarnings').value = '';
        document.getElementById('commissionEarnings').value = '';

    } catch (error) {
        console.error('Income submission error:', error);
        showStatus('Failed to submit income data: ' + (error.reason || error.message), 'error');
    } finally {
        document.getElementById('submitIncomeBtn').disabled = false;
        document.getElementById('submitIncomeBtn').textContent = 'Submit Private Data';
    }
}

// Submit creative analytics
async function submitCreativeAnalytics() {
    const digitalArt = document.getElementById('digitalArt').value || '0';
    const physicalArt = document.getElementById('physicalArt').value || '0';
    const nftSales = document.getElementById('nftSales').value || '0';
    const licensing = document.getElementById('licensing').value || '0';
    const workshops = document.getElementById('workshops').value || '0';
    const commissions = document.getElementById('commissions').value || '0';

    try {
        document.getElementById('submitAnalyticsBtn').disabled = true;
        document.getElementById('submitAnalyticsBtn').textContent = 'Submitting Analytics...';

        const tx = await contract.submitCreativeAnalytics(
            parseInt(digitalArt),
            parseInt(physicalArt),
            parseInt(nftSales),
            parseInt(licensing),
            parseInt(workshops),
            parseInt(commissions)
        );

        showStatus('⏳ Analytics transaction submitted...', 'warning');
        await tx.wait();

        showStatus('✅ Creative analytics submitted successfully!', 'success');

        // Clear form
        ['digitalArt', 'physicalArt', 'nftSales', 'licensing', 'workshops', 'commissions'].forEach(id => {
            document.getElementById(id).value = '';
        });

    } catch (error) {
        console.error('Analytics submission error:', error);
        showStatus('Failed to submit analytics: ' + (error.reason || error.message), 'error');
    } finally {
        document.getElementById('submitAnalyticsBtn').disabled = false;
        document.getElementById('submitAnalyticsBtn').textContent = 'Submit Analytics';
    }
}

// Generate income analysis
async function generateAnalysis() {
    try {
        document.getElementById('generateBtn').disabled = true;
        document.getElementById('generateBtn').textContent = 'Generating Analysis...';

        const tx = await contract.generateIncomeAnalysis();
        showStatus('⏳ Analysis generation transaction submitted...', 'warning');
        await tx.wait();

        showStatus('✅ Income analysis generated!', 'success');
        document.getElementById('analysisStatus').innerHTML = '<div class="status success">Analysis completed - ready to finalize report</div>';

    } catch (error) {
        console.error('Analysis generation error:', error);
        showStatus('Failed to generate analysis: ' + (error.reason || error.message), 'error');
    } finally {
        document.getElementById('generateBtn').disabled = false;
        document.getElementById('generateBtn').textContent = 'Generate Analysis';
    }
}

// Finalize report
async function finalizeReport() {
    try {
        document.getElementById('finalizeBtn').disabled = true;
        document.getElementById('finalizeBtn').textContent = 'Finalizing Report...';

        const tx = await contract.finalizeReport();
        showStatus('⏳ Report finalization transaction submitted...', 'warning');
        await tx.wait();

        showStatus('✅ Report finalized successfully!', 'success');
        document.getElementById('analysisStatus').innerHTML = '<div class="status success">Report has been finalized and published</div>';
        await loadPlatformStats();

    } catch (error) {
        console.error('Report finalization error:', error);
        showStatus('Failed to finalize report: ' + (error.reason || error.message), 'error');
    } finally {
        document.getElementById('finalizeBtn').disabled = false;
        document.getElementById('finalizeBtn').textContent = 'Finalize Report';
    }
}

// Load platform statistics
async function loadPlatformStats() {
    try {
        const stats = await contract.getPlatformStats();

        document.getElementById('totalArtists').textContent = stats.totalArtistsCount.toString();
        document.getElementById('currentSession').textContent = stats.currentSessionId.toString();

        if (stats.lastReportTimestamp.toString() !== '0') {
            const lastReport = new Date(stats.lastReportTimestamp.toNumber() * 1000);
            document.getElementById('lastReport').textContent = lastReport.toLocaleDateString();
        } else {
            document.getElementById('lastReport').textContent = 'None';
        }

    } catch (error) {
        console.error('Stats loading error:', error);
        showStatus('Failed to load platform statistics', 'error');
    }
}

// Load user profile
async function loadMyProfile() {
    try {
        const profile = await contract.getMyProfile();

        document.getElementById('profileInfo').innerHTML = `
            <div style="margin-bottom: 15px;">
                <strong>Artist ID:</strong> ${profile.artistId}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Profile Created:</strong> ${new Date(profile.profileCreated.toNumber() * 1000).toLocaleDateString()}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Status:</strong> <span style="color: ${profile.isActive ? '#4caf50' : '#f44336'}">${profile.isActive ? 'Active' : 'Inactive'}</span>
            </div>
        `;

    } catch (error) {
        console.error('Profile loading error:', error);
        if (error.message.includes('Not registered artist')) {
            document.getElementById('profileInfo').innerHTML = '<p style="color: #ffc107;">Please register as an artist first.</p>';
        } else {
            showStatus('Failed to load profile', 'error');
        }
    }
}

// Setup event listeners for contract events
function setupEventListeners() {
    if (contract) {
        contract.on('ArtistRegistered', (artist, artistId, event) => {
            if (artist.toLowerCase() === userAddress.toLowerCase()) {
                showStatus(`✅ Registration confirmed for ${artistId}`, 'success');
            }
        });

        contract.on('IncomeUpdated', (artist, timestamp, event) => {
            if (artist.toLowerCase() === userAddress.toLowerCase()) {
                showStatus('✅ Income data updated successfully', 'success');
            }
        });

        contract.on('AnalysisCompleted', (sessionId, artistCount, event) => {
            showStatus(`✅ Analysis completed for session ${sessionId} with ${artistCount} artists`, 'success');
        });

        contract.on('ReportGenerated', (sessionId, timestamp, event) => {
            showStatus(`✅ Report generated for session ${sessionId}`, 'success');
            loadPlatformStats();
        });
    }
}

// Utility function to show status messages
function showStatus(message, type = 'info') {
    const statusElement = document.getElementById('connectionStatus');
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (userAddress) {
                statusElement.textContent = `✅ Connected: ${formatAddress(userAddress)}`;
                statusElement.className = 'status success';
            }
        }, 5000);
    }
}

// Format address for display
function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
}

// Handle network and account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            showStatus('Please connect your wallet', 'warning');
        } else {
            window.location.reload();
        }
    });

    window.ethereum.on('chainChanged', function (chainId) {
        window.location.reload();
    });
}

// Initialize when page loads
window.addEventListener('load', init);