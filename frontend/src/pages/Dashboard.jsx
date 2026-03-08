import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { historyAPI, algorithmAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [savedAlgorithms, setSavedAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes, savedRes] = await Promise.all([
        historyAPI.getStats(),
        historyAPI.getAll({ limit: 5 }),
        algorithmAPI.getSaved()
      ]);

      setStats(statsRes.data.data);
      setRecentHistory(historyRes.data.data.history);
      setSavedAlgorithms(savedRes.data.data.savedAlgorithms.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.firstName || user?.username}! 👋</h1>
            <p>Here's your learning progress and activity</p>
          </div>
          <Link to="/visualizer">
            <button className="btn btn-primary">Start Visualizing</button>
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.totalExecutions || 0}</div>
              <div className="stat-label">Total Executions</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats?.algorithmCounts?.length || 0}</div>
              <div className="stat-label">Algorithms Tried</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💾</div>
            <div className="stat-content">
              <div className="stat-value">{savedAlgorithms.length}</div>
              <div className="stat-label">Saved Configs</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-value">
                {stats?.recentActivity?.length ? 'Active' : 'Start'}
              </div>
              <div className="stat-label">Status</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section card">
            <div className="section-header">
              <h3>Recent Activity</h3>
              <Link to="/history" className="view-all">View All →</Link>
            </div>

            {recentHistory.length > 0 ? (
              <div className="activity-list">
                {recentHistory.map((item) => (
                  <div key={item.id} className="activity-item">
                    <div className="activity-info">
                      <div className="activity-name">{item.algorithmName}</div>
                      <div className="activity-meta">
                        {new Date(item.createdAt).toLocaleDateString()} • {item.executionTime}ms
                      </div>
                    </div>
                    <div className="activity-stats">
                      {item.comparisons && (
                        <span className="stat-badge">{item.comparisons} comparisons</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-message">
                No activity yet. Start visualizing algorithms!
              </div>
            )}
          </div>

          <div className="dashboard-section card">
            <div className="section-header">
              <h3>Saved Configurations</h3>
              <Link to="/saved" className="view-all">View All →</Link>
            </div>

            {savedAlgorithms.length > 0 ? (
              <div className="saved-list">
                {savedAlgorithms.map((item) => (
                  <div key={item.id} className="saved-item">
                    <div className="saved-info">
                      <div className="saved-name">{item.name}</div>
                      <div className="saved-type">{item.algorithmType}</div>
                    </div>
                    <div className="saved-date">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-message">
                No saved configurations yet.
              </div>
            )}
          </div>
        </div>

        {stats?.algorithmCounts && stats.algorithmCounts.length > 0 && (
          <div className="card">
            <h3>Algorithm Usage</h3>
            <div className="usage-chart">
              {stats.algorithmCounts.map((algo) => (
                <div key={algo.algorithmType} className="usage-item">
                  <div className="usage-label">{algo.algorithmType}</div>
                  <div className="usage-bar-container">
                    <div
                      className="usage-bar"
                      style={{
                        width: `${(algo._count.id / stats.totalExecutions) * 100}%`
                      }}
                    />
                  </div>
                  <div className="usage-count">{algo._count.id}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
