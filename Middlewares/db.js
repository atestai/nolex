import knex from 'knex';
import {knexConfig, dbPath } from '../config.js';

let db = null;

function getKnexInstance() {
    if (!db) {
        db = knex(knexConfig);
    }
    return db;
}

export const knexMiddleware = (req, res, next) => {
    req.db = getKnexInstance();
    next();
};
   

export const initializeDatabase = async () => {

    db = getKnexInstance();

    try {
        await db.raw('SELECT 1');
        console.log('✓ Database SQLite is connected:', dbPath);

        const [batchNo, log] = await db.migrate.latest();

        if (log.length === 0) {
            console.log('✓ Database is already up to date');
        } else {
            console.log(`✓ Migrations executed (batch ${batchNo}):`);
            for (const migration of log) {
                console.log(`  - ${migration}`);
            }
        }
        return db;
    } catch (error) {
        console.error('✗ Error initializing database:', error.message);
        throw error;
    }
};

export const createInitialSchema = async () => {
    db = getKnexInstance();

    try {
        const hasExamsTable = await db.schema.hasTable('exams');

        if (!hasExamsTable) {
            await db.schema.createTable('exams', (table) => {
                table.increments('id').primary();
                table.string('min_cod', 10).notNullable().unique();
                table.string('internal_code', 10).notNullable().unique();
                table.string('name', 100).notNullable();
                table.integer('body_parts_id').unsigned().notNullable();
                table.timestamps(true, true);
            });
            console.log('✓ Table exams created');
        }

        const hasBodyPartsTable = await db.schema.hasTable('body_parts');

        if (!hasBodyPartsTable) {
            await db.schema.createTable('body_parts', (table) => {
                table.increments('id').primary();
                table.string('name', 255).notNullable();
                table.timestamps(true, true);
            });
            console.log('✓ Table body_parts created');
        }

        const hasClinicsTable = await db.schema.hasTable('clinics');

        if (!hasClinicsTable) {
            await db.schema.createTable('clinics', (table) => {
                table.increments('id').primary();
                table.string('name', 255).notNullable();
                table.timestamps(true, true);
            });
            console.log('✓ Table clinics created');
        }

        const hasRelationsTable = await db.schema.hasTable('rel_exam_clinic');

        if (!hasRelationsTable) {
            await db.schema.createTable('rel_exam_clinic', (table) => {
                table.increments('id').primary();
                table.integer('exam_id').unsigned().notNullable();
                table.integer('clinic_id').unsigned().notNullable();
                table.timestamps(true, true);
            });
            console.log('✓ Table rel_exam_clinic created');
        }

        return db;
    } catch (error) {
        console.error('✗ Errore creazione schema:', error.message);
        throw error;
    }
};


export const initialData = async () => {
    db = getKnexInstance();

    try {
        const clinicCount = await db('clinics').count('* as count').first();

        if (clinicCount.count === 0) {
            await db('clinics').insert([
                {
                    name: 'Clinica Catania',
                },
                {
                    name: 'Clinica Messina',
                },
                {
                    name: 'Clinica Palermo',
                },
                {
                    name: 'Clinica Agrigento',
                },
                {
                    name: 'Clinica Enna',
                },
            ]);
        }

        const bodyPartCount = await db('body_parts').count('* as count').first();
        if (bodyPartCount.count === 0) {
            await db('body_parts').insert([
                { name: 'Testa' },
                { name: 'Collo' },
                { name: 'Torace' },
                { name: 'Addome' },
                { name: 'Pelvi' },
                { name: 'Arti Superiori' },
                { name: 'Arti Inferiori' },
            ]);
        }

        const examCount = await db('exams').count('* as count').first();
        if (examCount.count === 0) {
            await db('exams').insert([
                {
                    min_cod: 'EXAM001',
                    internal_code: 'INT001',
                    name: 'Risonanza Magnetica Testa',
                    body_parts_id: 1,   
                },
                {
                    min_cod: 'EXAM002', 
                    internal_code: 'INT002',
                    name: 'Risonanza Magnetica Collo',
                    body_parts_id: 2,
                },
                {
                    min_cod: 'EXAM003',
                    internal_code: 'INT003',
                    name: 'Risonanza Magnetica Torace',
                    body_parts_id: 3,
                },
                {
                    min_cod: 'EXAM004',
                    internal_code: 'INT004',
                    name: 'Risonanza Magnetica Addome',
                    body_parts_id: 4,
                },
                {
                    min_cod: 'EXAM005',
                    internal_code: 'INT005',
                    name: 'Risonanza Magnetica Pelvi',
                    body_parts_id: 5,
                },
                {
                    min_cod: 'EXAM006',
                    internal_code: 'INT006',
                    name: 'Risonanza Magnetica Colonna Vertebrale',
                    body_parts_id: 6,
                },
            ]);
        }

        const relationCount = await db('rel_exam_clinic').count('* as count').first();  
        if (relationCount.count === 0) {
            await db('rel_exam_clinic').insert([
                { exam_id: 1, clinic_id: 1 },
                { exam_id: 1, clinic_id: 2 },
                { exam_id: 1, clinic_id: 3 },
                { exam_id: 2, clinic_id: 2 },
                { exam_id: 2, clinic_id: 3 },
                { exam_id: 2, clinic_id: 1 },
                { exam_id: 3, clinic_id: 2 },
                { exam_id: 3, clinic_id: 3 },
                { exam_id: 4, clinic_id: 2 },
                { exam_id: 4, clinic_id: 3 },
                { exam_id: 5, clinic_id: 3 },
                { exam_id: 5, clinic_id: 1 },
                { exam_id: 6, clinic_id: 3 },
                { exam_id: 6, clinic_id: 1 },
                { exam_id: 6, clinic_id: 2 },
                { exam_id: 6, clinic_id: 5 }
            ]);
        }

    } catch (error) {
        console.error('✗ Error seeding data:', error.message);
        throw error;
    }
};

export const closeDatabase = async () => {
    if (db) {
        await db.destroy();
        db = null;
        console.log('✓ Database connection closed');
    }
};


export const dbErrorHandler = (err, req, res, next) => {
    // SQLite constraint errors
    if (err.code === 'SQLITE_CONSTRAINT') {
        if (err.message.includes('UNIQUE')) {
            return res.status(409).json({
                error: 'Duplicate: the resource already exists'
            });
        }
        if (err.message.includes('FOREIGN KEY')) {
            return res.status(400).json({
                error: 'Constraint violated: invalid reference'
            });
        }
    }

    console.error('Database error:', err);
    res.status(500).json({
        error: 'Errore del database',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};


export const getDb = () => db;