import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { SiteConfigProvider } from './context/SiteConfigContext'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Register service worker with automatic update and page reload
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[PWA] Nueva actualización encontrada. Recargando...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[PWA] Listo para trabajar sin conexión.');
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <SiteConfigProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </SiteConfigProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
)

