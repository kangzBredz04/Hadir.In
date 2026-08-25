import 'dotenv/config';

import { Sequelize } from 'sequelize';

import pg from 'pg';

/*
 * Import ini sengaja dipertahankan
 * agar pg-hstore ikut terdeteksi
 * oleh Vercel file tracing.
 */
import 'pg-hstore';

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

            /*
             * PENTING UNTUK VERCEL
             *
             * Tanpa ini Sequelize akan mencoba
             * me-load "pg" secara dinamis.
             *
             * Vercel kadang tidak memasukkan
             * dynamic dependency tersebut ke
             * Serverless Function bundle.
             */
            dialectModule: pg,

            logging:
                isProduction
                    ? false
                    : console.log,

            /*
             * DATABASE_URL jangan menggunakan
             * ?sslmode=require.
             *
             * SSL kita atur dari sini.
             */
            dialectOptions: {
                ssl: {
                    require: true,

                    /*
                     * Ini juga menyelesaikan
                     * SELF_SIGNED_CERT_IN_CHAIN
                     * yang kamu dapat sebelumnya.
                     */
                    rejectUnauthorized: false
                }
            },

            /*
             * Pool kecil lebih cocok
             * untuk serverless.
             */
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

export {
    sequelize
};

export default sequelize;