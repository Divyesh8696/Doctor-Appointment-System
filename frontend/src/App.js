import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import ProviderServices from './pages/ProviderServices';
import ProviderAppointments from './pages/ProviderAppointments';
import AdminUsers from './pages/AdminUsers';
import AdminStats from './pages/AdminStats';
import AdminAuditLogs from './pages/AdminAuditLogs';
import './App.css';
import './pages/Home.css'; // Ensure CSS is imported

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="App">
      {!isHome && <Navbar />}
      <div className={!isHome ? 'main-content' : 'home-layout'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/services" element={<Services />} />

          <Route
            path="/book-appointment/:serviceId"
            element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-services"
            element={
              <ProtectedRoute allowedRoles={['provider', 'admin']}>
                <ProviderServices />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute allowedRoles={['provider', 'admin']}>
                <ProviderAppointments />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAuditLogs />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
