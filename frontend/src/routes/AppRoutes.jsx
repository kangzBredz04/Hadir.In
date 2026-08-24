import {
    Navigate,
    Route,
    Routes
} from 'react-router-dom';

import Login from '../pages/auth/Login';

import AdminDashboard from '../pages/admin/Dashboard';

import EmployeeDashboard from '../pages/employee/Dashboard';
import EmployeeAttendance from '../pages/employee/Attendance';
import EmployeeHistory from '../pages/employee/History';
import EmployeeProfile from '../pages/employee/Profile';

import EmployeeLayout from '../layouts/EmployeeLayout';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import {
    AUTH_ROUTES,
    EMPLOYEE_ROUTES,
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
                            EMPLOYEE_ROUTES.ROOT
                        }
                        element={
                            <EmployeeLayout />
                        }
                    >
                        <Route
                            index
                            element={
                                <Navigate
                                    to="dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="dashboard"
                            element={
                                <EmployeeDashboard />
                            }
                        />

                        <Route
                            path="attendance"
                            element={
                                <EmployeeAttendance />
                            }
                        />

                        <Route
                            path="history"
                            element={
                                <EmployeeHistory />
                            }
                        />

                        <Route
                            path="profile"
                            element={
                                <EmployeeProfile />
                            }
                        />
                    </Route>
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
                            AUTH_ROUTES.ADMIN_HOME
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