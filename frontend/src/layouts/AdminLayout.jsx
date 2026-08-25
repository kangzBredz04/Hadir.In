import {
    Bell,
    Building2,
    ClipboardList,
    FileText,
    LayoutDashboard,
    LogOut,
    Menu,
    Search,
    UserRound,
    Users,
    X
} from 'lucide-react';

import {
    useState
} from 'react';

import {
    NavLink,
    Outlet,
    useLocation,
    useNavigate
} from 'react-router-dom';

import Avatar from '../components/ui/Avatar';
import ConfirmDialog from '../components/ui/ConfirmDialog';

import useAuth from '../hooks/useAuth';

import {
    ADMIN_ROUTES,
    AUTH_ROUTES
} from '../constants/auth';

const navigation = [
    {
        label:
            'Dashboard',

        path:
            ADMIN_ROUTES.DASHBOARD,

        icon:
            LayoutDashboard
    },

    {
        label:
            'Employees',

        path:
            ADMIN_ROUTES.EMPLOYEES,

        icon:
            Users
    },

    {
        label:
            'Offices',

        path:
            ADMIN_ROUTES.OFFICES,

        icon:
            Building2
    },

    {
        label:
            'Attendance',

        path:
            ADMIN_ROUTES.ATTENDANCE,

        icon:
            ClipboardList
    },

    {
        label:
            'Reports',

        path:
            ADMIN_ROUTES.REPORTS,

        icon:
            FileText
    },

    {
        label:
            'Profile',

        path:
            ADMIN_ROUTES.PROFILE,

        icon:
            UserRound
    }
];

