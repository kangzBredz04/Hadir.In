import {
    UserRoundCheck
} from 'lucide-react';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

import useAuth from '../../hooks/useAuth';

export default function EmployeeDashboard() {
    const {
        user,
        logout
    } =
        useAuth();

    return (
        <main
            className="
        min-h-screen
        bg-background
        px-4
        py-10
      "
        >
            <div
                className="
          mx-auto
          max-w-2xl
        "
            >
                <Card>
                    <div
                        className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-primary-light
              text-primary
            "
                    >
                        <UserRoundCheck
                            size={24}
                        />
                    </div>

                    <h1
                        className="
              mt-5
              text-xl
              font-bold
              text-text
            "
                    >
                        Employee Authentication
                        Berhasil
                    </h1>

                    <p
                        className="
              mt-2
              text-sm
              text-muted
            "
                    >
                        Selamat datang, {user?.name}.
                    </p>

                    <div
                        className="
              mt-5
              rounded-xl
              bg-background
              p-4
              text-sm
            "
                    >
                        <p>
                            Role:
                            {' '}
                            <strong>
                                {user?.role}
                            </strong>
                        </p>

                        <p className="mt-2">
                            Email:
                            {' '}
                            {user?.email}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        className="mt-6"
                        onClick={logout}
                    >
                        Logout
                    </Button>

                    <p
                        className="
              mt-4
              text-xs
              text-muted
            "
                    >
                        Dashboard sebenarnya akan
                        dibuat pada Tahap 3.
                    </p>
                </Card>
            </div>
        </main>
    );
}