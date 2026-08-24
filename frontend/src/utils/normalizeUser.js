export default function normalizeUser(
    user
) {
    if (!user) {
        return null;
    }

    const office =
        user.office
            ? {
                id:
                    user.office.id,

                name:
                    user.office.name ?? '',

                address:
                    user.office.address ?? '',

                latitude:
                    user.office.latitude ??
                    null,

                longitude:
                    user.office.longitude ??
                    null,

                radiusMeter:
                    user.office.radiusMeter ??
                    user.office.radius_meter ??
                    null,

                isActive:
                    user.office.isActive ??
                    user.office.is_active ??
                    true
            }
            : null;

    return {
        id:
            user.id,

        employeeId:
            user.employeeId ??
            user.employee_id ??
            '',

        name:
            user.name ?? '',

        email:
            user.email ?? '',

        role:
            String(
                user.role ?? ''
            ).toUpperCase(),

        officeId:
            user.officeId ??
            user.office_id ??
            office?.id ??
            null,

        isActive:
            user.isActive ??
            user.is_active ??
            true,

        office
    };
}