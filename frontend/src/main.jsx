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

createRoot(
  document.getElementById(
    'root'
  )
).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>

    <Analytics />
    <SpeedInsights />
  </StrictMode>
);