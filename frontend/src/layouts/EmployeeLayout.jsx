import {
    Bell,
    Building2,
    Clock3,
    History,
    LayoutDashboard,
    LogOut,
    UserRound
} from 'lucide-react';

import {
    NavLink,
    Outlet,
    useLocation,
    useNavigate
} from 'react-router-dom';

import Avatar from '../components/ui/Avatar';

import useAuth from '../hooks/useAuth';

import {
    AUTH_ROUTES,
    EMPLOYEE_ROUTES
} from '../constants/auth';

const navigation = [
    {
        label:
            'Dashboard',

        path:
            EMPLOYEE_ROUTES
                .DASHBOARD,

        icon:
            LayoutDashboard
    },

    {
        label:
            'Absensi',

        path:
            EMPLOYEE_ROUTES
                .ATTENDANCE,

        icon:
            Clock3
    },

    {
        label:
            'Riwayat',

        path:
            EMPLOYEE_ROUTES
                .HISTORY,

        icon:
            History
    },

    {
        label:
            'Profile',

        path:
            EMPLOYEE_ROUTES
                .PROFILE,

        icon:
            UserRound
    }
];

const pageTitles = {
    [EMPLOYEE_ROUTES.DASHBOARD]:
        'Dashboard',

    [EMPLOYEE_ROUTES.ATTENDANCE]:
        'Absensi',

    [EMPLOYEE_ROUTES.HISTORY]:
        'Riwayat Absensi',

    [EMPLOYEE_ROUTES.PROFILE]:
        'Profile'
};

function DesktopNavLink({
    item
}) {
    const Icon =
        item.icon;

    return (
        <NavLink
            to={item.path}
            className={({
                isActive
            }) => `
        flex
        items-center
        gap-3
        rounded-xl
        px-3.5
        py-3
        text-sm
        font-medium
        transition
        ${isActive
                    ? `
              bg-primary-light
              text-primary-dark
            `
                    : `
              text-slate-600
              hover:bg-background
              hover:text-text
            `
                }
      `}
        >
            <Icon
                size={19}
                aria-hidden="true"
            />

            {item.label}
        </NavLink>
    );
}

function MobileNavLink({
    item
}) {
    const Icon =
        item.icon;

    return (
        <NavLink
            to={item.path}
            className={({
                isActive
            }) => `
        flex
        min-w-0
        flex-1
        flex-col
        items-center
        justify-center
        gap-1
        py-2
        text-[11px]
        font-medium
        transition
        ${isActive
                    ? 'text-primary'
                    : 'text-muted'
                }
      `}
        >
            <Icon
                size={20}
                aria-hidden="true"
            />

            <span className="truncate">
                {item.label}
            </span>
        </NavLink>
    );
}

