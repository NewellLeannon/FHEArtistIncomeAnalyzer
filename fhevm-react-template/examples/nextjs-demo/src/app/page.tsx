'use client';

import { useState } from 'react';
import { FHEProvider } from '@/components/fhe/FHEProvider';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';
import { Card } from '@/components/ui/Card';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encryption' | 'computation' | 'banking' | 'medical'>('encryption');

  return (
    <FHEProvider>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              FHEVM Next.js Demo
            </h1>
            <p className="text-xl text-gray-300">
              Fully Homomorphic Encryption for confidential smart contracts
            </p>
          </header>

          <div className="mb-8">
            <KeyManager />
          </div>

          <Card className="mb-8">
            <div className="flex gap-4 border-b border-gray-700 mb-6">
              <button
                onClick={() => setActiveTab('encryption')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'encryption'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Encryption
              </button>
              <button
                onClick={() => setActiveTab('computation')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'computation'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Computation
              </button>
              <button
                onClick={() => setActiveTab('banking')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'banking'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Banking Example
              </button>
              <button
                onClick={() => setActiveTab('medical')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'medical'
                    ? 'border-b-2 border-blue-500 text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Medical Example
              </button>
            </div>

            <div className="mt-6">
              {activeTab === 'encryption' && <EncryptionDemo />}
              {activeTab === 'computation' && <ComputationDemo />}
              {activeTab === 'banking' && <BankingExample />}
              {activeTab === 'medical' && <MedicalExample />}
            </div>
          </Card>

          <footer className="text-center text-gray-400 mt-12">
            <p>Built with FHEVM SDK - Privacy-preserving smart contracts</p>
          </footer>
        </div>
      </main>
    </FHEProvider>
  );
}
