import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_STORAGE_BUCKET'
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(
            `Environment variable ${key} belum dikonfigurasi`
        );
    }
}

if (process.env.JWT_SECRET.length < 32) {
    throw new Error(
        'JWT_SECRET minimal harus memiliki 32 karakter'
    );
}

const env = {
    nodeEnv:
        process.env.NODE_ENV || 'development',

    port:
        Number(process.env.PORT) || 3000,

    appTimezone:
        process.env.APP_TIMEZONE ||
        'Asia/Jakarta',

    databaseUrl:
        process.env.DATABASE_URL,

    jwtSecret:
        process.env.JWT_SECRET,

    jwtExpiresIn:
        process.env.JWT_EXPIRES_IN || '1d',

    supabaseUrl:
        process.env.SUPABASE_URL,

    supabaseServiceRoleKey:
        process.env.SUPABASE_SERVICE_ROLE_KEY,

    supabaseStorageBucket:
        process.env.SUPABASE_STORAGE_BUCKET,

    photoSignedUrlExpiresIn:
        Number(
            process.env.PHOTO_SIGNED_URL_EXPIRES_IN
        ) || 3600
};

export default env;