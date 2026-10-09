import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import WaterMascotNotification from './components/WaterMascotNotification';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResidentDashboard from './pages/ResidentDashboard';
import MaintenanceStaffDashboard from './pages/MaintenanceStaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import WaterAnalyticsPage from './pages/WaterAnalyticsPage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import ComplaintsListPage from './pages/ComplaintsListPage';
import WaterAvailabilityPage from './pages/WaterAvailabilityPage';
import AILeakDetectionPage from './pages/AILeakDetectionPage';
import AIDemandPredictionPage from './pages/AIDemandPredictionPage';
import CampusMapPage from './pages/CampusMapPage';
import ReportsPage from './pages/ReportsPage';
import AIRecommendationsPage from './pages/AIRecommendationsPage';
import UserDirectoryPage from './pages/UserDirectoryPage';

// Protected Route Wrapper
const ProtectedLayout = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs font-semibold text-sky-600">
        Loading HydroSense Engine...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's rightful dashboard
    const target =
      user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'staff'
        ? '/staff/dashboard'
        : '/resident/dashboard';
    return <Navigate to={target} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

import { ClerkProvider } from '@clerk/clerk-react';
import ClerkAuthSync from './components/ClerkAuthSync';

const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  'pk_test_am9pbnQtY2FsZi03NjA1LmNsZXJrLmFjY291bnRzLmRldiQ';

export const App = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthProvider>
        <BrowserRouter>
          {/* Clerk OAuth & Google Synchronizer */}
          <ClerkAuthSync />

          {/* Animated Droppy Cartoon Water Mascot for in-app popups */}
          <WaterMascotNotification />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navbar /><LandingPage /></>} />
          <Route path="/login" element={<><Navbar /><LoginPage /></>} />
          <Route path="/register" element={<><Navbar /><RegisterPage /></>} />

          {/* Dashboards */}
          <Route
            path="/resident/dashboard"
            element={
              <ProtectedLayout allowedRoles={['resident', 'admin']}>
                <ResidentDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedLayout allowedRoles={['staff', 'admin']}>
                <MaintenanceStaffDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedLayout allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedLayout>
            }
          />

          {/* Core Feature Modules */}
          <Route
            path="/water-analytics"
            element={
              <ProtectedLayout>
                <WaterAnalyticsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/submit-complaint"
            element={
              <ProtectedLayout allowedRoles={['resident', 'admin']}>
                <SubmitComplaintPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/complaints"
            element={
              <ProtectedLayout>
                <ComplaintsListPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/water-availability"
            element={
              <ProtectedLayout>
                <WaterAvailabilityPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/ai-leak-detection"
            element={
              <ProtectedLayout allowedRoles={['admin', 'staff']}>
                <AILeakDetectionPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/demand-prediction"
            element={
              <ProtectedLayout allowedRoles={['admin', 'staff']}>
                <AIDemandPredictionPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/campus-map"
            element={
              <ProtectedLayout allowedRoles={['admin', 'staff']}>
                <CampusMapPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedLayout allowedRoles={['admin']}>
                <ReportsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedLayout>
                <AIRecommendationsPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedLayout allowedRoles={['admin']}>
                <UserDirectoryPage />
              </ProtectedLayout>
            }
          />

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ClerkProvider>
  );
};

export default App;
