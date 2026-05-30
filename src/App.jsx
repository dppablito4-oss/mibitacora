import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import SpaceCopilot from './components/SpaceCopilot';
import ErrorBoundary from './components/ErrorBoundary';
import AdminRoute from './components/AdminRoute';

const HomePage = lazy(() => import('./pages/HomePage'));
const ScannerPage = lazy(() => import('./pages/ScannerPage'));
const QRGeneratorPage = lazy(() => import('./pages/QRGeneratorPage'));
const MathSolverPage = lazy(() => import('./pages/MathSolverPage'));
const TripticoMakerPage = lazy(() => import('./pages/TripticoMakerPage'));

const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function AppLayout() {
  const location = useLocation();
  const hidecopilot = ['/login', '/admin', '/tripticos'].some(r => location.pathname.startsWith(r));

  return (
    <div className="relative min-h-screen bg-[#030712]">
      {/* Global ambient effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-[30%] right-0 h-[700px] w-[700px] rounded-full bg-tesseract-500/[0.07] blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-tesseract-600/[0.04] blur-[100px]" />
      </div>

      {!hidecopilot && <Header />}

      <main className="relative z-10">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-dark">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-tesseract-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-tesseract-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-tesseract-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-sm text-tesseract-300 font-mono ml-2">Cargando...</span>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/qr" element={<QRGeneratorPage />} />
            <Route path="/math" element={<MathSolverPage />} />
            <Route path="/tripticos" element={<TripticoMakerPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!hidecopilot && <Footer />}
      {!hidecopilot && <SpaceCopilot />}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppLayout />
    </ErrorBoundary>
  );
}
