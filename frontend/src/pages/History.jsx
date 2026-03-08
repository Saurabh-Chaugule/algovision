import React, { useState, useEffect } from 'react';
import { historyAPI } from '../services/api';
import './History.css';

const ALL_ALGO_OPTIONS = [
  { value: 'all',                   label: 'All Algorithms' },
  { value: 'bubble-sort',           label: 'Bubble Sort' },
  { value: 'insertion-sort',        label: 'Insertion Sort' },
  { value: 'selection-sort',        label: 'Selection Sort' },
  { value: 'quick-sort',            label: 'Quick Sort' },
  { value: 'merge-sort',            label: 'Merge Sort' },
  { value: 'heap-sort',             label: 'Heap Sort' },
  { value: 'shell-sort',            label: 'Shell Sort' },
  { value: 'counting-sort',         label: 'Counting Sort' },
  { value: 'binary-search',         label: 'Binary Search' },
  { value: 'linear-search',         label: 'Linear Search' },
  { value: 'jump-search',           label: 'Jump Search' },
  { value: 'interpolation-search',  label: 'Interpolation Search' },
];

const History = () => {
  const [history,      setHistory]      = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState('all');
  const [pagination,   setPagination]   = useState({ page:1, pages:1, total:0 });
  const [clearMsg,     setClearMsg]     = useState('');

  useEffect(() => { fetchHistory(1); }, [filter]);

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter !== 'all') params.algorithmType = filter;
      const res = await historyAPI.getAll(params);
      setHistory(res.data.data.history || []);
      setPagination(res.data.data.pagination || { page:1, pages:1, total:0 });
    } catch (err) {
      console.error('History fetch error:', err);
      setHistory([]);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this history entry?')) return;
    try {
      await historyAPI.delete(id);
      setHistory(h => h.filter(i => i.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch { alert('Failed to delete.'); }
  };

  const handleClearAll = async () => {
    const label = filter !== 'all'
      ? ALL_ALGO_OPTIONS.find(o => o.value === filter)?.label
      : 'ALL';
    if (!confirm(`Clear ${label} history? This cannot be undone.`)) return;
    try {
      await historyAPI.clear(filter !== 'all' ? filter : undefined);
      setHistory([]); setSelectedItem(null);
      setClearMsg('History cleared!');
      setTimeout(() => setClearMsg(''), 2500);
    } catch { alert('Failed to clear history.'); }
  };

  const viewDetails = async (item) => {
    if (selectedItem?.id === item.id) { setSelectedItem(null); return; }
    try {
      const res = await historyAPI.getById(item.id);
      setSelectedItem(res.data.data.historyItem);
    } catch { setSelectedItem(item); } // fallback to list data
  };

  if (loading) return (
    <div className="history-page">
      <div className="container" style={{ display:'flex', justifyContent:'center', padding:'80px' }}>
        <div className="spinner"></div>
      </div>
    </div>
  );

  return (
    <div className="history-page">
      <div className="container">

        <div className="history-header">
          <div>
            <h1>Execution History</h1>
            <p>Every algorithm you've run — {pagination.total} total entries</p>
          </div>
          {history.length > 0 && (
            <button onClick={handleClearAll} className="btn btn-danger">🗑 Clear {filter !== 'all' ? 'Filtered' : 'All'}</button>
          )}
        </div>

        {clearMsg && (
          <div style={{ padding:'12px 16px', background:'var(--bg-secondary)', border:'1px solid var(--card-border)', borderRadius:'8px', marginBottom:'16px', color:'var(--success)', fontWeight:600 }}>
            ✅ {clearMsg}
          </div>
        )}

        {/* Filter */}
        <div className="filter-bar card">
          <label className="label" style={{ marginBottom:0 }}>Filter by algorithm:</label>
          <select className="input" value={filter} onChange={e => { setFilter(e.target.value); setSelectedItem(null); }} style={{ maxWidth:'280px' }}>
            {ALL_ALGO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="btn btn-sm btn-ghost">✕ Clear filter</button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📜</div>
            <h3>No history yet</h3>
            <p>{filter !== 'all' ? `No executions found for "${ALL_ALGO_OPTIONS.find(o=>o.value===filter)?.label}"` : 'Run an algorithm in the Visualizer to see your history here'}</p>
          </div>
        ) : (
          <div className="history-layout">

            {/* List */}
            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className={`history-item card ${selectedItem?.id === item.id ? 'active' : ''}`} onClick={() => viewDetails(item)}>
                  <div className="history-item-header">
                    <div className="history-item-title">{item.algorithmName}</div>
                    <button onClick={e => { e.stopPropagation(); handleDelete(item.id); }} className="btn btn-sm btn-danger">Delete</button>
                  </div>
                  <div className="history-item-stats">
                    <span>⏱ {item.executionTime}ms</span>
                    {item.comparisons > 0 && <span>🔄 {item.comparisons} comparisons</span>}
                    {item.swaps > 0        && <span>↔ {item.swaps} swaps</span>}
                    <span>📋 {item.iterations} steps</span>
                  </div>
                  <div className="history-item-meta">
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                    <span className="complexity-badge">{item.timeComplexity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detail panel */}
            {selectedItem && (
              <div className="history-details card">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
                  <h3>Execution Details</h3>
                  <button onClick={() => setSelectedItem(null)} className="btn btn-sm btn-ghost">✕</button>
                </div>

                <div className="detail-section">
                  <h4>Algorithm</h4>
                  <p>{selectedItem.algorithmName}</p>
                </div>

                <div className="detail-section">
                  <h4>Input Data</h4>
                  <div className="input-display">
                    [{selectedItem.inputData?.array?.join(', ')}]
                    {selectedItem.inputData?.target !== undefined && <div style={{ marginTop:'4px' }}>Target: <strong>{selectedItem.inputData.target}</strong></div>}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Performance</h4>
                  <div className="metrics-grid">
                    <div className="metric-item"><span>Time</span><strong>{selectedItem.executionTime}ms</strong></div>
                    {selectedItem.comparisons > 0 && <div className="metric-item"><span>Comparisons</span><strong>{selectedItem.comparisons}</strong></div>}
                    {selectedItem.swaps > 0        && <div className="metric-item"><span>Swaps</span><strong>{selectedItem.swaps}</strong></div>}
                    <div className="metric-item"><span>Steps</span><strong>{selectedItem.iterations}</strong></div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Complexity</h4>
                  <div className="complexity-grid">
                    <div className="complexity-item"><span>Time</span><code>{selectedItem.timeComplexity}</code></div>
                    <div className="complexity-item"><span>Space</span><code>{selectedItem.spaceComplexity}</code></div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Date</h4>
                  <p style={{ color:'var(--text-secondary)', fontSize:'13px' }}>{new Date(selectedItem.createdAt).toLocaleString()}</p>
                </div>
              </div>
            )}

          </div>
        )}

        {pagination.pages > 1 && (
          <div className="pagination">
            <button onClick={() => fetchHistory(pagination.page - 1)} disabled={pagination.page === 1} className="btn btn-sm btn-secondary">← Previous</button>
            <span style={{ color:'var(--text-secondary)', fontSize:'14px' }}>Page {pagination.page} of {pagination.pages}</span>
            <button onClick={() => fetchHistory(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="btn btn-sm btn-secondary">Next →</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default History;