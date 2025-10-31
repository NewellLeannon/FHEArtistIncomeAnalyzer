import { useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  contract: ethers.Contract | null;
  setStatus: (status: { message: string; type: string }) => void;
}

export default function ProfileInfo({ contract, setStatus }: Props) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = async () => {
    if (!contract) {
      setStatus({ message: 'Contract not initialized', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const userProfile = await contract.getMyProfile();
      setProfile(userProfile);
    } catch (error: any) {
      console.error('Profile loading error:', error);
      if (error.message.includes('Not registered artist')) {
        setProfile({ error: 'Please register as an artist first.' });
      } else {
        setStatus({ message: 'Failed to load profile', type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>👤 My Profile</h3>
      {!profile ? (
        <p style={{ opacity: 0.7 }}>Connect wallet and register to view profile information.</p>
      ) : profile.error ? (
        <p style={{ color: '#ffc107' }}>{profile.error}</p>
      ) : (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Artist ID:</strong> {profile.artistId}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Profile Created:</strong> {new Date(profile.profileCreated.toNumber() * 1000).toLocaleDateString()}
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Status:</strong>{' '}
            <span style={{ color: profile.isActive ? '#4caf50' : '#f44336' }}>
              {profile.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      )}
      <button className="btn" onClick={loadProfile} disabled={loading}>
        {loading ? 'Loading...' : 'Load Profile'}
      </button>
    </div>
  );
}
