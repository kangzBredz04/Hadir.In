import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
    'DATABASE_URL'
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Environment variable ${key} belum dikonfigurasi`);
    }
}

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',

    port: Number(process.env.PORT) || 3000,

    databaseUrl: process.env.DATABASE_URL,

    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',

    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET
};

export default env;