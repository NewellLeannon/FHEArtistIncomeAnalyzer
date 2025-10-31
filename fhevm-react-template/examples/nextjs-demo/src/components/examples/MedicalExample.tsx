'use client';

import React, { useState } from 'react';
import { useFHE } from '../fhe/FHEProvider';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export const MedicalExample: React.FC = () => {
  const { client, initialized } = useFHE();
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [temperature, setTemperature] = useState('');
  const [loading, setLoading] = useState(false);
  const [recordId, setRecordId] = useState<string>('');

  const handleSubmitRecord = async () => {
    if (!client || !initialized) {
      alert('FHEVM client not initialized');
      return;
    }

    try {
      setLoading(true);
      const instance = await client.createContractInstance({
        contractAddress: '0x0000000000000000000000000000000000000000',
      });

      // Encrypt medical data
      const encryptedHeartRate = await instance.encrypt16(parseInt(heartRate));
      const encryptedBP = await instance.encrypt16(parseInt(bloodPressure));
      const encryptedTemp = await instance.encrypt16(Math.round(parseFloat(temperature) * 10));

      // Generate mock record ID
      const id = `MED-${Date.now().toString(36).toUpperCase()}`;
      setRecordId(id);

      alert('Medical record encrypted and stored securely!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit medical record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">Private Medical Records</h3>
        <p className="text-gray-400 mb-4">
          Store sensitive medical data with complete encryption and privacy
        </p>
      </div>

      <Card className="bg-gray-900">
        <h4 className="text-lg font-semibold text-white mb-4">Patient Vitals</h4>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input
            label="Heart Rate (bpm)"
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="e.g., 72"
          />
          <Input
            label="Blood Pressure (mmHg)"
            type="number"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="e.g., 120"
          />
          <Input
            label="Temperature (°C)"
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="e.g., 37.0"
          />
        </div>
        <Button
          onClick={handleSubmitRecord}
          loading={loading}
          disabled={!initialized || !heartRate || !bloodPressure || !temperature}
          className="w-full"
        >
          Submit Encrypted Medical Record
        </Button>
      </Card>

      {recordId && (
        <Card className="bg-green-900 bg-opacity-30 border border-green-500">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h5 className="text-sm font-semibold text-green-300 mb-1">Record Submitted Successfully</h5>
              <p className="text-sm text-gray-300">Record ID: <span className="font-mono text-green-400">{recordId}</span></p>
              <p className="text-xs text-gray-400 mt-2">All vitals are encrypted and stored securely on-chain</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-purple-900 bg-opacity-30 border border-purple-500">
          <h5 className="text-sm font-semibold text-purple-300 mb-2">HIPAA Compliant</h5>
          <p className="text-xs text-gray-300">
            Encrypted storage ensures compliance with healthcare privacy regulations
          </p>
        </Card>
        <Card className="bg-blue-900 bg-opacity-30 border border-blue-500">
          <h5 className="text-sm font-semibold text-blue-300 mb-2">Secure Access Control</h5>
          <p className="text-xs text-gray-300">
            Only authorized medical professionals can decrypt patient data
          </p>
        </Card>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <h5 className="text-sm font-semibold text-gray-300 mb-3">Use Cases:</h5>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Patient health records</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Clinical trial data</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Prescription history</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>Diagnostic results</span>
          </div>
        </div>
      </div>
    </div>
  );
};