export default function EmployeeLayout() {
    const {
        user,
        logout
    } =
        useAuth();

    const navigate =
        useNavigate();

    const location =
        useLocation();

    const title =
        pageTitles[
        location.pathname
        ] ??
        'Hadir.In';

    const handleLogout =
        () => {
            logout();

            navigate(
                AUTH_ROUTES.LOGIN,
                {
                    replace: true
                }
            );
        };

    return (
        <div
            className="
        min-h-screen
        bg-background
      "
        >
            <aside
                className="
          fixed
          inset-y-0
          left-0
          z-30
          hidden
          w-64
          border-r
          border-border
          bg-surface
          lg:flex
          lg:flex-col
        "
            >
                <div
                    className="
            flex
            h-20
            items-center
            gap-3
            border-b
            border-border
            px-6
          "
                >
                    <div
                        className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-primary
              text-white
            "
                    >
                        <Building2
                            size={21}
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <p
                            className="
                font-bold
                text-primary-dark
              "
                        >
                            Hadir.In
                        </p>

                        <p
                            className="
                text-[11px]
                text-muted
              "
                        >
                            Employee Portal
                        </p>
                    </div>
                </div>

                <nav
                    className="
            flex-1
            space-y-1
            px-4
            py-5
          "
                >
                    {navigation.map(
                        item => (
                            <DesktopNavLink
                                key={item.path}
                                item={item}
                            />
                        )
                    )}
                </nav>

                <div
                    className="
            border-t
            border-border
            p-4
          "
                >
                    <div
                        className="
              mb-3
              flex
              items-center
              gap-3
              rounded-xl
              bg-background
              p-3
            "
                    >
                        <Avatar
                            name={user?.name}
                            size="sm"
                        />

                        <div
                            className="
                min-w-0
                flex-1
              "
                        >
                            <p
                                className="
                  truncate
                  text-sm
                  font-semibold
                  text-text
                "
                            >
                                {user?.name}
                            </p>

                            <p
                                className="
                  truncate
                  text-xs
                  text-muted
                "
                            >
                                {user?.employeeId}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleLogout
                        }
                        className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3.5
              py-3
              text-sm
              font-medium
              text-danger
              transition
              hover:bg-red-50
            "
                    >
                        <LogOut
                            size={19}
                            aria-hidden="true"
                        />

                        Logout
                    </button>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header
                    className="
            sticky
            top-0
            z-20
            flex
            h-16
            items-center
            justify-between
            border-b
            border-border
            bg-surface/95
            px-4
            backdrop-blur
            sm:px-6
            lg:h-20
            lg:px-8
          "
                >
                    <div>
                        <h1
                            className="
                text-lg
                font-bold
                text-text
                lg:text-xl
              "
                        >
                            {title}
                        </h1>

                        <p
                            className="
                hidden
                text-xs
                text-muted
                sm:block
              "
                        >
                            Employee Attendance Portal
                        </p>
                    </div>

                    <div
                        className="
              flex
              items-center
              gap-2
              sm:gap-3
            "
                    >
                        <button
                            type="button"
                            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-muted
                transition
                hover:bg-background
                hover:text-text
              "
                            aria-label="Notifikasi"
                        >
                            <Bell
                                size={20}
                            />
                        </button>

                        <NavLink
                            to={
                                EMPLOYEE_ROUTES
                                    .PROFILE
                            }
                            className="
                flex
                items-center
                gap-3
                rounded-xl
                p-1
                transition
                hover:bg-background
              "
                        >
                            <Avatar
                                name={user?.name}
                                size="sm"
                            />

                            <div
                                className="
                  hidden
                  max-w-40
                  sm:block
                "
                            >
                                <p
                                    className="
                    truncate
                    text-sm
                    font-semibold
                    text-text
                  "
                                >
                                    {user?.name}
                                </p>

                                <p
                                    className="
                    truncate
                    text-xs
                    text-muted
                  "
                                >
                                    {user?.employeeId}
                                </p>
                            </div>
                        </NavLink>

                        <button
                            type="button"
                            onClick={
                                handleLogout
                            }
                            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-danger
                transition
                hover:bg-red-50
                lg:hidden
              "
                            aria-label="Logout"
                        >
                            <LogOut
                                size={19}
                            />
                        </button>
                    </div>
                </header>

                <main
                    className="
            min-h-[calc(100vh-4rem)]
            px-4
            py-5
            pb-24
            sm:px-6
            lg:min-h-[calc(100vh-5rem)]
            lg:px-8
            lg:py-8
            lg:pb-8
          "
                >
                    <div
                        className="
              mx-auto
              max-w-7xl
            "
                    >
                        <Outlet />
                    </div>
                </main>
            </div>

            <nav
                className="
    fixed
    inset-x-0
    bottom-0
    z-30
    flex
    min-h-16
    border-t
    border-border
    bg-surface
    px-2
    pb-[env(safe-area-inset-bottom)]
    shadow-[0_-4px_20px_rgba(15,23,42,0.06)]
    lg:hidden
  "
            >
                {navigation.map(
                    item => (
                        <MobileNavLink
                            key={item.path}
                            item={item}
                        />
                    )
                )}
            </nav>
        </div>
    );
}