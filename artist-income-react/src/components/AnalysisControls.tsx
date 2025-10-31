import { useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  contract: ethers.Contract | null;
  setStatus: (status: { message: string; type: string }) => void;
}

export default function AnalysisControls({ contract, setStatus }: Props) {
  const [analyzing, setAnalyzing] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState('');

  const handleGenerate = async () => {
    if (!contract) {
      setStatus({ message: 'Contract not initialized', type: 'error' });
      return;
    }

    try {
      setAnalyzing(true);
      const tx = await contract.generateIncomeAnalysis();
      setStatus({ message: 'Analysis generation transaction submitted...', type: 'warning' });
      await tx.wait();
      setStatus({ message: 'Income analysis generated!', type: 'success' });
      setAnalysisStatus('Analysis completed - ready to finalize report');
    } catch (error: any) {
      console.error('Analysis generation error:', error);
      setStatus({
        message: `Failed to generate analysis: ${error.reason || error.message}`,
        type: 'error'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFinalize = async () => {
    if (!contract) {
      setStatus({ message: 'Contract not initialized', type: 'error' });
      return;
    }

    try {
      setFinalizing(true);
      const tx = await contract.finalizeReport();
      setStatus({ message: 'Report finalization transaction submitted...', type: 'warning' });
      await tx.wait();
      setStatus({ message: 'Report finalized successfully!', type: 'success' });
      setAnalysisStatus('Report has been finalized and published');
    } catch (error: any) {
      console.error('Report finalization error:', error);
      setStatus({
        message: `Failed to finalize report: ${error.reason || error.message}`,
        type: 'error'
      });
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <div className="card">
      <h3>🔬 Income Analysis</h3>
      <p style={{ marginBottom: '20px', opacity: 0.8 }}>
        Generate confidential market insights from encrypted artist data.
      </p>
      <button className="btn" onClick={handleGenerate} disabled={analyzing}>
        {analyzing ? 'Generating Analysis...' : 'Generate Analysis'}
      </button>
      <button
        className="btn"
        onClick={handleFinalize}
        disabled={finalizing}
        style={{ marginTop: '10px' }}
      >
        {finalizing ? 'Finalizing Report...' : 'Finalize Report'}
      </button>
      {analysisStatus && (
        <div style={{ marginTop: '20px' }}>
          <div className="status success">{analysisStatus}</div>
        </div>
      )}
    </div>
  );
}
