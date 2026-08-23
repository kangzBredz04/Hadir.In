import { Sequelize } from 'sequelize';
import env from './env.js';

const sequelize = new Sequelize(env.databaseUrl, {
    dialect: 'postgres',

    logging: env.nodeEnv === 'development'
        ? console.log
        : false,

    define: {
        underscored: true,
        timestamps: true
    },

    dialectOptions: env.nodeEnv === 'production'
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
        : {}
});

export default sequelize;