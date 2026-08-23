import app from './app.js';
import sequelize from './config/database.js';
import env from './config/env.js';

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log('✓ Database connection established');

        app.listen(env.port, () => {
            console.log(
                `✓ Server running on http://localhost:${env.port}`
            );
        });
    } catch (error) {
        console.error('✗ Failed to start server');
        console.error(error);

        process.exit(1);
    }
};

startServer();