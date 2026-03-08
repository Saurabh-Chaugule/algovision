import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ email:'', username:'', password:'', confirmPassword:'', firstName:'', lastName:'' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/app');           // ← goes to user hub
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">🔮</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join AlgoVision and start learning</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="label">First Name</label>
                <input type="text" name="firstName" className="input" placeholder="John" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="label">Last Name</label>
                <input type="text" name="lastName" className="input" placeholder="Doe" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Email *</label>
              <input type="email" name="email" className="input" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="label">Username *</label>
              <input type="text" name="username" className="input" placeholder="johndoe" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="label">Password *</label>
              <input type="password" name="password" className="input" placeholder="At least 6 characters" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="label">Confirm Password *</label>
              <input type="password" name="confirmPassword" className="input" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;