import { useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  contract: ethers.Contract | null;
  setStatus: (status: { message: string; type: string }) => void;
}

export default function CreativeAnalytics({ contract, setStatus }: Props) {
  const [analytics, setAnalytics] = useState({
    digitalArt: '',
    physicalArt: '',
    nftSales: '',
    licensing: '',
    workshops: '',
    commissions: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!contract) {
      setStatus({ message: 'Contract not initialized', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.submitCreativeAnalytics(
        parseInt(analytics.digitalArt || '0'),
        parseInt(analytics.physicalArt || '0'),
        parseInt(analytics.nftSales || '0'),
        parseInt(analytics.licensing || '0'),
        parseInt(analytics.workshops || '0'),
        parseInt(analytics.commissions || '0')
      );
      setStatus({ message: 'Analytics transaction submitted...', type: 'warning' });
      await tx.wait();
      setStatus({ message: 'Creative analytics submitted successfully!', type: 'success' });
      setAnalytics({
        digitalArt: '',
        physicalArt: '',
        nftSales: '',
        licensing: '',
        workshops: '',
        commissions: ''
      });
    } catch (error: any) {
      console.error('Analytics submission error:', error);
      setStatus({
        message: `Failed to submit analytics: ${error.reason || error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>🎨 Creative Analytics</h3>
      <div className="income-categories">
        <div className="category-input">
          <label>Digital Art Sales:</label>
          <input
            type="number"
            value={analytics.digitalArt}
            onChange={(e) => setAnalytics({ ...analytics, digitalArt: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="category-input">
          <label>Physical Art Sales:</label>
          <input
            type="number"
            value={analytics.physicalArt}
            onChange={(e) => setAnalytics({ ...analytics, physicalArt: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="category-input">
          <label>NFT Sales:</label>
          <input
            type="number"
            value={analytics.nftSales}
            onChange={(e) => setAnalytics({ ...analytics, nftSales: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="category-input">
          <label>Licensing Revenue:</label>
          <input
            type="number"
            value={analytics.licensing}
            onChange={(e) => setAnalytics({ ...analytics, licensing: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="category-input">
          <label>Workshop Earnings:</label>
          <input
            type="number"
            value={analytics.workshops}
            onChange={(e) => setAnalytics({ ...analytics, workshops: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="category-input">
          <label>Custom Commissions:</label>
          <input
            type="number"
            value={analytics.commissions}
            onChange={(e) => setAnalytics({ ...analytics, commissions: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>
      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting Analytics...' : 'Submit Analytics'}
      </button>
    </div>
  );
}
