require('dotenv').config();

const commonConfig = {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',

    migrationStorage: 'sequelize',
    migrationStorageTableName: 'SequelizeMeta',

    seederStorage: 'sequelize',
    seederStorageTableName: 'SequelizeData'
};

module.exports = {
    development: {
        ...commonConfig,
        logging: console.log
    },

    test: {
        ...commonConfig,
        logging: false
    },

    production: {
        ...commonConfig,
        logging: false,

        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};