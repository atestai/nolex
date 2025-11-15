import Models from "./model.js";

export default class Clinics extends Models {
    constructor(db) {
        super(db, 'clinics');
    }

    async searchClinics(value, searchBy, options = {}) {
        const { limit, offset, orderBy = 'clinics.name', order = 'asc' } = options;   
        const query = this.db('body_parts')
            .join('exams', 'body_parts.id', 'exams.body_parts_id')
            .join('rel_exam_clinic', 'exams.id', 'rel_exam_clinic.exam_id')
            .join('clinics', 'rel_exam_clinic.clinic_id', 'clinics.id')
            .where(`exams.${searchBy}`, 'like', `%${value}%`)
            .select('clinics.id', 'clinics.name')
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
