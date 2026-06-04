import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { SiteConfigProvider } from './context/SiteConfigContext'
import './index.css'
import App from './App.jsx'

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