function AdminNavLink({
    item,
    onClick
}) {
    const Icon =
        item.icon;

    return (
        <NavLink
            to={item.path}
            onClick={onClick}
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
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-slate-600 hover:bg-background hover:text-text'
                }
      `}
        >
            <Icon
                size={19}
            />

            {item.label}
        </NavLink>
    );
}

function SidebarContent({
    user,
    onNavigate,
    onLogout
}) {
    return (
        <>
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
                        Admin Portal
                    </p>
                </div>
            </div>

            <nav
                className="
          flex-1
          space-y-1
          overflow-y-auto
          px-4
          py-5
        "
            >
                {navigation.map(
                    item => (
                        <AdminNavLink
                            key={item.path}
                            item={item}
                            onClick={
                                onNavigate
                            }
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

                    <div className="min-w-0">
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
                            Administrator
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onLogout}
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
                    />

                    Logout
                </button>
            </div>
        </>
    );
}

export default function AdminLayout() {
    const {
        user,
        logout
    } =
        useAuth();

    const location =
        useLocation();

    const navigate =
        useNavigate();

    const [
        mobileMenu,
        setMobileMenu
    ] =
        useState(false);

    const [
        logoutDialog,
        setLogoutDialog
    ] =
        useState(false);

    const [
        globalSearch,
        setGlobalSearch
    ] =
        useState('');

    let pageTitle =
        'Admin';

    if (
        location.pathname ===
        ADMIN_ROUTES.DASHBOARD
    ) {
        pageTitle =
            'Dashboard';
    } else if (
        location.pathname.startsWith(
            ADMIN_ROUTES.EMPLOYEES
        )
    ) {
        pageTitle =
            'Employees';
    } else if (
        location.pathname.startsWith(
            ADMIN_ROUTES.OFFICES
        )
    ) {
        pageTitle =
            'Offices';
    } else if (
        location.pathname.startsWith(
            ADMIN_ROUTES.ATTENDANCE
        )
    ) {
        pageTitle =
            location.pathname ===
                ADMIN_ROUTES.ATTENDANCE
                ? 'Attendance'
                : 'Detail Attendance';
    } else if (
        location.pathname ===
        ADMIN_ROUTES.REPORTS
    ) {
        pageTitle =
            'Reports';
    } else if (
        location.pathname ===
        ADMIN_ROUTES.PROFILE
    ) {
        pageTitle =
            'Profile';
    }

    const handleSearch =
        event => {
            event.preventDefault();

            const value =
                globalSearch.trim();

            if (!value) {
                return;
            }

            navigate(
                `${ADMIN_ROUTES.EMPLOYEES}?search=${encodeURIComponent(
                    value
                )}`
            );
        };

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
                <SidebarContent
                    user={user}
                    onLogout={() =>
                        setLogoutDialog(
                            true
                        )
                    }
                />
            </aside>

            {mobileMenu && (
                <div
                    className="
            fixed
            inset-0
            z-40
            lg:hidden
          "
                >
                    <button
                        type="button"
                        className="
              absolute
              inset-0
              bg-slate-950/40
            "
                        aria-label="Tutup menu"
                        onClick={() =>
                            setMobileMenu(
                                false
                            )
                        }
                    />

                    <aside
                        className="
              relative
              z-10
              flex
              h-full
              w-72
              max-w-[85vw]
              flex-col
              bg-surface
              shadow-xl
            "
                    >
                        <button
                            type="button"
                            className="
                absolute
                right-3
                top-5
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                text-muted
                hover:bg-background
              "
                            onClick={() =>
                                setMobileMenu(
                                    false
                                )
                            }
                            aria-label="Tutup sidebar"
                        >
                            <X size={20} />
                        </button>

                        <SidebarContent
                            user={user}
                            onNavigate={() =>
                                setMobileMenu(
                                    false
                                )
                            }
                            onLogout={() => {
                                setMobileMenu(
                                    false
                                );

                                setLogoutDialog(
                                    true
                                );
                            }}
                        />
                    </aside>
                </div>
            )}

            <div className="lg:pl-64">
                <header
                    className="
            sticky
            top-0
            z-20
            border-b
            border-border
            bg-surface/95
            backdrop-blur
          "
                >
                    <div
                        className="
              flex
              h-16
              items-center
              gap-3
              px-4
              sm:px-6
              lg:h-20
              lg:px-8
            "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenu(
                                    true
                                )
                            }
                            className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-text
                hover:bg-background
                lg:hidden
              "
                            aria-label="Buka menu"
                        >
                            <Menu size={21} />
                        </button>

                        <div className="min-w-0">
                            <h1
                                className="
                  truncate
                  text-lg
                  font-bold
                  text-text
                  lg:text-xl
                "
                            >
                                {pageTitle}
                            </h1>

                            <p
                                className="
                  hidden
                  text-xs
                  text-muted
                  sm:block
                "
                            >
                                Administration Panel
                            </p>
                        </div>

                        <form
                            className="
                ml-auto
                hidden
                w-full
                max-w-sm
                md:block
              "
                            onSubmit={
                                handleSearch
                            }
                        >
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-muted
                  "
                                />

                                <input
                                    value={
                                        globalSearch
                                    }
                                    onChange={
                                        event =>
                                            setGlobalSearch(
                                                event.target.value
                                            )
                                    }
                                    placeholder="Cari employee..."
                                    className="
                    min-h-10
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-background
                    pl-10
                    pr-3
                    text-sm
                    outline-none
                    focus:border-primary
                    focus:ring-4
                    focus:ring-primary/10
                  "
                                />
                            </div>
                        </form>

                        <button
                            type="button"
                            className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-muted
                hover:bg-background
              "
                            aria-label="Notifikasi"
                            title="Notifikasi belum tersedia"
                        >
                            <Bell size={20} />
                        </button>

                        <NavLink
                            to={
                                ADMIN_ROUTES.PROFILE
                            }
                            className="
                rounded-full
                transition
                hover:ring-4
                hover:ring-primary/10
              "
                        >
                            <Avatar
                                name={user?.name}
                                size="sm"
                            />
                        </NavLink>
                    </div>
                </header>

                <main
                    className="
            min-h-[calc(100vh-4rem)]
            px-4
            py-5
            sm:px-6
            lg:min-h-[calc(100vh-5rem)]
            lg:px-8
            lg:py-8
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

            <ConfirmDialog
                open={logoutDialog}
                title="Keluar dari Hadir.In?"
                message="Sesi Anda akan diakhiri dan Anda perlu login kembali untuk mengakses dashboard."
                confirmLabel="Logout"
                onClose={() =>
                    setLogoutDialog(
                        false
                    )
                }
                onConfirm={
                    handleLogout
                }
            />
        </div>
    );
}