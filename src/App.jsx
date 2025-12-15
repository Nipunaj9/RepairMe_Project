import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DriverDashboard from './pages/DriverDashboard';
import GarageDashboard from './pages/GarageDashboard';
import Home from './pages/Home';

function ProtectedRoute({ children, requiredRole }) {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'driver' ? '/driver' : '/garage'} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!user ? <Home /> : <Navigate to={userRole === 'driver' ? '/driver' : '/garage'} replace />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to={userRole === 'driver' ? '/driver' : '/garage'} replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={userRole === 'driver' ? '/driver' : '/garage'} replace />} />
      <Route
        path="/driver"
        element={
          <ProtectedRoute requiredRole="driver">
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/garage"
        element={
          <ProtectedRoute requiredRole="garage">
            <GarageDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;


