import React from 'react';
import './VisualizationCanvas.css';

const VisualizationCanvas = ({ step, algorithmType }) => {
  if (!step) return null;

  const isSearchAlgorithm = algorithmType?.includes('search');
  const array = step.array || [];
  const maxValue = Math.max(...array, 1);

  const getBarColor = (index) => {
    if (step.type === 'complete')                                   return 'var(--success)';
    if (step.type === 'found'    && step.index === index)          return 'var(--success)';
    if (step.type === 'not-found')                                  return 'var(--danger)';
    if (step.type === 'compare'  && step.indices?.includes(index)) return 'var(--warning)';
    if (step.type === 'swap'     && step.indices?.includes(index)) return 'var(--danger)';
    if (step.type === 'sorted'   && index >= step.sortedIndex)     return 'var(--success)';
    if (step.type === 'pivot'    && step.pivotIndex === index)     return 'var(--secondary)';
    if (step.type === 'check'    && (step.index === index || step.indices?.includes(index))) return 'var(--warning)';
    if (step.type === 'search-right' && step.indices?.includes(index)) return '#60a5fa';
    if (step.type === 'search-left'  && step.indices?.includes(index)) return '#f472b6';
    return 'var(--primary)';
  };

  return (
    <div className="visualization-canvas card">
      <div className="canvas-legend">
        <span className="legend-item"><span style={{background:'var(--primary)'}}   className="legend-dot"/>Default</span>
        <span className="legend-item"><span style={{background:'var(--warning)'}}   className="legend-dot"/>Comparing</span>
        <span className="legend-item"><span style={{background:'var(--danger)'}}    className="legend-dot"/>Swapping</span>
        <span className="legend-item"><span style={{background:'var(--success)'}}   className="legend-dot"/>Sorted/Found</span>
        <span className="legend-item"><span style={{background:'var(--secondary)'}} className="legend-dot"/>Pivot</span>
      </div>

      <div className="array-container">
        {array.map((value, index) => (
          <div key={index} className="array-bar-wrapper" style={{ flex: 1 }}>
            <div className="array-value">{value}</div>
            <div
              className="array-bar"
              style={{
                height: `${(value / maxValue) * 280}px`,
                backgroundColor: getBarColor(index),
                transition: 'all 0.25s ease'
              }}
            />
            <div className="array-index">{index}</div>
          </div>
        ))}
      </div>

      {isSearchAlgorithm && step.target !== undefined && (
        <div className="search-info">
          <strong>Target: {step.target}</strong>
          {step.type === 'found'     && <span className="found-badge">✓ Found at index {step.index}</span>}
          {step.type === 'not-found' && <span className="not-found-badge">✗ Not Found</span>}
        </div>
      )}

      {step.left && step.right && (
        <div className="merge-sort-info">
          <div className="split-arrays">
            <div className="split-array"><strong>Left:</strong> [{step.left.join(', ')}]</div>
            <div className="split-array"><strong>Right:</strong> [{step.right.join(', ')}]</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizationCanvas;