import {
    Navigate,
    Outlet,
    useLocation
} from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import Spinner from '../components/ui/Spinner';

export default function ProtectedRoute() {
    const {
        isAuthenticated,
        isInitializing
    } = useAuth();

    const location =
        useLocation();

    if (isInitializing) {
        return (
            <div
                className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-background
        "
            >
                <Spinner
                    label="Memeriksa sesi..."
                />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from:
                        location.pathname
                }}
            />
        );
    }

    return <Outlet />;
}