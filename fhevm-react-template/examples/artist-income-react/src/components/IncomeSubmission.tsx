import { useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  contract: ethers.Contract | null;
  setStatus: (status: { message: string; type: string }) => void;
}

export default function IncomeSubmission({ contract, setStatus }: Props) {
  const [formData, setFormData] = useState({
    totalIncome: '',
    artworksSold: '',
    averagePrice: '',
    royaltyEarnings: '',
    commissionEarnings: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.totalIncome || !formData.artworksSold || !formData.averagePrice ||
        !formData.royaltyEarnings || !formData.commissionEarnings) {
      setStatus({ message: 'Please fill in all income fields', type: 'error' });
      return;
    }

    if (!contract) {
      setStatus({ message: 'Contract not initialized', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.submitIncomeData(
        ethers.BigNumber.from(formData.totalIncome),
        parseInt(formData.artworksSold),
        parseInt(formData.averagePrice),
        parseInt(formData.royaltyEarnings),
        parseInt(formData.commissionEarnings)
      );
      setStatus({ message: 'Income data transaction submitted...', type: 'warning' });
      await tx.wait();
      setStatus({ message: 'Income data submitted successfully!', type: 'success' });
      setFormData({
        totalIncome: '',
        artworksSold: '',
        averagePrice: '',
        royaltyEarnings: '',
        commissionEarnings: ''
      });
    } catch (error: any) {
      console.error('Income submission error:', error);
      setStatus({
        message: `Failed to submit income data: ${error.reason || error.message}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>💰 Income Data Submission</h3>
      <div className="form-group">
        <label htmlFor="totalIncome">Total Income (USD):</label>
        <input
          type="number"
          id="totalIncome"
          value={formData.totalIncome}
          onChange={(e) => setFormData({ ...formData, totalIncome: e.target.value })}
          placeholder="Your total creative income"
        />
      </div>
      <div className="form-group">
        <label htmlFor="artworksSold">Artworks Sold:</label>
        <input
          type="number"
          id="artworksSold"
          value={formData.artworksSold}
          onChange={(e) => setFormData({ ...formData, artworksSold: e.target.value })}
          placeholder="Number of artworks sold"
        />
      </div>
      <div className="form-group">
        <label htmlFor="averagePrice">Average Artwork Price:</label>
        <input
          type="number"
          id="averagePrice"
          value={formData.averagePrice}
          onChange={(e) => setFormData({ ...formData, averagePrice: e.target.value })}
          placeholder="Average price per artwork"
        />
      </div>
      <div className="form-group">
        <label htmlFor="royaltyEarnings">Royalty Earnings:</label>
        <input
          type="number"
          id="royaltyEarnings"
          value={formData.royaltyEarnings}
          onChange={(e) => setFormData({ ...formData, royaltyEarnings: e.target.value })}
          placeholder="Royalty income"
        />
      </div>
      <div className="form-group">
        <label htmlFor="commissionEarnings">Commission Earnings:</label>
        <input
          type="number"
          id="commissionEarnings"
          value={formData.commissionEarnings}
          onChange={(e) => setFormData({ ...formData, commissionEarnings: e.target.value })}
          placeholder="Commission income"
        />
      </div>
      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? 'Encrypting & Submitting...' : 'Submit Private Data'}
      </button>
    </div>
  );
}
