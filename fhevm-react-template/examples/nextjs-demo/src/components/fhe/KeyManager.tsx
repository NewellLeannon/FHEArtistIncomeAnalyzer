'use client';

import React from 'react';
import { useFHE } from './FHEProvider';
import { Card } from '../ui/Card';

export const KeyManager: React.FC = () => {
  const { initialized, error } = useFHE();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">FHEVM Status</h3>
          <p className="text-sm text-gray-400 mt-1">
            {initialized ? 'Connected to FHEVM network' : 'Initializing...'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {initialized ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Active</span>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-400 font-medium">Error</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 font-medium">Connecting...</span>
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-900 bg-opacity-30 border border-red-500 rounded-lg">
          <p className="text-sm text-red-300">Error: {error.message}</p>
        </div>
      )}
    </Card>
  );
};
