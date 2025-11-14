import express from 'express'
import Model from './Models/model.js';
import Exams from './Models/exams.js';
import BodyParts from './Models/bodyParts.js';

const router = express.Router()

// Clinics routes
router.get('/clinics', async (req, res) => {
    const { limit, offset, orderBy, order } = req.query;
    try {
        const clinicsModel = new Model(req.db, 'clinics');
        const clinics = await clinicsModel.findAll({ limit, offset, orderBy, order });
        return res.json({ clinics });    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/clinics/:id', async (req, res) => {
    const {id = undefined} = req.params;
    if (!id ) {
        return res.status(400).json({ error: 'Invalid clinic ID' });
    }
    try {
        const clinicsModel = new Model(req.db, 'clinics');
        const clinic = await clinicsModel.findById(req.params.id);
        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found' });
        }
        return res.json({ clinic });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/clinics/:id/bodyParts', async (req, res) => {
    const {id = undefined} = req.params;
    if (!id ) {
        return res.status(400).json({ error: 'Invalid clinic ID' });
    }
    try {
        const bodyPartsModel = new BodyParts(req.db);
        const bodyParts = await bodyPartsModel.getBodyPartByClinic(id, req.query);
        return res.json({ bodyParts }); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });   
    }
});

// Body Parts routes
router.get('/bodyParts', async (req, res) => {
    const { limit, offset, orderBy, order } = req.query;
    try {
        const bodyPartsModel = new Model(req.db, 'body_parts');
        const bodyParts = await bodyPartsModel.findAll({ limit, offset, orderBy, order });
        return res.json({ bodyParts });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/bodyParts/:id', async (req, res) => {
    const {id = undefined} = req.params;
    if (!id ) {
        return res.status(400).json({ error: 'Invalid body part ID' });
    }
    try {
        const bodyPartsModel = new Model(req.db, 'body_parts');
        const bodyPart = await bodyPartsModel.findById(req.params.id);
        if (!bodyPart) {
            return res.status(404).json({ error: 'Body part not found' });
        }   
        return res.json({ bodyPart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/bodyPartsByClinic', async (req, res) => {
    const { clinicId, limit, offset, orderBy, order } = req.query;  
    if (!clinicId) {
        return res.status(400).json({ error: 'clinicId is required' });
    }
    try {
        const bodyPartsModel = new BodyParts(req.db);
        const bodyParts = await bodyPartsModel.getBodyPartByClinic(clinicId, { limit, offset, orderBy, order });
        return res.json({ bodyParts }); 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Exams routes
router.get('/exams', async (req, res) => {
    const { limit, offset, orderBy, order } = req.query;
    try {
        const examsModel = new Exams(req.db, 'exams');
        const exams = await examsModel.findAll({ limit, offset, orderBy, order });
        return res.json({ exams });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/exams/:id', async (req, res) => {
    const {id = undefined} = req.params;
    if (!id ) {
        return res.status(400).json({ error: 'Invalid exam ID' });
    }
    try {
        const examsModel = new Exams(req.db, 'exams');
        const exam = await examsModel.findById(req.params.id);      
        if (!exam) {
            return res.status(404).json({ error: 'Exam not found' });
        }   
        return res.json({ exam });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/examsByBodyPartAndClinic', async (req, res) => {
    const { bodyPartId, clinicId, limit, offset, orderBy, order } = req.query;
    if (!bodyPartId || !clinicId) {
        return res.status(400).json({ error: 'bodyPartId and clinicId are required' });
    }
    try {
        const examsModel = new Exams(req.db); 
        const exams = await examsModel.getExamByBodyPartAndClinic(bodyPartId, clinicId, { limit, offset, orderBy, order });
        return res.json({ exams });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
