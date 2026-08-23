const isValidEmail = (email) => {
    if (typeof email !== 'string') {
        return false;
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(
        email.trim()
    );
};

const isValidUUID = (value) => {
    if (typeof value !== 'string') {
        return false;
    }

    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidRegex.test(value);
};

const isEmptyNumericValue = (
    value
) => {
    return (
        value === undefined ||
        value === null ||
        value === '' ||
        typeof value === 'boolean'
    );
};

const isValidLatitude = (
    value
) => {
    if (
        isEmptyNumericValue(value)
    ) {
        return false;
    }

    const number =
        Number(value);

    return (
        Number.isFinite(number) &&
        number >= -90 &&
        number <= 90
    );
};

const isValidLongitude = (
    value
) => {
    if (
        isEmptyNumericValue(value)
    ) {
        return false;
    }

    const number =
        Number(value);

    return (
        Number.isFinite(number) &&
        number >= -180 &&
        number <= 180
    );
};

const validateLoginInput = (
    body = {}
) => {
    const errors = [];

    const {
        email,
        password
    } = body;

    if (!email) {
        errors.push({
            field: 'email',
            message:
                'Email wajib diisi'
        });
    } else if (
        !isValidEmail(email)
    ) {
        errors.push({
            field: 'email',
            message:
                'Format email tidak valid'
        });
    }

    if (!password) {
        errors.push({
            field: 'password',
            message:
                'Password wajib diisi'
        });
    } else if (
        typeof password !==
        'string'
    ) {
        errors.push({
            field: 'password',
            message:
                'Password harus berupa string'
        });
    }

    return errors;
};

const validateUserCreateInput = (
    body = {}
) => {
    const errors = [];

    const {
        employee_id,
        name,
        email,
        password,
        role,
        office_id,
        is_active
    } = body;

    if (!employee_id?.trim()) {
        errors.push({
            field:
                'employee_id',

            message:
                'Employee ID wajib diisi'
        });
    } else if (
        employee_id
            .trim()
            .length > 50
    ) {
        errors.push({
            field:
                'employee_id',

            message:
                'Employee ID maksimal 50 karakter'
        });
    }

    if (!name?.trim()) {
        errors.push({
            field: 'name',
            message:
                'Nama wajib diisi'
        });
    } else if (
        name.trim().length > 150
    ) {
        errors.push({
            field: 'name',
            message:
                'Nama maksimal 150 karakter'
        });
    }

    if (!email) {
        errors.push({
            field: 'email',
            message:
                'Email wajib diisi'
        });
    } else if (
        !isValidEmail(email)
    ) {
        errors.push({
            field: 'email',
            message:
                'Format email tidak valid'
        });
    }

    if (!password) {
        errors.push({
            field: 'password',
            message:
                'Password wajib diisi'
        });
    } else if (
        typeof password !==
        'string' ||
        password.length < 8
    ) {
        errors.push({
            field: 'password',
            message:
                'Password minimal 8 karakter'
        });
    }

    if (
        ![
            'ADMIN',
            'EMPLOYEE'
        ].includes(role)
    ) {
        errors.push({
            field: 'role',
            message:
                'Role harus ADMIN atau EMPLOYEE'
        });
    }

    if (
        role === 'EMPLOYEE' &&
        !office_id
    ) {
        errors.push({
            field: 'office_id',
            message:
                'Employee wajib memiliki office'
        });
    }

    if (
        office_id &&
        !isValidUUID(
            office_id
        )
    ) {
        errors.push({
            field: 'office_id',
            message:
                'Format office_id tidak valid'
        });
    }

    if (
        is_active !== undefined &&
        typeof is_active !==
        'boolean'
    ) {
        errors.push({
            field: 'is_active',
            message:
                'is_active harus berupa boolean'
        });
    }

    return errors;
};

const validateUserUpdateInput = (
    body = {}
) => {
    const errors = [];

    const {
        employee_id,
        name,
        email,
        password,
        role,
        office_id,
        is_active
    } = body;

    if (
        employee_id !==
        undefined &&
        !employee_id?.trim()
    ) {
        errors.push({
            field: 'employee_id',
            message:
                'Employee ID tidak boleh kosong'
        });
    }

    if (
        name !== undefined &&
        !name?.trim()
    ) {
        errors.push({
            field: 'name',
            message:
                'Nama tidak boleh kosong'
        });
    }

    if (
        email !== undefined &&
        !isValidEmail(email)
    ) {
        errors.push({
            field: 'email',
            message:
                'Format email tidak valid'
        });
    }

    if (
        password !== undefined &&
        (
            typeof password !==
            'string' ||
            password.length < 8
        )
    ) {
        errors.push({
            field: 'password',
            message:
                'Password minimal 8 karakter'
        });
    }

    if (
        role !== undefined &&
        ![
            'ADMIN',
            'EMPLOYEE'
        ].includes(role)
    ) {
        errors.push({
            field: 'role',
            message:
                'Role harus ADMIN atau EMPLOYEE'
        });
    }

    if (
        office_id !== undefined &&
        office_id !== null &&
        !isValidUUID(
            office_id
        )
    ) {
        errors.push({
            field: 'office_id',
            message:
                'Format office_id tidak valid'
        });
    }

    if (
        is_active !== undefined &&
        typeof is_active !==
        'boolean'
    ) {
        errors.push({
            field: 'is_active',
            message:
                'is_active harus berupa boolean'
        });
    }

    return errors;
};

const validateOfficeCreateInput = (
    body = {}
) => {
    const errors = [];

    const {
        name,
        address,
        latitude,
        longitude,
        radius_meter,
        is_active
    } = body;

    if (!name?.trim()) {
        errors.push({
            field: 'name',
            message:
                'Nama kantor wajib diisi'
        });
    }

    if (!address?.trim()) {
        errors.push({
            field: 'address',
            message:
                'Alamat kantor wajib diisi'
        });
    }

    if (
        !isValidLatitude(
            latitude
        )
    ) {
        errors.push({
            field: 'latitude',
            message:
                'Latitude harus antara -90 sampai 90'
        });
    }

    if (
        !isValidLongitude(
            longitude
        )
    ) {
        errors.push({
            field: 'longitude',
            message:
                'Longitude harus antara -180 sampai 180'
        });
    }

    if (
        isEmptyNumericValue(
            radius_meter
        ) ||
        !Number.isInteger(
            Number(
                radius_meter
            )
        ) ||
        Number(
            radius_meter
        ) <= 0
    ) {
        errors.push({
            field:
                'radius_meter',

            message:
                'Radius harus berupa integer lebih dari 0'
        });
    }

    if (
        is_active !== undefined &&
        typeof is_active !==
        'boolean'
    ) {
        errors.push({
            field: 'is_active',
            message:
                'is_active harus berupa boolean'
        });
    }

    return errors;
};

const validateOfficeUpdateInput = (
    body = {}
) => {
    const errors = [];

    const {
        name,
        address,
        latitude,
        longitude,
        radius_meter,
        is_active
    } = body;

    if (
        name !== undefined &&
        !name?.trim()
    ) {
        errors.push({
            field: 'name',
            message:
                'Nama kantor tidak boleh kosong'
        });
    }

    if (
        address !== undefined &&
        !address?.trim()
    ) {
        errors.push({
            field: 'address',
            message:
                'Alamat kantor tidak boleh kosong'
        });
    }

    if (
        latitude !== undefined &&
        !isValidLatitude(
            latitude
        )
    ) {
        errors.push({
            field: 'latitude',
            message:
                'Latitude harus antara -90 sampai 90'
        });
    }

    if (
        longitude !== undefined &&
        !isValidLongitude(
            longitude
        )
    ) {
        errors.push({
            field: 'longitude',
            message:
                'Longitude harus antara -180 sampai 180'
        });
    }

    if (
        radius_meter !==
        undefined &&
        (
            isEmptyNumericValue(
                radius_meter
            ) ||
            !Number.isInteger(
                Number(
                    radius_meter
                )
            ) ||
            Number(
                radius_meter
            ) <= 0
        )
    ) {
        errors.push({
            field:
                'radius_meter',

            message:
                'Radius harus berupa integer lebih dari 0'
        });
    }

    if (
        is_active !== undefined &&
        typeof is_active !==
        'boolean'
    ) {
        errors.push({
            field: 'is_active',
            message:
                'is_active harus berupa boolean'
        });
    }

    return errors;
};

const validateAttendanceLocationInput = (
    body = {}
) => {
    const errors = [];

    const {
        latitude,
        longitude
    } = body;

    if (
        !isValidLatitude(
            latitude
        )
    ) {
        errors.push({
            field: 'latitude',
            message:
                'Latitude wajib valid dan berada antara -90 sampai 90'
        });
    }

    if (
        !isValidLongitude(
            longitude
        )
    ) {
        errors.push({
            field: 'longitude',
            message:
                'Longitude wajib valid dan berada antara -180 sampai 180'
        });
    }

    return errors;
};

const isValidDateOnly = (
    value
) => {
    if (
        typeof value !== 'string'
    ) {
        return false;
    }

    const dateRegex =
        /^\d{4}-\d{2}-\d{2}$/;

    if (
        !dateRegex.test(value)
    ) {
        return false;
    }

    const [
        year,
        month,
        day
    ] = value
        .split('-')
        .map(Number);

    const date =
        new Date(
            Date.UTC(
                year,
                month - 1,
                day
            )
        );

    return (
        date.getUTCFullYear() ===
        year &&
        date.getUTCMonth() ===
        month - 1 &&
        date.getUTCDate() ===
        day
    );
};

const validatePaginationQuery = (
    query = {}
) => {
    const errors = [];

    if (
        query.page !== undefined
    ) {
        const page =
            Number(query.page);

        if (
            !Number.isInteger(page) ||
            page < 1
        ) {
            errors.push({
                field: 'page',
                message:
                    'page harus berupa integer minimal 1'
            });
        }
    }

    if (
        query.limit !== undefined
    ) {
        const limit =
            Number(query.limit);

        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {
            errors.push({
                field: 'limit',
                message:
                    'limit harus berupa integer antara 1 sampai 100'
            });
        }
    }

    return errors;
};

const validateDateRange = (
    query = {}
) => {
    const errors = [];

    const {
        date,
        start_date,
        end_date
    } = query;

    if (
        date !== undefined &&
        !isValidDateOnly(date)
    ) {
        errors.push({
            field: 'date',
            message:
                'Format date harus YYYY-MM-DD'
        });
    }

    if (
        start_date !== undefined &&
        !isValidDateOnly(
            start_date
        )
    ) {
        errors.push({
            field: 'start_date',
            message:
                'Format start_date harus YYYY-MM-DD'
        });
    }

    if (
        end_date !== undefined &&
        !isValidDateOnly(
            end_date
        )
    ) {
        errors.push({
            field: 'end_date',
            message:
                'Format end_date harus YYYY-MM-DD'
        });
    }

    if (
        date &&
        (
            start_date ||
            end_date
        )
    ) {
        errors.push({
            field: 'date',
            message:
                'Gunakan date atau start_date/end_date, jangan keduanya'
        });
    }

    if (
        start_date &&
        end_date &&
        isValidDateOnly(
            start_date
        ) &&
        isValidDateOnly(
            end_date
        ) &&
        start_date > end_date
    ) {
        errors.push({
            field: 'start_date',
            message:
                'start_date tidak boleh lebih besar dari end_date'
        });
    }

    return errors;
};

const validateAttendanceHistoryQuery = (
    query = {}
) => {
    return [
        ...validatePaginationQuery(
            query
        ),

        ...validateDateRange(
            query
        )
    ];
};

const validateAdminAttendanceQuery = (
    query = {}
) => {
    const errors = [
        ...validatePaginationQuery(
            query
        ),

        ...validateDateRange(
            query
        )
    ];

    if (
        query.user_id &&
        !isValidUUID(
            query.user_id
        )
    ) {
        errors.push({
            field: 'user_id',
            message:
                'Format user_id tidak valid'
        });
    }

    if (
        query.office_id &&
        !isValidUUID(
            query.office_id
        )
    ) {
        errors.push({
            field: 'office_id',
            message:
                'Format office_id tidak valid'
        });
    }

    if (
        query.employee_id &&
        (
            typeof query.employee_id !==
            'string' ||
            query.employee_id
                .trim()
                .length > 50
        )
    ) {
        errors.push({
            field: 'employee_id',
            message:
                'employee_id tidak valid'
        });
    }

    if (
        query.status &&
        ![
            'PRESENT',
            'LATE',
            'ABSENT'
        ].includes(
            query.status
        )
    ) {
        errors.push({
            field: 'status',
            message:
                'status harus PRESENT, LATE, atau ABSENT'
        });
    }

    return errors;
};

export {
    isValidEmail,
    isValidUUID,
    isValidLatitude,
    isValidLongitude,

    validateLoginInput,

    validateUserCreateInput,
    validateUserUpdateInput,

    validateOfficeCreateInput,
    validateOfficeUpdateInput,

    validateAttendanceLocationInput,

    isValidDateOnly,

    validateAttendanceHistoryQuery,
    validateAdminAttendanceQuery
};