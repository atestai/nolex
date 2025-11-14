import Models from "./model.js";

export default class BodyParts extends Models {

    constructor(db) {
        super(db, 'body_parts');
    }

    async getBodyPartByClinic(id, options = {}) {
        // SELECT tbp.* 
        // FROM "body_parts" AS tbp
        // JOIN exams te ON  tbp.id = te.body_parts_id
        // JOIN rel_exam_clinic rec ON te.id = rec.exam_id
        // JOIN clinics tc ON rec.clinic_id = tc.id
        // WHERE tc.id = 1
        
        const { limit, offset, orderBy = 'body_parts.name', order = 'asc' } = options;   
        const query = this.db(this.tableName)
            .join('exams', 'body_parts.id', 'exams.body_parts_id')
            .join('rel_exam_clinic', 'exams.id', 'rel_exam_clinic.exam_id')
            .join('clinics', 'rel_exam_clinic.clinic_id', 'clinics.id')
            .where('clinics.id', id)
            .select('body_parts.id', 'body_parts.name')
            .distinct();
            
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