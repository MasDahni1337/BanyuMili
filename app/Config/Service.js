class Service {

    /**
     * Create a new Service instance.
     * @param {Object} pool - The database connection pool.
     */
    constructor(pool) {
        this.pool = pool;
        this.options = {};
        this.allowedFields = [];
        this.primaryKey = 'id';
        this.returnType = 'object';
        this.timestamps = false;
        this.softDelete = false;
    }
    /**
     * Set the primary key for the table.
     * @param {string} key - The primary key column name.
     */
    setPrimaryKey(key) {
        this.primaryKey = key;
    }

    /**
     * Set the allowed fields for the table.
     * @param {string[]} fields - The allowed fields.
     */
    setAllowedFields(fields) {
        this.allowedFields = fields;
    }

    /**
     * Enable or disable timestamps for the table.
     * @param {boolean} enabled - Whether timestamps are enabled.
     */
    setTimestamps(enabled) {
        this.timestamps = enabled;
    }

    /**
     * Enable or disable softdelete .
     * @param {boolean} enabled.
     */
    setSoftDelete(enabled){
        this.softDelete = enabled
    }

    /**
     * Set the return type for the query.
     * @param {string} type - The return type.
     */
    setReturnType(type) {
        this.returnType = type;
    }

    /**
     * Set the table name for the query.
     * @param {string} name - The table name.
     */
    setTable(name) {
        this.options.table = name;
    }



    /**
     * Set the columns to be selected.
     * @param {...string} columns - The column names to be selected.
     * @returns {Service} - The Service instance.
     */
    select(...columns) {
        this.options.columns = columns;
        return this;
    }

    /**
     * Add a WHERE clause to the query.
     * @param {string} column - The column to filter by.
     * @param {*} value - The value to filter by.
     * @returns {Service} - The Service instance.
     */
    where(column, value) {
        if (!this.options.where) {
            this.options.where = {};
        }
        this.options.where[column] = value;
        return this;
    }
    /**
     * Adds a join clause to the query.
     * @param {string} table - The name of the table to join.
     * @param {string} condition - The join condition.
     * @returns {Service} - The Service instance.
     */
    join(table, condition) {
        const joinClause = `JOIN ${table} ON ${condition}`;
        if (!this.options.join) {
            this.options.join = '';
        }
        this.options.join += ` ${joinClause}`;
        return this;
    }
    /**
     * Adds an order by clause to the query.
     * @param {string} order - The order by clause.
     * @returns {QueryBuilder} - The QueryBuilder instance.
     */
    orderBy(order) {
        this.options.orderBy = order;
        return this;
    }
    /**
     * Adds a group by clause to the query.
     * @param {string} group - The group by clause.
     * @returns {QueryBuilder} - The QueryBuilder instance.
     */
    groupBy(group) {
        this.options.groupBy = group;
        return this;
    }
    /**
     * Adds a select max clause to the query.
     * @param {string} column - The name of the column to select the max value from.
     * @param {string} alias - The alias for the max value column.
     * @returns {QueryBuilder} - The QueryBuilder instance.
     */
    selectMax(column, alias) {
        const max = `MAX(${column})`;
        this.options.columns = [
            [max, alias]
        ];
        return this;
    }
    /**
     * Executes the query and returns a single record.
     * @returns {Promise<object>} - A Promise that resolves to a single record.
     */
    async single() {
        const [record] = await this.getResult();
        return record;
    }
    /**
     * Executes the query and returns the result as an array of records.
     * @returns {Promise<object[]>} - A Promise that resolves to an array of records.
     */
    async getResult() {
        let query = `SELECT ${this.options.columns ? this.options.columns.join(', ') : '*'} FROM ${this.options.table}`;
        if (this.options.join) {
            query += this.options.join;
        }
        if (this.options.where) {
            const whereClause = Object.keys(this.options.where)
                .map(key => `${key} = ${this.pool.escape(this.options.where[key])}`)
                .join(' AND ');
            query += ` WHERE ${whereClause}`;
        }
        if (this.options.groupBy) {
            query += ` GROUP BY ${this.options.groupBy}`;
        }
        if (this.options.orderBy) {
            query += ` ORDER BY ${this.options.orderBy}`;
        }
        const [records] = await this.pool.query(query);
        this.options.join = '';
        return records;
    }
    /**
     * Inserts a new record into the database.
     * @param {object} data - The data to insert.
     * @returns {Promise<object>} - A Promise that resolves to the inserted record.
     */
    async save(data) {
        const {
            table,
            values
        } = this.preparedData(data);

        if (this.timestamps) {
            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
            values.push(now, now);
            this.allowedFields.push('created_at', 'updated_at');
        }

        const filteredData = {};
        for (const field of this.allowedFields) {
            if (field in data) {
                filteredData[field] = data[field];
            }
        }

        const query = `INSERT INTO ${table} SET ?`;
        const [result] = await this.pool.query(query, filteredData);

        if (this.returnType === 'id') {
            return {
                id: result.insertId
            };
        } else if (this.returnType === 'array') {
            const insertedRecord = await this.select('*').where(this.primaryKey, result.insertId).toArray();
            return insertedRecord;
        } else {
            const insertedRecord = await this.select('*').where(this.primaryKey, result.insertId).single();
            return insertedRecord;
        }
    }
    /**
     * Updates an existing record in the database.
     * @param {object} data - The data to update.
     * @returns {Promise<object>} - A Promise that resolves to the result of the update.
     */
    async update(data) {
        const {
            table,
            values
        } = this.prepareUpdatedData(data);
        if (this.timestamps) {
            data.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }
        let query = `UPDATE ${table} SET ?`;
        if (this.options.where) {
            const whereClause = Object.keys(this.options.where)
                .map(key => `${key} = ${this.pool.escape(this.options.where[key])}`)
                .join(' AND ');
            query += ` WHERE ${whereClause}`;
        }
        const [result] = await this.pool.query(query, values);
        return {
            affectedRows: result.affectedRows
        };
    }
    /**
     * Deletes records from the database.
     * @returns {Promise<object>} - A Promise that resolves to the result of the delete operation.
     */
    async delete() {
        let query;
        if (this.softDelete) {
            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
            query = `UPDATE ${this.options.table} SET deleted_at = ? WHERE ${this.primaryKey} = ?`;
            await this.pool.query(query, [now, id]);
        } else {
            query = `DELETE FROM ${this.options.table} WHERE ${this.primaryKey} = ?`;
            await this.pool.query(query, [id]);
        }
        const [result] = await this.pool.query(query);
        return {
            affectedRows: result.affectedRows
        };
    }
    /**
     * Prepares the data for insertion into the database.
     * @param {object} data - The data to prepare.
     * @returns {object} - An object containing the table name, column names, values, and placeholders.
     */
    prepareData(data) {
        const table = this.options.table;
        const columns = Object.keys(data);
        const values = columns.map(column => data[column]);
        const placeholders = Array(columns.length).fill('?').join(', ');
        return {
            table,
            columns,
            values,
            placeholders
        };
    }
    /**
     * Prepares the data for updating a record in the database.
     * @param {object} data - The data to prepare.
     * @returns {object} - An object containing the table name, values, and set clause.
     */
    prepareUpdatedData(data) {
        const table = this.options.table;
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        return {
            table,
            values,
            setClause
        };
    }
}

module.exports = Service;