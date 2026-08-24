export const ROLES = Object.freeze({
    ADMIN: 'ADMIN',
    EMPLOYEE: 'EMPLOYEE'
});

export const AUTH_ROUTES = Object.freeze({
    LOGIN: '/login',

    ADMIN_HOME:
        '/admin/dashboard',

    EMPLOYEE_HOME:
        '/employee/dashboard'
});

export const EMPLOYEE_ROUTES =
    Object.freeze({
        ROOT:
            '/employee',

        DASHBOARD:
            '/employee/dashboard',

        ATTENDANCE:
            '/employee/attendance',

        HISTORY:
            '/employee/history',

        PROFILE:
            '/employee/profile'
    });

export function getHomeRouteForRole(
    role
) {
    switch (role) {
        case ROLES.ADMIN:
            return AUTH_ROUTES.ADMIN_HOME;

        case ROLES.EMPLOYEE:
            return AUTH_ROUTES.EMPLOYEE_HOME;

        default:
            return AUTH_ROUTES.LOGIN;
    }
}