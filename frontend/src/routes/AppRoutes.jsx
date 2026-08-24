import {
    Navigate,
    Route,
    Routes
} from 'react-router-dom';

import Login from '../pages/auth/Login';

import EmployeeDashboard from '../pages/employee/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import {
    AUTH_ROUTES,
    ROLES
} from '../constants/auth';

export default function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to={
                            AUTH_ROUTES.LOGIN
                        }
                        replace
                    />
                }
            />

            <Route
                path={
                    AUTH_ROUTES.LOGIN
                }
                element={
                    <Login />
                }
            />

            <Route
                element={
                    <ProtectedRoute />
                }
            >
                <Route
                    element={
                        <RoleRoute
                            role={
                                ROLES.EMPLOYEE
                            }
                        />
                    }
                >
                    <Route
                        path={
                            AUTH_ROUTES
                                .EMPLOYEE_HOME
                        }
                        element={
                            <EmployeeDashboard />
                        }
                    />
                </Route>

                <Route
                    element={
                        <RoleRoute
                            role={
                                ROLES.ADMIN
                            }
                        />
                    }
                >
                    <Route
                        path={
                            AUTH_ROUTES
                                .ADMIN_HOME
                        }
                        element={
                            <AdminDashboard />
                        }
                    />
                </Route>
            </Route>

            <Route
                path="*"
                element={
                    <Navigate
                        to={
                            AUTH_ROUTES.LOGIN
                        }
                        replace
                    />
                }
            />
        </Routes>
    );
}