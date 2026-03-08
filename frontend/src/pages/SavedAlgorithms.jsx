import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { algorithmAPI } from '../services/api';
import './SavedAlgorithms.css';

const SavedAlgorithms = () => {
  const [savedAlgorithms, setSavedAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedAlgorithms();
  }, [filter]);

  const fetchSavedAlgorithms = async () => {
    setLoading(true);
    try {
      const response = await algorithmAPI.getSaved(filter !== 'all' ? filter : undefined);
      setSavedAlgorithms(response.data.data.savedAlgorithms);
    } catch (error) {
      console.error('Failed to fetch saved algorithms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this saved configuration?')) return;

    try {
      await algorithmAPI.delete(id);
      setSavedAlgorithms(savedAlgorithms.filter(item => item.id !== id));
    } catch (error) {
      alert('Failed to delete configuration');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      description: item.description || ''
    });
  };

  const handleUpdate = async (id) => {
    try {
      await algorithmAPI.update(id, editForm);
      setSavedAlgorithms(savedAlgorithms.map(item =>
        item.id === id ? { ...item, ...editForm } : item
      ));
      setEditingId(null);
    } catch (error) {
      alert('Failed to update configuration');
    }
  };

  const handleLoad = (item) => {
    // Store in sessionStorage and navigate to visualizer
    sessionStorage.setItem('loadedConfiguration', JSON.stringify({
      algorithmType: item.algorithmType,
      configuration: item.configuration
    }));
    navigate('/visualizer');
  };

  if (loading) {
    return (
      <div className="saved-page">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-page">
      <div className="container">
        <div className="saved-header">
          <div>
            <h1>Saved Configurations</h1>
            <p>Manage your saved algorithm configurations</p>
          </div>
        </div>

        <div className="filter-bar card">
          <label className="label">Filter by algorithm:</label>
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: '300px' }}
          >
            <option value="all">All Algorithms</option>
            <option value="bubble-sort">Bubble Sort</option>
            <option value="quick-sort">Quick Sort</option>
            <option value="merge-sort">Merge Sort</option>
            <option value="binary-search">Binary Search</option>
            <option value="linear-search">Linear Search</option>
          </select>
        </div>

        {savedAlgorithms.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">💾</div>
            <h3>No saved configurations</h3>
            <p>Save your favorite algorithm configurations for quick access</p>
          </div>
        ) : (
          <div className="saved-grid">
            {savedAlgorithms.map((item) => (
              <div key={item.id} className="saved-card card">
                {editingId === item.id ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label className="label">Name</label>
                      <input
                        type="text"
                        className="input"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Description</label>
                      <textarea
                        className="input"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows="3"
                      />
                    </div>
                    <div className="edit-actions">
                      <button onClick={() => handleUpdate(item.id)} className="btn btn-sm btn-primary">
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="saved-card-header">
                      <h3>{item.name}</h3>
                      <span className="algorithm-badge">{item.algorithmType}</span>
                    </div>

                    {item.description && (
                      <p className="saved-description">{item.description}</p>
                    )}

                    <div className="saved-config">
                      <strong>Configuration:</strong>
                      <div className="config-display">
                        Array: [{item.configuration.array?.join(', ')}]
                        {item.configuration.target !== undefined && (
                          <div>Target: {item.configuration.target}</div>
                        )}
                      </div>
                    </div>

                    <div className="saved-meta">
                      <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="saved-actions">
                      <button onClick={() => handleLoad(item)} className="btn btn-primary btn-full">
                        Load in Visualizer
                      </button>
                      <div className="action-group">
                        <button onClick={() => handleEdit(item)} className="btn btn-sm btn-secondary">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedAlgorithms;
