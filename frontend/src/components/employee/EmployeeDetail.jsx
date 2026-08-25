import {
    Building2,
    IdCard,
    Mail,
    ShieldCheck,
    UserRound
} from 'lucide-react';

import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

function Item({
    icon: Icon,
    label,
    value
}) {
    return (
        <div
            className="
        flex
        gap-3
        rounded-xl
        bg-background
        p-4
      "
        >
            <Icon
                size={18}
                className="
          mt-0.5
          shrink-0
          text-primary
        "
            />

            <div>
                <p
                    className="
            text-xs
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

export default function EmployeeDetail({
    employee
}) {
    if (!employee) {
        return null;
    }

    return (
        <div>
            <div
                className="
          flex
          items-center
          gap-4
        "
            >
                <Avatar
                    name={employee.name}
                    size="lg"
                />

                <div>
                    <h3
                        className="
              text-lg
              font-bold
              text-text
            "
                    >
                        {employee.name}
                    </h3>

                    <div className="mt-2">
                        <Badge
                            variant={
                                employee.isActive
                                    ? 'success'
                                    : 'danger'
                            }
                        >
                            {employee.isActive
                                ? 'Aktif'
                                : 'Tidak Aktif'}
                        </Badge>
                    </div>
                </div>
            </div>

            <div
                className="
          mt-6
          grid
          gap-3
          sm:grid-cols-2
        "
            >
                <Item
                    icon={IdCard}
                    label="Employee ID"
                    value={
                        employee.employeeId
                    }
                />

                <Item
                    icon={UserRound}
                    label="Nama"
                    value={employee.name}
                />

                <Item
                    icon={Mail}
                    label="Email"
                    value={employee.email}
                />

                <Item
                    icon={ShieldCheck}
                    label="Role"
                    value={employee.role}
                />

                <Item
                    icon={Building2}
                    label="Kantor"
                    value={
                        employee.office
                            ?.name
                    }
                />
            </div>
        </div>
    );
}