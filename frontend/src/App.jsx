import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserHome from './pages/UserHome';
import Dashboard from './pages/Dashboard';
import Visualizer from './pages/Visualizer';
import History from './pages/History';
import SavedAlgorithms from './pages/SavedAlgorithms';

// Route only for guests (redirect to /app if logged in)
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="spinner"></div></div>;
  return isAuthenticated ? <Navigate to="/app" /> : children;
};

// Route only for logged-in users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><div className="spinner"></div></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <Router>
    <Navbar />
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<GuestRoute><Home /></GuestRoute>} />

      {/* Auth pages */}
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* User hub — shown after login */}
      <Route path="/app" element={<ProtectedRoute><UserHome /></ProtectedRoute>} />

      {/* Feature pages — all protected */}
      <Route path="/visualizer" element={<ProtectedRoute><Visualizer /></ProtectedRoute>} />
      <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/history"    element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/saved"      element={<ProtectedRoute><SavedAlgorithms /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;