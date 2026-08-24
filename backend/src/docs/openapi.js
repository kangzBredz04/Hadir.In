const bearerSecurity = [
    {
        bearerAuth: []
    }
];

const paginationParameters = [
    {
        name: 'page',
        in: 'query',
        schema: {
            type: 'integer',
            minimum: 1,
            default: 1
        }
    },
    {
        name: 'limit',
        in: 'query',
        schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
        }
    }
];

const dateRangeParameters = [
    {
        name: 'start_date',
        in: 'query',
        schema: {
            type: 'string',
            format: 'date'
        }
    },
    {
        name: 'end_date',
        in: 'query',
        schema: {
            type: 'string',
            format: 'date'
        }
    }
];

const openApiSpec = {
    openapi: '3.0.3',

    info: {
        title: 'Hadir.In Attendance API',

        version: '1.0.0',

        description:
            'REST API untuk sistem absensi karyawan berbasis Express.js, Sequelize, PostgreSQL/Supabase, JWT, Argon2, GPS dan foto.'
    },

    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development'
        }
    ],

    tags: [
        {
            name: 'System'
        },
        {
            name: 'Authentication'
        },
        {
            name: 'Employee'
        },
        {
            name: 'Attendance'
        },
        {
            name: 'Admin - Users'
        },
        {
            name: 'Admin - Offices'
        },
        {
            name: 'Admin - Attendance'
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },

        schemas: {
            ErrorResponse: {
                type: 'object',

                properties: {
                    success: {
                        type: 'boolean',
                        example: false
                    },

                    message: {
                        type: 'string',
                        example:
                            'Terjadi kesalahan'
                    },

                    errors: {
                        type: 'array',
                        items: {
                            type: 'object'
                        }
                    }
                }
            },

            Office: {
                type: 'object',

                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid'
                    },

                    name: {
                        type: 'string'
                    },

                    address: {
                        type: 'string'
                    },

                    latitude: {
                        type: 'string',
                        example:
                            '-6.2000000'
                    },

                    longitude: {
                        type: 'string',
                        example:
                            '106.8166667'
                    },

                    radiusMeter: {
                        type: 'integer',
                        example: 100
                    },

                    isActive: {
                        type: 'boolean'
                    }
                }
            },

            User: {
                type: 'object',

                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid'
                    },

                    employeeId: {
                        type: 'string',
                        example: 'EMP001'
                    },

                    name: {
                        type: 'string',
                        example:
                            'Employee Satu'
                    },

                    email: {
                        type: 'string',
                        format: 'email'
                    },

                    role: {
                        type: 'string',
                        enum: [
                            'ADMIN',
                            'EMPLOYEE'
                        ]
                    },

                    officeId: {
                        type: 'string',
                        format: 'uuid',
                        nullable: true
                    },

                    isActive: {
                        type: 'boolean'
                    },

                    office: {
                        allOf: [
                            {
                                $ref:
                                    '#/components/schemas/Office'
                            }
                        ],

                        nullable: true
                    }
                }
            },

            AttendancePhoto: {
                type: 'object',

                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid'
                    },

                    type: {
                        type: 'string',
                        enum: [
                            'CHECK_IN',
                            'CHECK_OUT'
                        ]
                    },

                    photoUrl: {
                        type: 'string'
                    },

                    createdAt: {
                        type: 'string',
                        format:
                            'date-time'
                    }
                }
            },

            Attendance: {
                type: 'object',

                properties: {
                    id: {
                        type: 'string',
                        format: 'uuid'
                    },

                    userId: {
                        type: 'string',
                        format: 'uuid'
                    },

                    officeId: {
                        type: 'string',
                        format: 'uuid'
                    },

                    attendanceDate: {
                        type: 'string',
                        format: 'date'
                    },

                    checkInTime: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true
                    },

                    checkInLatitude: {
                        type: 'string',
                        nullable: true
                    },

                    checkInLongitude: {
                        type: 'string',
                        nullable: true
                    },

                    checkInDistance: {
                        type: 'string',
                        nullable: true
                    },

                    checkOutTime: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true
                    },

                    checkOutLatitude: {
                        type: 'string',
                        nullable: true
                    },

                    checkOutLongitude: {
                        type: 'string',
                        nullable: true
                    },

                    checkOutDistance: {
                        type: 'string',
                        nullable: true
                    },

                    status: {
                        type: 'string',
                        enum: [
                            'PRESENT',
                            'LATE',
                            'ABSENT'
                        ]
                    }
                }
            },

            Pagination: {
                type: 'object',

                properties: {
                    page: {
                        type: 'integer'
                    },

                    limit: {
                        type: 'integer'
                    },

                    total: {
                        type: 'integer'
                    },

                    totalPages: {
                        type: 'integer'
                    }
                }
            }
        },

        responses: {
            Unauthorized: {
                description:
                    'Authentication diperlukan',

                content: {
                    'application/json': {
                        schema: {
                            $ref:
                                '#/components/schemas/ErrorResponse'
                        }
                    }
                }
            },

            Forbidden: {
                description:
                    'Tidak memiliki akses',

                content: {
                    'application/json': {
                        schema: {
                            $ref:
                                '#/components/schemas/ErrorResponse'
                        }
                    }
                }
            },

            ValidationError: {
                description:
                    'Validasi gagal',

                content: {
                    'application/json': {
                        schema: {
                            $ref:
                                '#/components/schemas/ErrorResponse'
                        }
                    }
                }
            },

            NotFound: {
                description:
                    'Data tidak ditemukan',

                content: {
                    'application/json': {
                        schema: {
                            $ref:
                                '#/components/schemas/ErrorResponse'
                        }
                    }
                }
            },

            Conflict: {
                description:
                    'Data mengalami konflik',

                content: {
                    'application/json': {
                        schema: {
                            $ref:
                                '#/components/schemas/ErrorResponse'
                        }
                    }
                }
            }
        }
    },

    paths: {
        '/api/health': {
            get: {
                tags: [
                    'System'
                ],

                security: [],

                summary:
                    'Health check API',

                responses: {
                    200: {
                        description:
                            'API berjalan'
                    }
                }
            }
        },

        '/api/auth/login': {
            post: {
                tags: [
                    'Authentication'
                ],

                security: [],

                summary:
                    'Login user',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type:
                                    'object',

                                required: [
                                    'email',
                                    'password'
                                ],

                                properties: {
                                    email: {
                                        type:
                                            'string',

                                        format:
                                            'email',

                                        example:
                                            'employee1@hadir.in'
                                    },

                                    password: {
                                        type:
                                            'string',

                                        format:
                                            'password',

                                        example:
                                            'Employee123!'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            'Login berhasil'
                    },

                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },

                    422: {
                        $ref:
                            '#/components/responses/ValidationError'
                    },

                    429: {
                        description:
                            'Terlalu banyak percobaan login'
                    }
                }
            }
        },

        '/api/users/me': {
            get: {
                tags: [
                    'Employee'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Informasi user yang sedang login',

                responses: {
                    200: {
                        description:
                            'Data user berhasil diambil',

                        content: {
                            'application/json': {
                                schema: {
                                    type:
                                        'object',

                                    properties: {
                                        success: {
                                            type:
                                                'boolean'
                                        },

                                        message: {
                                            type:
                                                'string'
                                        },

                                        data: {
                                            $ref:
                                                '#/components/schemas/User'
                                        }
                                    }
                                }
                            }
                        }
                    },

                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/api/attendance/check-in': {
            post: {
                tags: [
                    'Attendance'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Check-in employee',

                requestBody: {
                    required: true,

                    content: {
                        'multipart/form-data': {
                            schema: {
                                type:
                                    'object',

                                required: [
                                    'photo',
                                    'latitude',
                                    'longitude'
                                ],

                                properties: {
                                    photo: {
                                        type:
                                            'string',

                                        format:
                                            'binary'
                                    },

                                    latitude: {
                                        type:
                                            'number',

                                        format:
                                            'double',

                                        example:
                                            -6.2
                                    },

                                    longitude: {
                                        type:
                                            'number',

                                        format:
                                            'double',

                                        example:
                                            106.8166667
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            'Check-in berhasil'
                    },

                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },

                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },

                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    },

                    422: {
                        description:
                            'Lokasi/foto tidak valid',

                        content: {
                            'application/json': {
                                example: {
                                    success:
                                        false,

                                    message:
                                        'Anda berada di luar jangkauan kantor',

                                    errors: [
                                        {
                                            field:
                                                'location',

                                            distance:
                                                157.32,

                                            allowedRadius:
                                                100
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },

        '/api/attendance/check-out': {
            post: {
                tags: [
                    'Attendance'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Check-out employee',

                requestBody: {
                    required: true,

                    content: {
                        'multipart/form-data': {
                            schema: {
                                type:
                                    'object',

                                required: [
                                    'photo',
                                    'latitude',
                                    'longitude'
                                ],

                                properties: {
                                    photo: {
                                        type:
                                            'string',

                                        format:
                                            'binary'
                                    },

                                    latitude: {
                                        type:
                                            'number',

                                        format:
                                            'double'
                                    },

                                    longitude: {
                                        type:
                                            'number',

                                        format:
                                            'double'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            'Check-out berhasil'
                    },

                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },

                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    },

                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    },

                    422: {
                        $ref:
                            '#/components/responses/ValidationError'
                    }
                }
            }
        },

        '/api/attendance/today': {
            get: {
                tags: [
                    'Attendance'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Absensi employee hari ini',

                responses: {
                    200: {
                        description:
                            'Absensi hari ini'
                    },

                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    }
                }
            }
        },

        '/api/attendance/history': {
            get: {
                tags: [
                    'Attendance'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Riwayat absensi employee',

                parameters: [
                    ...paginationParameters,
                    ...dateRangeParameters
                ],

                responses: {
                    200: {
                        description:
                            'Riwayat absensi berhasil diambil'
                    },

                    401: {
                        $ref:
                            '#/components/responses/Unauthorized'
                    },

                    422: {
                        $ref:
                            '#/components/responses/ValidationError'
                    }
                }
            }
        },

        '/api/admin/users': {
            get: {
                tags: [
                    'Admin - Users'
                ],

                security:
                    bearerSecurity,

                summary:
                    'List users',

                parameters: [
                    ...paginationParameters,

                    {
                        name:
                            'search',

                        in:
                            'query',

                        schema: {
                            type:
                                'string'
                        }
                    },

                    {
                        name:
                            'role',

                        in:
                            'query',

                        schema: {
                            type:
                                'string',

                            enum: [
                                'ADMIN',
                                'EMPLOYEE'
                            ]
                        }
                    },

                    {
                        name:
                            'office_id',

                        in:
                            'query',

                        schema: {
                            type:
                                'string',

                            format:
                                'uuid'
                        }
                    },

                    {
                        name:
                            'is_active',

                        in:
                            'query',

                        schema: {
                            type:
                                'boolean'
                        }
                    }
                ],

                responses: {
                    200: {
                        description:
                            'List user'
                    },

                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    }
                }
            },

            post: {
                tags: [
                    'Admin - Users'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Create user',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type:
                                    'object',

                                required: [
                                    'employee_id',
                                    'name',
                                    'email',
                                    'password',
                                    'role'
                                ],

                                properties: {
                                    employee_id: {
                                        type:
                                            'string'
                                    },

                                    name: {
                                        type:
                                            'string'
                                    },

                                    email: {
                                        type:
                                            'string',

                                        format:
                                            'email'
                                    },

                                    password: {
                                        type:
                                            'string'
                                    },

                                    role: {
                                        type:
                                            'string',

                                        enum: [
                                            'ADMIN',
                                            'EMPLOYEE'
                                        ]
                                    },

                                    office_id: {
                                        type:
                                            'string',

                                        format:
                                            'uuid',

                                        nullable:
                                            true
                                    },

                                    is_active: {
                                        type:
                                            'boolean',

                                        default:
                                            true
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            'User berhasil dibuat'
                    },

                    409: {
                        $ref:
                            '#/components/responses/Conflict'
                    },

                    422: {
                        $ref:
                            '#/components/responses/ValidationError'
                    }
                }
            }
        },

        '/api/admin/users/{id}': {
            get: {
                tags: [
                    'Admin - Users'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Detail user',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],

                responses: {
                    200: {
                        description:
                            'Detail user'
                    },

                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            },

            put: {
                tags: [
                    'Admin - Users'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Update user',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],

                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type:
                                    'object',

                                additionalProperties:
                                    true
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            'User berhasil diperbarui'
                    }
                }
            },

            delete: {
                tags: [
                    'Admin - Users'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Nonaktifkan user',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],

                responses: {
                    200: {
                        description:
                            'User dinonaktifkan'
                    }
                }
            }
        },

        '/api/admin/offices': {
            get: {
                tags: [
                    'Admin - Offices'
                ],

                security:
                    bearerSecurity,

                summary:
                    'List kantor',

                parameters: [
                    ...paginationParameters,

                    {
                        name:
                            'search',

                        in:
                            'query',

                        schema: {
                            type:
                                'string'
                        }
                    },

                    {
                        name:
                            'is_active',

                        in:
                            'query',

                        schema: {
                            type:
                                'boolean'
                        }
                    }
                ],

                responses: {
                    200: {
                        description:
                            'List kantor'
                    }
                }
            },

            post: {
                tags: [
                    'Admin - Offices'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Create kantor',

                requestBody: {
                    required: true,

                    content: {
                        'application/json': {
                            schema: {
                                type:
                                    'object',

                                required: [
                                    'name',
                                    'address',
                                    'latitude',
                                    'longitude',
                                    'radius_meter'
                                ],

                                properties: {
                                    name: {
                                        type:
                                            'string'
                                    },

                                    address: {
                                        type:
                                            'string'
                                    },

                                    latitude: {
                                        type:
                                            'number'
                                    },

                                    longitude: {
                                        type:
                                            'number'
                                    },

                                    radius_meter: {
                                        type:
                                            'integer',

                                        minimum:
                                            1
                                    },

                                    is_active: {
                                        type:
                                            'boolean'
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description:
                            'Kantor dibuat'
                    },

                    422: {
                        $ref:
                            '#/components/responses/ValidationError'
                    }
                }
            }
        },

        '/api/admin/offices/{id}': {
            get: {
                tags: [
                    'Admin - Offices'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Detail kantor',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],

                responses: {
                    200: {
                        description:
                            'Detail kantor'
                    }
                }
            },

            put: {
                tags: [
                    'Admin - Offices'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Update kantor',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],

                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type:
                                    'object',

                                additionalProperties:
                                    true
                            }
                        }
                    }
                },

                responses: {
                    200: {
                        description:
                            'Kantor diperbarui'
                    }
                }
            },

            delete: {
                tags: [
                    'Admin - Offices'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Nonaktifkan kantor',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],

                responses: {
                    200: {
                        description:
                            'Kantor dinonaktifkan'
                    }
                }
            }
        },

        '/api/admin/attendance': {
            get: {
                tags: [
                    'Admin - Attendance'
                ],

                security:
                    bearerSecurity,

                summary:
                    'List seluruh attendance',

                parameters: [
                    ...paginationParameters,
                    ...dateRangeParameters,

                    {
                        name: 'date',
                        in: 'query',
                        schema: {
                            type: 'string',
                            format: 'date'
                        }
                    },

                    {
                        name:
                            'employee_id',

                        in:
                            'query',

                        schema: {
                            type:
                                'string'
                        }
                    },

                    {
                        name:
                            'user_id',

                        in:
                            'query',

                        schema: {
                            type:
                                'string',

                            format:
                                'uuid'
                        }
                    },

                    {
                        name:
                            'office_id',

                        in:
                            'query',

                        schema: {
                            type:
                                'string',

                            format:
                                'uuid'
                        }
                    },

                    {
                        name:
                            'status',

                        in:
                            'query',

                        schema: {
                            type:
                                'string',

                            enum: [
                                'PRESENT',
                                'LATE',
                                'ABSENT'
                            ]
                        }
                    }
                ],

                responses: {
                    200: {
                        description:
                            'Data attendance'
                    },

                    403: {
                        $ref:
                            '#/components/responses/Forbidden'
                    }
                }
            }
        },

        '/api/admin/attendance/summary': {
            get: {
                tags: [
                    'Admin - Attendance'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Summary / dashboard attendance',

                parameters: [
                    ...dateRangeParameters,

                    {
                        name: 'date',
                        in: 'query',
                        schema: {
                            type: 'string',
                            format: 'date'
                        }
                    },

                    {
                        name:
                            'employee_id',

                        in:
                            'query',

                        schema: {
                            type:
                                'string'
                        }
                    },

                    {
                        name:
                            'office_id',

                        in:
                            'query',

                        schema: {
                            type:
                                'string',

                            format:
                                'uuid'
                        }
                    }
                ],

                responses: {
                    200: {
                        description:
                            'Summary absensi'
                    }
                }
            }
        },

        '/api/admin/attendance/{id}': {
            get: {
                tags: [
                    'Admin - Attendance'
                ],

                security:
                    bearerSecurity,

                summary:
                    'Detail attendance',

                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,

                        schema: {
                            type: 'string',
                            format: 'uuid'
                        }
                    }
                ],

                responses: {
                    200: {
                        description:
                            'Detail attendance termasuk foto'
                    },

                    404: {
                        $ref:
                            '#/components/responses/NotFound'
                    }
                }
            }
        }
    }
};

export default openApiSpec;