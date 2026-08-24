import AppRoutes from './routes/AppRoutes.jsx';
import AuthProvider from './contexts/AuthContext.jsx';
import { ToastProvider } from './components/ui/Toast.jsx';
import AppErrorBoundary from './components/ui/AppErrorBoundary.jsx';
import NetworkStatus from './components/ui/NetworkStatus.jsx';
import RouteEffects from './components/ui/RouteEffects.jsx';
import SkipLink from './components/ui/SkipLink.jsx';

export default function App() {
  return <AppErrorBoundary><AuthProvider><ToastProvider><SkipLink /><NetworkStatus /><RouteEffects /><AppRoutes /></ToastProvider></AuthProvider></AppErrorBoundary>;
}
