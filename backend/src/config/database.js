import { Sequelize } from 'sequelize';

const {
    DATABASE_URL,
    NODE_ENV
} = process.env;

if (!DATABASE_URL) {
    throw new Error(
        'DATABASE_URL belum dikonfigurasi.'
    );
}

const isProduction =
    NODE_ENV === 'production';

const sequelize =
    new Sequelize(
        DATABASE_URL,
        {
            dialect: 'postgres',

            logging:
                isProduction
                    ? false
                    : console.log,

            dialectOptions: {
                ssl: {
                    require: true,

                    /*
                     * Dibutuhkan untuk kasus certificate
                     * chain Supabase / SSL inspection.
                     *
                     * Jangan tambahkan sslmode=require
                     * pada DATABASE_URL jika menggunakan
                     * config ini.
                     */
                    rejectUnauthorized: false
                }
            },

            pool: {
                max:
                    isProduction
                        ? 2
                        : 5,

                min: 0,

                acquire: 30000,

                idle: 10000
            },

            define: {
                timestamps: true,

                underscored: true
            }
        }
    );

export default sequelize;