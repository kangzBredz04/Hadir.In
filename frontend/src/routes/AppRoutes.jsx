import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import AdminAttendance from '../pages/admin/Attendance.jsx';
import AdminAttendanceDetail from '../pages/admin/AttendanceDetail.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminEmployeeDetail from '../pages/admin/EmployeeDetail.jsx';
import AdminEmployees from '../pages/admin/Employees.jsx';
import AdminOfficeDetail from '../pages/admin/OfficeDetail.jsx';
import AdminOffices from '../pages/admin/Offices.jsx';
import AdminProfile from '../pages/admin/Profile.jsx';
import AdminReports from '../pages/admin/Reports.jsx';
import EmployeeLayout from '../layouts/EmployeeLayout.jsx';
import EmployeeDashboard from '../pages/employee/Dashboard.jsx';
import EmployeeAttendance from '../pages/employee/Attendance.jsx';
import EmployeeAttendanceDetail from '../pages/employee/AttendanceDetail.jsx';
import EmployeeHistory from '../pages/employee/History.jsx';
import EmployeeProfile from '../pages/employee/Profile.jsx';
import NotFound from '../pages/NotFound.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import PublicRoute from './PublicRoute.jsx';
import RoleRoute from './RoleRoute.jsx';
import RootRedirect from './RootRedirect.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute role="EMPLOYEE" />}>
          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="attendance" element={<EmployeeAttendance />} />
            <Route path="history" element={<EmployeeHistory />} />
            <Route path="history/:id" element={<EmployeeAttendanceDetail />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>
        </Route>

        <Route element={<RoleRoute role="ADMIN" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="employees/:id" element={<AdminEmployeeDetail />} />
            <Route path="offices" element={<AdminOffices />} />
            <Route path="offices/:id" element={<AdminOfficeDetail />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="attendance/:id" element={<AdminAttendanceDetail />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
