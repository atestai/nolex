import express from 'express';
import cors from 'cors';
import { closeDatabase, createInitialSchema, dbErrorHandler, initialData, initializeDatabase, knexMiddleware } from './Middlewares/db.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(knexMiddleware);

app.get('/info', (req, res) => {
    res.json({ status: 'ok', dbConnected: !!req.db });
});

//Router

app.use(dbErrorHandler);

const startServer = async () => {
    try {
        await initializeDatabase();
        await createInitialSchema();
        await initialData();

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server started on port ${PORT}`);
        });

        const shutdown = async (signal) => {
            console.log(`\n${signal} received, closing server...`);
            await closeDatabase();
            server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('Startup error:', error);
        process.exit(1);
    }
};

startServer();