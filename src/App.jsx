import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import ErrorBoundary from './components/ErrorBoundary';
import AdminRoute from './components/AdminRoute';
import MainLayout from './components/layouts/MainLayout';
import Loader from './components/Loader';

const HomePage = lazy(() => import('./pages/HomePage'));
const ScannerPage = lazy(() => import('./pages/ScannerPage'));
const QRGeneratorPage = lazy(() => import('./pages/QRGeneratorPage'));
const MathSolverPage = lazy(() => import('./pages/MathSolverPage'));
const TripticoMakerPage = lazy(() => import('./pages/TripticoMakerPage'));
const GolpeLobbyPage = lazy(() => import('./pages/GolpeLobbyPage'));
const GolpeGamePage = lazy(() => import('./pages/GolpeGamePage'));

const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader fullScreen />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/qr" element={<QRGeneratorPage />} />
            <Route path="/math" element={<MathSolverPage />} />
            <Route path="/tripticos" element={<TripticoMakerPage />} />
            <Route path="/golpe" element={<GolpeLobbyPage />} />
            <Route path="/golpe/:partidaId" element={<GolpeGamePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/terminos" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
