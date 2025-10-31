'use client';

import React, { useState } from 'react';
import { useFHE } from './FHEProvider';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export const EncryptionDemo: React.FC = () => {
  const { client, initialized } = useFHE();
  const [value, setValue] = useState('');
  const [encryptedData, setEncryptedData] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [encryptionType, setEncryptionType] = useState<'uint8' | 'uint16' | 'uint32' | 'bool'>('uint32');

  const handleEncrypt = async () => {
    if (!client || !initialized) {
      alert('FHEVM client not initialized');
      return;
    }

    try {
      setLoading(true);
      const instance = await client.createContractInstance({
        contractAddress: '0x0000000000000000000000000000000000000000',
      });

      let result;
      switch (encryptionType) {
        case 'uint8':
          result = await instance.encrypt8(parseInt(value));
          break;
        case 'uint16':
          result = await instance.encrypt16(parseInt(value));
          break;
        case 'uint32':
          result = await instance.encrypt32(parseInt(value));
          break;
        case 'bool':
          result = await instance.encryptBool(value === 'true');
          break;
      }

      setEncryptedData(Buffer.from(result.data).toString('hex'));
    } catch (error) {
      console.error('Encryption error:', error);
      alert('Encryption failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Encrypt Data</h3>
        <p className="text-gray-400 mb-4">
          Enter a value to encrypt using Fully Homomorphic Encryption
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Encryption Type
          </label>
          <select
            value={encryptionType}
            onChange={(e) => setEncryptionType(e.target.value as any)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="uint8">8-bit Integer</option>
            <option value="uint16">16-bit Integer</option>
            <option value="uint32">32-bit Integer</option>
            <option value="bool">Boolean</option>
          </select>
        </div>

        <Input
          label="Value to Encrypt"
          type={encryptionType === 'bool' ? 'text' : 'number'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={encryptionType === 'bool' ? 'true/false' : 'Enter a number'}
        />
      </div>

      <Button
        onClick={handleEncrypt}
        loading={loading}
        disabled={!initialized || !value}
        className="w-full"
      >
        Encrypt Value
      </Button>

      {encryptedData && (
        <Card className="bg-gray-900">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Encrypted Data:</h4>
          <p className="font-mono text-sm text-green-400 break-all">{encryptedData}</p>
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
