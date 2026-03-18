import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import DocumentDetail from './pages/DocumentDetail';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import MainLayout from './components/MainLayout';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-brand-dark">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};



// Layout for Login/Register/Landing
const PageLayout = ({ children, hideNav = true }) => {
  const { user } = useAuth();
  return (
    <>
      {/* <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-screen relative z-10 overflow-x-hidden"
      >
        {!user && (
           <div className="fixed inset-0 z-[-1] bg-[#020617] overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-brand-primary/5 blur-[120px] rounded-full"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-brand-secondary/5 blur-[120px] rounded-full animate-pulse"></div>
           </div>
        )} */}
      {children}
      {/* </motion.div> */}
    </>
  );
};

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <PageLayout><LandingPage /></PageLayout>} />
        <Route path="/login" element={<PageLayout><Login /></PageLayout>} />
        <Route path="/register" element={<PageLayout><Register /></PageLayout>} />

        {/* Protected User Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/documents/:id" 
          element={
            <ProtectedRoute>
              <MainLayout><DocumentDetail /></MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout><Admin /></MainLayout>
            </ProtectedRoute>
          } 
        />

        {/* Root Redirects */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;