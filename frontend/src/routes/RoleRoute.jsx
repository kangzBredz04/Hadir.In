import {
    Navigate,
    Outlet
} from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import {
    getHomeRouteForRole
} from '../constants/auth';

export default function RoleRoute({
    role
}) {
    const {
        user
    } = useAuth();

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        user.role !== role
    ) {
        return (
            <Navigate
                to={getHomeRouteForRole(
                    user.role
                )}
                replace
            />
        );
    }

    return <Outlet />;
}