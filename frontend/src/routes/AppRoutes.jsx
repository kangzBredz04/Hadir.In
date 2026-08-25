import {
    Navigate,
    Route,
    Routes
} from 'react-router-dom';

import Login from '../pages/auth/Login';

import AdminLayout from '../layouts/AdminLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminEmployees from '../pages/admin/Employees';
import AdminOffices from '../pages/admin/Offices';
import AdminAttendance from '../pages/admin/Attendance';
import AdminAttendanceDetail from '../pages/admin/AttendanceDetail';
import AdminReports from '../pages/admin/Reports';
import AdminProfile from '../pages/admin/Profile';

import EmployeeDashboard from '../pages/employee/Dashboard';
import EmployeeAttendance from '../pages/employee/Attendance';
import EmployeeHistory from '../pages/employee/History';
import EmployeeProfile from '../pages/employee/Profile';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

import {
    ADMIN_ROUTES,
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
                {/* EMPLOYEE */}
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

                {/* ADMIN */}
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
                            ADMIN_ROUTES.ROOT
                        }
                        element={
                            <AdminLayout />
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
                                <AdminDashboard />
                            }
                        />

                        <Route
                            path="employees"
                            element={
                                <AdminEmployees />
                            }
                        />

                        <Route
                            path="offices"
                            element={
                                <AdminOffices />
                            }
                        />

                        <Route
                            path="attendance"
                            element={
                                <AdminAttendance />
                            }
                        />

                        <Route
                            path="attendance/:id"
                            element={
                                <AdminAttendanceDetail />
                            }
                        />

                        <Route
                            path="reports"
                            element={
                                <AdminReports />
                            }
                        />

                        <Route
                            path="profile"
                            element={
                                <AdminProfile />
                            }
                        />
                    </Route>
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