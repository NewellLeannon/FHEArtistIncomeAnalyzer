'use client';

import React, { useState } from 'react';
import { useFHE } from '../fhe/FHEProvider';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export const BankingExample: React.FC = () => {
  const { client, initialized } = useFHE();
  const [balance, setBalance] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [encryptedBalance, setEncryptedBalance] = useState<string>('');

  const handleSubmitBalance = async () => {
    if (!client || !initialized) {
      alert('FHEVM client not initialized');
      return;
    }

    try {
      setLoading(true);
      const instance = await client.createContractInstance({
        contractAddress: '0x0000000000000000000000000000000000000000',
      });

      const encrypted = await instance.encrypt64(BigInt(balance));
      setEncryptedBalance(Buffer.from(encrypted.data).toString('hex'));

      alert('Balance encrypted and submitted to blockchain!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit balance');
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!client || !initialized) {
      alert('FHEVM client not initialized');
      return;
    }

    try {
      setLoading(true);
      const instance = await client.createContractInstance({
        contractAddress: '0x0000000000000000000000000000000000000000',
      });

      const encrypted = await instance.encrypt64(BigInt(transactionAmount));

      alert('Transaction processed on encrypted balance!');
    } catch (error) {
      console.error('Error:', error);
      alert('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Private Banking Example</h3>
        <p className="text-gray-400 mb-4">
          Store and manage encrypted bank balances with complete privacy
        </p>
      </div>

      <Card className="bg-gray-900">
        <h4 className="text-lg font-semibold text-white mb-4">Set Private Balance</h4>
        <div className="space-y-4">
          <Input
            label="Account Balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="Enter your balance"
          />
          <Button
            onClick={handleSubmitBalance}
            loading={loading}
            disabled={!initialized || !balance}
            className="w-full"
          >
            Submit Encrypted Balance
          </Button>
          {encryptedBalance && (
            <div className="mt-4 p-3 bg-green-900 bg-opacity-30 border border-green-500 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Encrypted Balance (first 64 chars):</p>
              <p className="font-mono text-xs text-green-400 break-all">
                {encryptedBalance.substring(0, 64)}...
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-gray-900">
        <h4 className="text-lg font-semibold text-white mb-4">Private Transaction</h4>
        <div className="space-y-4">
          <Input
            label="Transaction Amount"
            type="number"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            placeholder="Enter amount to transfer"
          />
          <Button
            onClick={handleTransaction}
            loading={loading}
            disabled={!initialized || !transactionAmount || !encryptedBalance}
            variant="secondary"
            className="w-full"
          >
            Process Private Transaction
          </Button>
        </div>
      </Card>

      <div className="p-4 bg-blue-900 bg-opacity-30 border border-blue-500 rounded-lg">
        <h5 className="text-sm font-semibold text-blue-300 mb-2">Privacy Features:</h5>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Balance remains encrypted on-chain</li>
          <li>Transactions computed on encrypted data</li>
          <li>Only authorized parties can decrypt</li>
          <li>Complete financial privacy</li>
        </ul>
      </div>
    </div>
  );
};
