import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav className="navbar">
      <div className="container navbar-container">

        {/* Brand */}
        <Link to={isAuthenticated ? '/app' : '/'} className="navbar-brand">
          <span className="logo">🔮</span>
          AlgoVision
        </Link>

        {/* Desktop */}
        <div className="navbar-links">
          {isAuthenticated ? (
            /* ── LOGGED IN ── */
            <>
              <Link to="/app" className={location.pathname === '/app' ? 'nav-link active' : 'nav-link'}>
                🏠 Home
              </Link>
              <div className="user-pill">
                <span className="user-avatar">{(user?.username?.[0] || 'U').toUpperCase()}</span>
                <span className="user-name">{user?.firstName || user?.username}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-sm btn-secondary">Logout</button>
            </>
          ) : (
            /* ── GUEST ── */
            <>
              <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
              <Link to="/login"><button className="btn btn-sm btn-ghost">Login</button></Link>
              <Link to="/register"><button className="btn btn-sm btn-primary">Sign Up</button></Link>
            </>
          )}

          {/* Theme toggle — always visible */}
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="mobile-controls">
          <button className="theme-toggle" onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
          <button className="hamburger" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="mobile-menu">
          {isAuthenticated ? (
            <>
              <div className="mobile-user-info">
                <span className="user-avatar">{(user?.username?.[0] || 'U').toUpperCase()}</span>
                <span>{user?.firstName || user?.username}</span>
              </div>
              <Link to="/app"          className="mobile-link" onClick={() => setOpen(false)}>🏠 Home</Link>
              <Link to="/visualizer"   className="mobile-link" onClick={() => setOpen(false)}>🎯 Visualizer</Link>
              <Link to="/dashboard"    className="mobile-link" onClick={() => setOpen(false)}>📊 Dashboard</Link>
              <Link to="/history"      className="mobile-link" onClick={() => setOpen(false)}>📜 History</Link>
              <Link to="/saved"        className="mobile-link" onClick={() => setOpen(false)}>💾 Saved</Link>
              <button onClick={handleLogout} className="mobile-link mobile-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/"         className="mobile-link" onClick={() => setOpen(false)}>Home</Link>
              <Link to="/login"    className="mobile-link" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-link" onClick={() => setOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;