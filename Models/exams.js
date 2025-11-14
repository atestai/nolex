import Models from "./model.js";

export default class Exams extends Models{

    constructor(db) {
        super(db, 'exams');
    }   
    
    async findAll( options = {} ) {
        const { limit, offset, orderBy = 'body_part_name', order = 'asc' } = options;   
        const query = this.db(this.tableName)
            .select('exams.min_cod', 'exams.internal_code', 'body_parts.name as body_part_name')
            .join('body_parts', 'exams.body_parts_id', 'body_parts.id');
            
        if (limit) {
            query.limit(limit);
        }   
        if (offset) {
            query.offset(offset);
        }
        query.orderBy(orderBy, order);
        const data = await query;
        return data;
    }

    async findById(id) {
        return await this.db( this.tableName)
            .where('id', id)
            .select('id', 'name')
            .first();
    }

    async getExamByBodyPartAndClinic(bodyPartId, clinicId, options = {}) {
        // SELECT te.* 
        // FROM "body_parts" AS tbp
        // JOIN exams te ON  tbp.id = te.body_parts_id
        // JOIN rel_exam_clinic rec ON te.id = rec.exam_id
        // JOIN clinics tc ON rec.clinic_id = tc.id

        // WHERE tc.id = 1
        // AND tbp.id = 2;

        const { limit, offset, orderBy = 'exams.name', order = 'asc' } = options;   
        const query = this.db(this.tableName)
            .join('body_parts', 'body_parts.id', 'exams.body_parts_id')
            .join('rel_exam_clinic', 'exams.id', 'rel_exam_clinic.exam_id')
            .join('clinics', 'rel_exam_clinic.clinic_id', 'clinics.id')
            .where('clinics.id', clinicId)
            .andWhere('body_parts.id', bodyPartId)
            .select('exams.id', 'exams.name', 'exams.min_cod', 'exams.internal_code').distinct();
            
        if (limit) {
            query.limit(limit);
        }
        if (offset) {
            query.offset(offset);
        }
        query.orderBy(orderBy, order);
        return await query;
    }

}
