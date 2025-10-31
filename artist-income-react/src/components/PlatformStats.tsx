import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface Props {
  contract: ethers.Contract | null;
}

export default function PlatformStats({ contract }: Props) {
  const [stats, setStats] = useState({
    totalArtists: '-',
    currentSession: '-',
    lastReport: '-'
  });

  const loadStats = async () => {
    if (!contract) return;

    try {
      const platformStats = await contract.getPlatformStats();
      setStats({
        totalArtists: platformStats.totalArtistsCount.toString(),
        currentSession: platformStats.currentSessionId.toString(),
        lastReport: platformStats.lastReportTimestamp.toString() !== '0'
          ? new Date(platformStats.lastReportTimestamp.toNumber() * 1000).toLocaleDateString()
          : 'None'
      });
    } catch (error) {
      console.error('Stats loading error:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, [contract]);

  return (
    <div className="card">
      <h3>📊 Platform Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.totalArtists}</div>
          <div className="stat-label">Registered Artists</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.currentSession}</div>
          <div className="stat-label">Analysis Session</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.lastReport}</div>
          <div className="stat-label">Last Report</div>
        </div>
      </div>
      <button className="btn" onClick={loadStats}>Refresh Statistics</button>
    </div>
  );
}
