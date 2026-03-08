import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { historyAPI, algorithmAPI } from '../services/api';
import './UserHome.css';

const StatCard = ({ value, label, color }) => (
  <div className="qs-item" style={{ '--sc': color }}>
    <strong style={{ color }}>{value}</strong>
    <span>{label}</span>
  </div>
);

const FeatureCard = ({ icon, title, desc, color, onClick, badge }) => (
  <div className="feature-hub-card" style={{ '--accent': color }} onClick={onClick}>
    <div className="fhc-icon" style={{ background: color }}>{icon}</div>
    <div className="fhc-body">
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
    {badge && <span className="fhc-badge">{badge}</span>}
    <div className="fhc-arrow">→</div>
  </div>
);

const UserHome = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [stats,   setStats]   = useState({ totalExecutions: 0, algorithmCounts: [], recentActivity: [] });
  const [saved,   setSaved]   = useState([]);
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [sRes, hRes, alRes] = await Promise.all([
        historyAPI.getStats(),
        historyAPI.getAll({ limit: 3 }),
        algorithmAPI.getSaved(),
      ]);
      setStats(sRes.data.data);
      setRecent(hRes.data.data.history || []);
      setSaved((alRes.data.data.savedAlgorithms || []).slice(0, 3));
    } catch (e) {
      console.error('UserHome load error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Refresh stats whenever user comes back to this tab/window
    const onFocus = () => loadData();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) loadData();
    });
    return () => window.removeEventListener('focus', onFocus);
  }, [loadData]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Unique algorithms used = distinct algorithmType entries in history
  const uniqueAlgos = stats.algorithmCounts?.length ?? 0;
  const totalRuns   = stats.totalExecutions ?? 0;

  return (
    <div className="userhome-page">
      <div className="container">

        {/* ── Greeting + Stats ── */}
        <div className="uh-greeting">
          <div>
            <h1>{greeting()}, {user?.firstName || user?.username}! 👋</h1>
            <p>What would you like to do today?</p>
          </div>

          <div className="uh-quick-stats">
            <StatCard value={totalRuns}   label="Executions" color="#6366f1" />
            <StatCard value={uniqueAlgos} label="Algorithms"  color="#8b5cf6" />
            <StatCard value={saved.length || '—'} label="Saved" color="#10b981" />
          </div>
        </div>

        {/* ── Feature cards ── */}
        <div className="uh-cards-grid">
          <FeatureCard
            icon="🎯" title="Algorithm Visualizer"
            desc="Run and visualize 12+ algorithms step-by-step with full playback controls"
            color="#6366f1" onClick={() => navigate('/visualizer')}
            badge="12 Algorithms"
          />
          <FeatureCard
            icon="📊" title="My Dashboard"
            desc="View your stats, algorithm usage charts and recent activity"
            color="#8b5cf6" onClick={() => navigate('/dashboard')}
            badge={totalRuns > 0 ? `${totalRuns} runs` : 'No runs yet'}
          />
          <FeatureCard
            icon="📜" title="Execution History"
            desc="Browse every algorithm you've run with full metrics and complexity analysis"
            color="#06b6d4" onClick={() => navigate('/history')}
            badge={totalRuns > 0 ? `${totalRuns} entries` : 'Empty'}
          />
          <FeatureCard
            icon="💾" title="Saved Configurations"
            desc="Load your saved algorithm setups and run them instantly"
            color="#10b981" onClick={() => navigate('/saved')}
            badge={saved.length > 0 ? `${saved.length} saved` : 'None yet'}
          />
        </div>

        {/* ── Recent + Saved ── */}
        {!loading && (
          <div className="uh-bottom-grid">

            <div className="uh-section card">
              <div className="uh-section-header">
                <h3>📜 Recent Activity</h3>
                <button onClick={() => navigate('/history')} className="view-all-btn">View All →</button>
              </div>
              {recent.length === 0 ? (
                <div className="uh-empty">
                  <span>🎯</span>
                  <p>No activity yet — run your first algorithm!</p>
                  <button onClick={() => navigate('/visualizer')} className="btn btn-primary btn-sm">Open Visualizer</button>
                </div>
              ) : (
                <div className="uh-list">
                  {recent.map(item => (
                    <div key={item.id} className="uh-list-item">
                      <div className="uh-li-left">
                        <span className="uh-li-name">{item.algorithmName}</span>
                        <span className="uh-li-meta">
                          {new Date(item.createdAt).toLocaleDateString()} · {item.executionTime}ms
                          {item.comparisons > 0 && ` · ${item.comparisons} comparisons`}
                        </span>
                      </div>
                      <span className="uh-li-badge">{item.timeComplexity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="uh-section card">
              <div className="uh-section-header">
                <h3>💾 Saved Configs</h3>
                <button onClick={() => navigate('/saved')} className="view-all-btn">View All →</button>
              </div>
              {saved.length === 0 ? (
                <div className="uh-empty">
                  <span>💾</span>
                  <p>No saved configs yet — run an algorithm and save it!</p>
                  <button onClick={() => navigate('/visualizer')} className="btn btn-primary btn-sm">Open Visualizer</button>
                </div>
              ) : (
                <div className="uh-list">
                  {saved.map(item => (
                    <div key={item.id} className="uh-list-item">
                      <div className="uh-li-left">
                        <span className="uh-li-name">{item.name}</span>
                        <span className="uh-li-meta">{item.algorithmType}</span>
                      </div>
                      <span className="uh-li-badge">{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Usage breakdown */}
        {!loading && stats.algorithmCounts?.length > 0 && (
          <div className="uh-usage card">
            <h3>📊 Algorithm Usage Breakdown</h3>
            <div className="usage-bars">
              {stats.algorithmCounts.slice(0, 6).map(a => {
                const pct = Math.round((a._count.id / totalRuns) * 100);
                return (
                  <div key={a.algorithmType} className="usage-row">
                    <span className="usage-name">{a.algorithmType.replace(/-/g, ' ')}</span>
                    <div className="usage-bar-wrap">
                      <div className="usage-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="usage-count">{a._count.id}x</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserHome;