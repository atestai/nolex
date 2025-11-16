
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { Default_Database } from './Configurations/Default_Database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const dbPath = Default_Database.dbPath || path.join(__dirname, './db/database.sqlite');
export const migrationsPath = path.join(__dirname, './db/migrations');

if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

if (!fs.existsSync(migrationsPath)) {
    fs.mkdirSync(migrationsPath, { recursive: true });
}

export const knexConfig = {
    client: 'better-sqlite3',
    connection: {
        filename: dbPath
    },
    useNullAsDefault: true,
    migrations: {
        tableName: 'knex_migrations',
        directory: migrationsPath
    }
};


