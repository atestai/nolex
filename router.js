import express from 'express'
import Model from './Models/model.js';
import Exams from './Models/exams.js';

const router = express.Router()

router.get('/clinics', async (req, res) => {
    const { limit, offset, orderBy, order } = req.query;
    const clinicsModel = new Model(req.db, 'clinics');
    
    const clinics = await clinicsModel.findAll({ limit, offset, orderBy, order });
    res.json({ clinics });
});

router.get('/clinics/:id', async (req, res) => {
    const {id = undefined} = req.params;

    if (!id ) {
        return res.status(400).json({ error: 'Invalid clinic ID' });
    }

    const clinicsModel = new Model(req.db, 'clinics');
    const clinic = await clinicsModel.findById(req.params.id);
    if (!clinic) {
        return res.status(404).json({ error: 'Clinic not found' });
    }
    res.json({ clinic });
});


router.get('/bodyParts', async (req, res) => {
    const { limit, offset, orderBy, order } = req.query;
    const bodyPartsModel = new Model(req.db, 'body_parts');
    
    const bodyParts = await bodyPartsModel.findAll({ limit, offset, orderBy, order });
    res.json({ bodyParts });
});


router.get('/bodyParts/:id', async (req, res) => {
    const {id = undefined} = req.params;
    if (!id ) {
        return res.status(400).json({ error: 'Invalid body part ID' });
    }
    const bodyPartsModel = new Model(req.db, 'body_parts');
    const bodyPart = await bodyPartsModel.findById(req.params.id);
    if (!bodyPart) {
        return res.status(404).json({ error: 'Body part not found' });
    }   
    res.json({ bodyPart });
});


router.get('/exams', async (req, res) => {
    const { limit, offset, orderBy, order } = req.query;
    const examsModel = new Exams(req.db, 'exams');
    
    const exams = await examsModel.findAll({ limit, offset, orderBy, order });
    res.json({ exams });
});


export default router;