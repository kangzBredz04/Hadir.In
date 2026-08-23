import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

const users = [
    {
        email: 'admin@hadir.in',
        password: 'Admin12345!',
        employeeId: 'ADM001',
        name: 'Administrator',
        role: 'ADMIN',
    },
    {
        email: 'employee1@hadir.in',
        password: 'Employee12345!',
        employeeId: 'EMP001',
        name: 'Employee Satu',
        role: 'EMPLOYEE',
    },
    {
        email: 'employee2@hadir.in',
        password: 'Employee12345!',
        employeeId: 'EMP002',
        name: 'Employee Dua',
        role: 'EMPLOYEE',
    },
];

async function main() {
    // =====================================================
    // 1. CEK OFFICE
    // =====================================================

    const { data: office, error: officeError } = await supabase
        .from('offices')
        .select('id, name')
        .eq('name', 'Kantor Pusat')
        .maybeSingle();

    if (officeError) {
        throw officeError;
    }

    if (!office) {
        throw new Error(
            'Office "Kantor Pusat" tidak ditemukan. Jalankan INSERT office terlebih dahulu.'
        );
    }

    console.log(
        `Office ditemukan: ${office.name} (${office.id})`
    );

    // =====================================================
    // 2. CREATE USERS
    // =====================================================

    for (const user of users) {
        console.log(`\nProcessing ${user.email}...`);

        // ---------------------------------------------------
        // Check apakah Auth User sudah ada
        // ---------------------------------------------------

        let authUser = null;

        const {
            data: existingUsers,
            error: listError,
        } = await supabase.auth.admin.listUsers({
            page: 1,
            perPage: 100,
        });

        if (listError) {
            throw listError;
        }

        authUser = existingUsers.users.find(
            (item) =>
                item.email?.toLowerCase() === user.email.toLowerCase()
        );

        // ---------------------------------------------------
        // Create Auth User jika belum ada
        // ---------------------------------------------------

        if (!authUser) {
            const { data, error } =
                await supabase.auth.admin.createUser({
                    email: user.email,
                    password: user.password,
                    email_confirm: true,
                    user_metadata: {
                        name: user.name,
                    },
                });

            if (error) {
                console.error(
                    `Gagal membuat Auth User ${user.email}:`,
                    error.message
                );

                continue;
            }

            authUser = data.user;

            console.log(
                `Auth User berhasil dibuat: ${authUser.id}`
            );
        } else {
            console.log(
                `Auth User sudah ada: ${authUser.id}`
            );
        }

        // ---------------------------------------------------
        // Check public.users
        // ---------------------------------------------------

        const {
            data: existingProfile,
            error: profileCheckError,
        } = await supabase
            .from('users')
            .select('id, employee_id, email')
            .eq('id', authUser.id)
            .maybeSingle();

        if (profileCheckError) {
            throw profileCheckError;
        }

        // ---------------------------------------------------
        // Create public.users jika belum ada
        // ---------------------------------------------------

        if (!existingProfile) {
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: authUser.id,
                    employee_id: user.employeeId,
                    name: user.name,
                    email: user.email.toLowerCase(),
                    role: user.role,
                    office_id:
                        user.role === 'EMPLOYEE'
                            ? office.id
                            : null,
                    is_active: true,
                });

            if (profileError) {
                console.error(
                    `Gagal membuat profile ${user.email}:`,
                    profileError.message
                );

                continue;
            }

            console.log(
                `Profile public.users berhasil dibuat`
            );
        } else {
            console.log(
                `Profile sudah ada: ${existingProfile.employee_id}`
            );
        }
    }

    console.log('\n================================');
    console.log('Seed selesai');
    console.log('================================');
}

main().catch((error) => {
    console.error('\nSeed gagal:');
    console.error(error);
    process.exit(1);
});