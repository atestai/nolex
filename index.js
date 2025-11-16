import express from 'express';
import cors from 'cors';
import { closeDatabase, createInitialSchema, dbErrorHandler, initialData, initializeDatabase, knexMiddleware } from './Middlewares/db.js';
import { authMiddleware } from './Middlewares/auth.js';
import { initializeConfigurator } from './Utility/configurator.js';
import { Default_HttpServer } from './Configurations/Default_HttpServer.js';
import { Default_General } from './Configurations/Default_General.js';

await initializeConfigurator();
console.info(`Starting ${Default_General.appName} v${Default_General.version}...`);

const HOST = Default_HttpServer.host || 'localhost';
const PORT = Default_HttpServer.port || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(knexMiddleware);

app.get('/info', (req, res) => {
    res.json({ 
        appName: Default_General.appName, 
        version: Default_General.version,
        status: 'ok', 
        dbConnected: !!req.db 
    });
});

//Router
app.use('/api', authMiddleware, (await import('./router.js')).default);
app.use(dbErrorHandler);

const startServer = async () => {
    try {
        await initializeDatabase();
        await createInitialSchema();
        await initialData();

        const server = app.listen( PORT, HOST, (e) => {
            console.info(`✓ Access the API at: http://${HOST}:${PORT}/api`);
            console.info('###NOLEX READY###');
        });

        const shutdown = async (signal) => {
            console.info(`\n${signal} received, closing server...`);
            await closeDatabase();
            server.close(() => {
                console.info('Server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('✗ Startup error:', error);
        process.exit(1);
    }
};

startServer();