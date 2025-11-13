import Models from "./model.js";

class Exams extends Models{

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
}

export default Exams;

