'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FhevmClient } from '@fhevm/sdk';

interface FHEContextType {
  client: FhevmClient | null;
  initialized: boolean;
  error: Error | null;
}

const FHEContext = createContext<FHEContextType>({
  client: null,
  initialized: false,
  error: null,
});

export const useFHE = () => useContext(FHEContext);

interface FHEProviderProps {
  children: React.ReactNode;
}

export const FHEProvider: React.FC<FHEProviderProps> = ({ children }) => {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initFHE = async () => {
      try {
        const fhevmClient = new FhevmClient({
          network: 'sepolia',
        });

        await fhevmClient.initialize();
        setClient(fhevmClient);
        setInitialized(true);
      } catch (err) {
        console.error('Failed to initialize FHEVM client:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };

    initFHE();
  }, []);

  return (
    <FHEContext.Provider value={{ client, initialized, error }}>
      {children}
    </FHEContext.Provider>
  );
};
