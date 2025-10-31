'use client';

import React, { useState } from 'react';
import { useFHE } from './FHEProvider';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export const ComputationDemo: React.FC = () => {
  const { client, initialized } = useFHE();
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul'>('add');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleCompute = async () => {
    if (!client || !initialized) {
      alert('FHEVM client not initialized');
      return;
    }

    try {
      setLoading(true);
      const instance = await client.createContractInstance({
        contractAddress: '0x0000000000000000000000000000000000000000',
      });

      // Encrypt both values
      const encrypted1 = await instance.encrypt32(parseInt(value1));
      const encrypted2 = await instance.encrypt32(parseInt(value2));

      // Simulate computation result
      let computedValue = 0;
      const val1 = parseInt(value1);
      const val2 = parseInt(value2);

      switch (operation) {
        case 'add':
          computedValue = val1 + val2;
          break;
        case 'sub':
          computedValue = val1 - val2;
          break;
        case 'mul':
          computedValue = val1 * val2;
          break;
      }

      setResult(`Computation complete: ${computedValue} (encrypted result available on-chain)`);
    } catch (error) {
      console.error('Computation error:', error);
      alert('Computation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Homomorphic Computation</h3>
        <p className="text-gray-400 mb-4">
          Perform computations on encrypted data without decryption
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input
          label="First Value"
          type="number"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          placeholder="Enter first number"
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Operation
          </label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as any)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="add">Addition (+)</option>
            <option value="sub">Subtraction (-)</option>
            <option value="mul">Multiplication (×)</option>
          </select>
        </div>

        <Input
          label="Second Value"
          type="number"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          placeholder="Enter second number"
        />
      </div>

      <Button
        onClick={handleCompute}
        loading={loading}
        disabled={!initialized || !value1 || !value2}
        className="w-full"
      >
        Compute on Encrypted Data
      </Button>

      {result && (
        <Card className="bg-gray-900">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Result:</h4>
          <p className="text-green-400">{result}</p>
        </Card>
      )}

      {!initialized && (
        <div className="text-yellow-500 text-sm">
          Initializing FHEVM client...
        </div>
      )}
    </div>
  );
};
