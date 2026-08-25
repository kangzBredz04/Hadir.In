import {
    Sequelize
} from 'sequelize';

const isProduction =
    process.env.NODE_ENV ===
    'production';

const sequelize =
    new Sequelize(
        process.env.DATABASE_URL,
        {
            dialect:
                'postgres',

            logging:
                isProduction
                    ? false
                    : console.log,

            dialectOptions:
                isProduction
                    ? {
                        ssl: {
                            require: true,

                            rejectUnauthorized:
                                false
                        }
                    }
                    : {},

            pool: {
                max:
                    isProduction
                        ? 2
                        : 5,

                min:
                    0,

                acquire:
                    10000,

                idle:
                    10000
            }
        }
    );

export default sequelize;