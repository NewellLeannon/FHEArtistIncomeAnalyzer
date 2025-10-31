'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          FHE Artist Income Analyzer
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Connect Wallet</h2>
          
          {!connected ? (
            <button
              onClick={connectWallet}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect MetaMask
            </button>
          ) : (
            <div>
              <p className="text-green-600 font-semibold mb-2">Connected</p>
              <p className="text-sm text-gray-600 break-all">{account}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <p className="text-gray-700 mb-4">
            Privacy-preserving artist income analysis platform powered by Fully Homomorphic Encryption (FHE).
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Anonymous artist registration</li>
            <li>Encrypted income submission</li>
            <li>Privacy-protected analytics</li>
            <li>Secure aggregate reporting</li>
          </ul>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Contract: 0xee7272C646331Db35A7217ed4c2a3aA8b17854aE</p>
          <p>Network: Sepolia Testnet</p>
        </div>
      </div>
    </main>
  )
}
