import {
    Building2,
    CheckCircle2,
    IdCard,
    Mail,
    ShieldCheck,
    UserRound
} from 'lucide-react';

import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';

import useAuth from '../../hooks/useAuth';

function ProfileItem({
    icon: Icon,
    label,
    value
}) {
    return (
        <div
            className="
        flex
        items-start
        gap-3
        border-b
        border-border
        py-4
        last:border-b-0
      "
        >
            <div
                className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-primary-light
          text-primary
        "
            >
                <Icon
                    size={18}
                    aria-hidden="true"
                />
            </div>

            <div>
                <p
                    className="
            text-xs
            font-medium
            text-muted
          "
                >
                    {label}
                </p>

                <p
                    className="
            mt-1
            break-words
            text-sm
            font-semibold
            text-text
          "
                >
                    {value || '-'}
                </p>
            </div>
        </div>
    );
}

export default function EmployeeProfile() {
    const {
        user
    } =
        useAuth();

    return (
        <div
            className="
        mx-auto
        max-w-4xl
        space-y-5
      "
        >
            <Card>
                <div
                    className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
          "
                >
                    <Avatar
                        name={user?.name}
                        size="lg"
                    />

                    <div
                        className="
              min-w-0
              flex-1
            "
                    >
                        <div
                            className="
                flex
                flex-wrap
                items-center
                gap-2
              "
                        >
                            <h2
                                className="
                  text-xl
                  font-bold
                  text-text
                "
                            >
                                {user?.name}
                            </h2>

                            <Badge
                                variant={
                                    user?.isActive
                                        ? 'success'
                                        : 'danger'
                                }
                            >
                                {user?.isActive
                                    ? 'Aktif'
                                    : 'Tidak Aktif'}
                            </Badge>
                        </div>

                        <p
                            className="
                mt-1
                text-sm
                text-muted
              "
                        >
                            {user?.employeeId}
                        </p>
                    </div>
                </div>
            </Card>

            <Card>
                <div>
                    <p
                        className="
              text-sm
              font-semibold
              text-primary
            "
                    >
                        Informasi Akun
                    </p>

                    <h3
                        className="
              mt-1
              text-lg
              font-bold
              text-text
            "
                    >
                        Profile Employee
                    </h3>
                </div>

                <div className="mt-4">
                    <ProfileItem
                        icon={UserRound}
                        label="Nama Lengkap"
                        value={user?.name}
                    />

                    <ProfileItem
                        icon={IdCard}
                        label="Employee ID"
                        value={
                            user?.employeeId
                        }
                    />

                    <ProfileItem
                        icon={Mail}
                        label="Email"
                        value={user?.email}
                    />

                    <ProfileItem
                        icon={ShieldCheck}
                        label="Role"
                        value={user?.role}
                    />

                    <ProfileItem
                        icon={Building2}
                        label="Kantor"
                        value={
                            user?.office?.name ??
                            'Belum ditentukan'
                        }
                    />

                    <ProfileItem
                        icon={CheckCircle2}
                        label="Status Akun"
                        value={
                            user?.isActive
                                ? 'Aktif'
                                : 'Tidak Aktif'
                        }
                    />
                </div>
            </Card>

            {user?.office && (
                <Card>
                    <p
                        className="
              text-sm
              font-semibold
              text-primary
            "
                    >
                        Informasi Kantor
                    </p>

                    <h3
                        className="
              mt-1
              font-bold
              text-text
            "
                    >
                        {user.office.name}
                    </h3>

                    <p
                        className="
              mt-2
              text-sm
              leading-6
              text-muted
            "
                    >
                        {user.office.address ||
                            'Alamat kantor belum tersedia.'}
                    </p>

                    {user.office.radiusMeter && (
                        <div
                            className="
                mt-4
                inline-flex
                rounded-lg
                bg-primary-light
                px-3
                py-2
                text-xs
                font-semibold
                text-primary-dark
              "
                        >
                            Radius absensi:
                            {' '}
                            {user.office.radiusMeter}
                            {' '}
                            meter
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
}