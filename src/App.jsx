import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import SpaceCopilot from './components/SpaceCopilot';
import ErrorBoundary from './components/ErrorBoundary';
import AdminRoute from './components/AdminRoute';

// Main page loads eagerly for LCP
import HomePage from './pages/HomePage';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

function AppLayout() {
  const location = useLocation();
  const hidecopilot = ['/login', '/admin'].some(r => location.pathname.startsWith(r));

  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-accent-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-sm text-zinc-500 font-mono ml-2">Cargando...</span>
          </div>
        </div>
      }>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Protected */}
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Copilot - only for logged-in users on non-admin pages */}
      {!hidecopilot && <SpaceCopilot />}
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppLayout />
      </Router>
    </ErrorBoundary>
  );
}
