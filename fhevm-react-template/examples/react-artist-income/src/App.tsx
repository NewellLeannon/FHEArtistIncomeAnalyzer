import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

function App() {
  const [account, setAccount] = useState<string>('')
  const [connected, setConnected] = useState(false)

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])
        setAccount(accounts[0])
        setConnected(true)
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      }
    } else {
      alert('Please install MetaMask')
    }
  }

  return (
    <div className="App">
      <header>
        <h1>FHE Artist Income Analyzer</h1>
        <p className="subtitle">React + FHEVM SDK</p>
      </header>

      <main>
        <section className="card">
          <h2>Connect Wallet</h2>
          {!connected ? (
            <button onClick={connectWallet} className="connect-btn">
              Connect MetaMask
            </button>
          ) : (
            <div className="connected">
              <p className="status">✓ Connected</p>
              <p className="address">{account}</p>
            </div>
          )}
        </section>

        <section className="card">
          <h2>About</h2>
          <p>
            Privacy-preserving artist income analysis with Fully Homomorphic Encryption (FHE).
          </p>
          <ul>
            <li>Anonymous artist registration</li>
            <li>Encrypted income submission</li>
            <li>Privacy-protected analytics</li>
            <li>Secure aggregate reporting</li>
          </ul>
        </section>

        <footer>
          <p>Contract: 0xee7272C646331Db35A7217ed4c2a3aA8b17854aE</p>
          <p>Network: Sepolia Testnet</p>
        </footer>
      </main>
    </div>
  )
}

export default App
