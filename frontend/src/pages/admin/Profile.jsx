import {
    Mail,
    ShieldCheck,
    UserRound
} from 'lucide-react';

import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

import useAuth from '../../hooks/useAuth';

export default function AdminProfile() {
    const {
        user
    } =
        useAuth();

    return (
        <div
            className="
        mx-auto
        max-w-3xl
        space-y-5
      "
        >
            <Card>
                <div className="flex items-center gap-4">
                    <Avatar
                        name={user?.name}
                        size="lg"
                    />

                    <div>
                        <h2 className="text-xl font-bold text-text">
                            {user?.name}
                        </h2>

                        <div className="mt-2">
                            <Badge variant="success">
                                Administrator
                            </Badge>
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <UserRound
                            size={19}
                            className="text-primary"
                        />

                        <div>
                            <p className="text-xs text-muted">
                                Nama
                            </p>

                            <p className="mt-1 font-semibold text-text">
                                {user?.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Mail
                            size={19}
                            className="text-primary"
                        />

                        <div>
                            <p className="text-xs text-muted">
                                Email
                            </p>

                            <p className="mt-1 font-semibold text-text">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <ShieldCheck
                            size={19}
                            className="text-primary"
                        />

                        <div>
                            <p className="text-xs text-muted">
                                Role
                            </p>

                            <p className="mt-1 font-semibold text-text">
                                {user?.role}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}