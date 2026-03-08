import React, { useState, useEffect } from 'react';
import { algorithmAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import VisualizationCanvas from '../components/VisualizationCanvas';
import './Visualizer.css';

const Visualizer = () => {
  const { isAuthenticated } = useAuth();
  const [algorithms,       setAlgorithms]       = useState([]);
  const [selectedAlgorithm,setSelectedAlgorithm] = useState('bubble-sort');
  const [inputArray,       setInputArray]        = useState('5, 2, 8, 1, 9, 3, 7');
  const [searchTarget,     setSearchTarget]      = useState('7');
  const [result,           setResult]            = useState(null);
  const [currentStep,      setCurrentStep]       = useState(0);
  const [isPlaying,        setIsPlaying]         = useState(false);
  const [playbackSpeed,    setPlaybackSpeed]      = useState(500);
  const [loading,          setLoading]           = useState(false);
  const [error,            setError]             = useState('');
  const [saveName,         setSaveName]          = useState('');
  const [saveDescription,  setSaveDescription]   = useState('');
  const [showSaveModal,    setShowSaveModal]      = useState(false);
  const [saveSuccess,      setSaveSuccess]       = useState(false);

  useEffect(() => { fetchAlgorithms(); }, []);

  // Load saved config from sessionStorage (when coming from Saved page)
  useEffect(() => {
    const stored = sessionStorage.getItem('loadedConfiguration');
    if (stored) {
      try {
        const { algorithmType, configuration } = JSON.parse(stored);
        setSelectedAlgorithm(algorithmType);
        if (configuration.array) setInputArray(configuration.array.join(', '));
        if (configuration.target !== undefined) setSearchTarget(String(configuration.target));
      } catch {}
      sessionStorage.removeItem('loadedConfiguration');
    }
  }, []);

  useEffect(() => {
    if (isPlaying && result && currentStep < result.steps.length - 1) {
      const timer = setTimeout(() => setCurrentStep(s => s + 1), playbackSpeed);
      return () => clearTimeout(timer);
    } else if (currentStep >= (result?.steps.length ?? 1) - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, result, playbackSpeed]);

  const fetchAlgorithms = async () => {
    try {
      const response = await algorithmAPI.getAll();
      setAlgorithms(response.data.data.algorithms);
    } catch (err) { console.error('Failed to fetch algorithms:', err); }
  };

  const handleExecute = async () => {
    setError(''); setLoading(true); setResult(null); setCurrentStep(0); setIsPlaying(false);
    try {
      const array = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      if (!array.length) { setError('Please enter valid numbers separated by commas'); return; }

      const input = { array, ...(isSearchAlgorithm && { target: parseInt(searchTarget) }) };
      const response = await algorithmAPI.execute({ algorithmType: selectedAlgorithm, input });
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to execute algorithm');
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!isAuthenticated) { alert('Please login to save configurations'); return; }
    try {
      const array = inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
      await algorithmAPI.saveConfig({
        algorithmType: selectedAlgorithm,
        name: saveName,
        description: saveDescription,
        configuration: { array, ...(isSearchAlgorithm && { target: parseInt(searchTarget) }) }
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setShowSaveModal(false); setSaveName(''); setSaveDescription(''); setSaveSuccess(false);
      }, 1200);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save configuration');
    }
  };

  const generateRandomArray = () => {
    const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 99) + 1);
    setInputArray(arr.join(', '));
  };

  const togglePlayPause = () => {
    if (currentStep >= (result?.steps.length ?? 1) - 1) setCurrentStep(0);
    setIsPlaying(p => !p);
  };

  const currentAlgorithm = algorithms.find(a => a.type === selectedAlgorithm);
  const isSearchAlgorithm = selectedAlgorithm.includes('search');

  return (
    <div className="visualizer-page">
      <div className="container">
        <div className="visualizer-header">
          <h1>Algorithm Visualizer</h1>
          <p>Watch algorithms execute step-by-step</p>
        </div>

        <div className="visualizer-layout">
          {/* ── Controls ── */}
          <div className="controls-panel card">
            <h3>Configuration</h3>

            <div className="form-group">
              <label className="label">Select Algorithm</label>
              <select className="input" value={selectedAlgorithm} onChange={e => { setSelectedAlgorithm(e.target.value); setResult(null); }}>
                {algorithms.map(a => (
                  <option key={a.type} value={a.type}>{a.name} ({a.category})</option>
                ))}
              </select>
            </div>

            {currentAlgorithm && (
              <div className="algorithm-info">
                <p>{currentAlgorithm.description}</p>
                <div className="complexity-info">
                  <div><strong>Time:</strong> {currentAlgorithm.timeComplexity?.average || currentAlgorithm.timeComplexity?.worst}</div>
                  <div><strong>Space:</strong> {currentAlgorithm.spaceComplexity}</div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="label">Input Array</label>
              <input type="text" className="input" placeholder="e.g., 5, 2, 8, 1, 9" value={inputArray} onChange={e => setInputArray(e.target.value)} />
              <button onClick={generateRandomArray} className="btn btn-sm btn-secondary" style={{ marginTop:'8px' }}>Generate Random</button>
            </div>

            {isSearchAlgorithm && (
              <div className="form-group">
                <label className="label">Search Target</label>
                <input type="number" className="input" placeholder="Number to find" value={searchTarget} onChange={e => setSearchTarget(e.target.value)} />
              </div>
            )}

            {error && <div className="error">{error}</div>}

            <div className="action-buttons">
              <button onClick={handleExecute} className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Executing...' : '▶ Execute Algorithm'}
              </button>
              {isAuthenticated && result && (
                <button onClick={() => setShowSaveModal(true)} className="btn btn-secondary btn-full">
                  💾 Save Configuration
                </button>
              )}
            </div>

            {result && (
              <div className="execution-stats">
                <h4>Execution Stats</h4>
                <div className="stat-item"><span>Execution Time:</span><strong>{result.executionTime}ms</strong></div>
                {result.comparisons > 0 && <div className="stat-item"><span>Comparisons:</span><strong>{result.comparisons}</strong></div>}
                {result.swaps > 0       && <div className="stat-item"><span>Swaps:</span><strong>{result.swaps}</strong></div>}
                <div className="stat-item"><span>Total Steps:</span><strong>{result.steps.length}</strong></div>
                <div className="stat-item"><span>Time Complexity:</span><strong>{result.timeComplexity}</strong></div>
                <div className="stat-item"><span>Space Complexity:</span><strong>{result.spaceComplexity}</strong></div>
              </div>
            )}
          </div>

          {/* ── Visualization ── */}
          <div className="visualization-panel">
            {result ? (
              <>
                <VisualizationCanvas step={result.steps[currentStep]} algorithmType={selectedAlgorithm} />

                <div className="playback-controls card">
                  <div className="progress-bar">
                    <div className="progress-info">
                      <span>Step {currentStep + 1} of {result.steps.length}</span>
                      <span>{Math.round((currentStep / Math.max(result.steps.length - 1, 1)) * 100)}%</span>
                    </div>
                    <input type="range" className="slider" min="0" max={result.steps.length - 1} value={currentStep}
                      onChange={e => { setCurrentStep(parseInt(e.target.value)); setIsPlaying(false); }} />
                  </div>

                  <div className="control-buttons">
                    <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="btn btn-sm btn-secondary">⏮ Reset</button>
                    <button onClick={() => { setCurrentStep(s => Math.max(0, s - 1)); setIsPlaying(false); }} className="btn btn-sm btn-secondary" disabled={currentStep === 0}>⏪ Back</button>
                    <button onClick={togglePlayPause} className="btn btn-sm btn-primary">{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
                    <button onClick={() => { setCurrentStep(s => Math.min(result.steps.length - 1, s + 1)); setIsPlaying(false); }} className="btn btn-sm btn-secondary" disabled={currentStep >= result.steps.length - 1}>⏩ Forward</button>
                  </div>

                  <div className="speed-control">
                    <label>Speed: {(1000 / playbackSpeed).toFixed(1)}x</label>
                    <input type="range" className="slider" min="100" max="2000" step="100" value={playbackSpeed}
                      onChange={e => setPlaybackSpeed(parseInt(e.target.value))} />
                  </div>

                  <div className="step-message">{result.steps[currentStep]?.message}</div>
                </div>
              </>
            ) : (
              <div className="empty-state card">
                <div className="empty-icon">🎯</div>
                <h3>Ready to visualize!</h3>
                <p>Configure your algorithm and click Execute to see the magic happen.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Save Modal (dark mode fixed) ── */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>💾 Save Configuration</h3>

            {saveSuccess ? (
              <div style={{ textAlign:'center', padding:'20px 0', color:'var(--success)', fontSize:'18px', fontWeight:600 }}>
                ✅ Saved successfully!
              </div>
            ) : (
              <>
                <div className="form-group" style={{ marginBottom:'16px' }}>
                  <label className="label">Name *</label>
                  <input type="text" className="input" placeholder="e.g. My Bubble Sort test" value={saveName} onChange={e => setSaveName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="label">Description (optional)</label>
                  <textarea className="input" placeholder="Describe this configuration..." value={saveDescription} onChange={e => setSaveDescription(e.target.value)} rows="3" style={{ resize:'vertical' }} />
                </div>
                <div className="modal-actions">
                  <button onClick={handleSave} className="btn btn-primary" disabled={!saveName.trim()}>Save</button>
                  <button onClick={() => setShowSaveModal(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualizer;