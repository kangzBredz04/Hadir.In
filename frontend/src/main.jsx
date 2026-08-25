import {
  StrictMode
} from 'react';

import {
  createRoot
} from 'react-dom/client';

import {
  Analytics
} from '@vercel/analytics/react';

import {
  SpeedInsights
} from '@vercel/speed-insights/react';

import {
  BrowserRouter
} from 'react-router-dom';

import {
  AuthProvider
} from './contexts/AuthContext';

import {
  ToastProvider
} from './contexts/ToastContext';

import App from './App';

import 'leaflet/dist/leaflet.css';
import './index.css';

import PWAInstallProvider from './contexts/PWAInstallContext';

createRoot(
  document.getElementById(
    'root'
  )
).render(
  <StrictMode>
    <PWAInstallProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </PWAInstallProvider>

    <Analytics />
    <SpeedInsights />
  </StrictMode>
);