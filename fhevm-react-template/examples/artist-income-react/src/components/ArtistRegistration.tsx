import { useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  contract: ethers.Contract | null;
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
  setStatus: (status: { message: string; type: string }) => void;
}

export default function ArtistRegistration({ contract, isRegistered, setIsRegistered, setStatus }: Props) {
  const [artistId, setArtistId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!artistId.trim()) {
      setStatus({ message: 'Please enter an artist ID', type: 'error' });
      return;
    }

    if (!contract) {
      setStatus({ message: 'Contract not initialized', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.registerArtist(artistId);
      setStatus({ message: 'Registration transaction submitted...', type: 'warning' });
      await tx.wait();
      setStatus({ message: 'Successfully registered as artist!', type: 'success' });
      setIsRegistered(true);
      setArtistId('');
    } catch (error: any) {
      console.error('Registration error:', error);
      setStatus({
        message: `Registration failed: ${error.reason || error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>🎭 Artist Registration</h3>
      <div className="form-group">
        <label htmlFor="artistId">Anonymous Artist ID:</label>
        <input
          type="text"
          id="artistId"
          value={artistId}
          onChange={(e) => setArtistId(e.target.value)}
          placeholder="Enter your unique artist identifier"
          disabled={isRegistered}
        />
      </div>
      <button
        className="btn"
        onClick={handleRegister}
        disabled={loading || isRegistered}
      >
        {loading ? 'Registering...' : isRegistered ? 'Already Registered' : 'Register as Artist'}
      </button>
    </div>
  );
}
