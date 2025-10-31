import { useState } from 'react'
import { ethers } from 'ethers'
import Head from 'next/head'

export default function Home() {
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
    <>
      <Head>
        <title>FHE Artist Income Dashboard</title>
        <meta name="description" content="Privacy-preserving artist income dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <main className="container">
        <h1>FHE Artist Income Dashboard</h1>
        <p className="subtitle">Next.js Pages Router + FHEVM SDK</p>

        <div className="grid">
          <div className="card">
            <h2>Connect Wallet</h2>
            {!connected ? (
              <button onClick={connectWallet} className="btn">
                Connect MetaMask
              </button>
            ) : (
              <div className="success">
                <p className="status">✓ Connected</p>
                <p className="address">{account}</p>
              </div>
            )}
          </div>

          <div className="card">
            <h2>Features</h2>
            <ul>
              <li>Anonymous Registration</li>
              <li>Encrypted Income Data</li>
              <li>Privacy-Protected Analytics</li>
              <li>Aggregate Reporting</li>
            </ul>
          </div>
        </div>

        <div className="info">
          <p>Contract: 0xee7272C646331Db35A7217ed4c2a3aA8b17854aE</p>
          <p>Network: Sepolia Testnet</p>
        </div>
      </main>
    </>
  )
}
