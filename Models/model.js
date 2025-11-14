export default class Models {

    constructor(db, tableName) {
        this.db = db;
        this.tableName = tableName;
    }   
    
    async findAll( options = {} ) {
        const { limit, offset, orderBy = 'id', order = 'asc' } = options;   
        const query = this.db(this.tableName).select('id', 'name');
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