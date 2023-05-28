const {
    Sequelize
} = require('sequelize');
/**
 * A service class for building and executing SQL queries using Sequelize with the BanyuMili framework.
 * @class
 */
class Service {
     /**
     * Create a new Service instance.
     * @param {Object} options - The database connection options.
     */
    constructor(options) {
        this.sequelize = new Sequelize(options.database, options.username, options.password, options);
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
    setSoftDelete(enabled) {
        this.softDelete = enabled;
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

    whereRaw(condition) {
        if (!this.options.whereRaw) {
            this.options.whereRaw = {};
        }
        this.options.whereRaw = condition;
        return this;
    }

    whereBetween(column, start, end) {
        if (!this.options.whereBetween) {
            this.options.whereBetween = {};
        }
        this.options.whereBetween = `${column} BETWEEN ${this.sequelize.escape(start)} AND ${this.sequelize.escape(end)}`;
        return this;
    }

    /**
     * Add a WHERE IN clause to the query.
     * @param {string} column - The column to filter by.
     * @param {Array} values - The values to filter by.
     * @returns {Service} - The Service instance.
     */
    whereIn(column, values) {
        if (!this.options.whereIn) {
            this.options.whereIn = [];
        }
        this.options.whereIn.push({ column, values });
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

    leftJoin(table, condition) {
        const joinClause = `LEFT JOIN ${table} ON ${condition}`;
        if (!this.options.join) {
            this.options.join = '';
        }
        this.options.join += ` ${joinClause}`;
        return this;
    }

    /**
     * Adds a limit clause to the query.
     * @param {number} limit - The maximum number of records to fetch.
     * @returns {Service} - The Service instance.
     */
    limit(limit) {
        this.options.limit = limit;
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
     * Executes the querys.
     * @returns {Promise<object[]>}.
     */
    async query(sql, replacements = []) {
        try {
            const records = await this.sequelize.query(sql, {
                type: Sequelize.QueryTypes.SELECT,
                replacements,
            });
            return records;
        } catch (error) {
            console.log(error);
        }
    }

     /**
     * Executes the query and returns the result as an array of records.
     * @returns {Promise<object[]>} - A Promise that resolves to an array of records.
     */
    async getResult() {
        const columns = this.options.columns ? this.options.columns.join(', ') : '*';
        const table = this.options.table;
        let whereClause = '';
        const whereValues = [];
    
        if (this.options.where || this.options.whereRaw || this.options.whereBetween || this.options.whereIn) {
            let whereObj = this.options.where
                ? Object.keys(this.options.where)
                      .map(key => `${key} = ${this.sequelize.escape(this.options.where[key])}`)
                      .join(' AND ')
                : '';
    
            if (this.options.whereRaw) {
                whereObj = whereObj ? `${whereObj} AND ${this.options.whereRaw}` : this.options.whereRaw;
            }
    
            if (this.options.whereBetween) {
                whereObj = whereObj ? `${whereObj} AND ${this.options.whereBetween}` : this.options.whereBetween;
            }
    
            if (this.options.whereIn) {
                const whereInClauses = this.options.whereIn.map(condition => {
                    const escapedValues = condition.values.map(value => this.sequelize.escape(value)).join(', ');
                    return `${condition.column} IN (${escapedValues})`;
                }).join(' AND ');
    
                whereObj = whereObj ? `${whereObj} AND ${whereInClauses}` : whereInClauses;
            }
    
            whereClause = `WHERE ${whereObj}`;
        }
        const joinClause = this.options.join ? this.options.join : '';
        const groupByClause = this.options.groupBy ? `GROUP BY ${this.options.groupBy}` : '';
        const orderByClause = this.options.orderBy ? `ORDER BY ${this.options.orderBy}` : '';
        const limitClause = this.options.limit ? `LIMIT ${this.options.limit}` : '';
        const query = `SELECT ${columns} FROM ${table} ${joinClause} ${whereClause} ${groupByClause} ${orderByClause} ${limitClause}`;
    
        try {
            const records = await this.sequelize.query(query, {
                type: Sequelize.QueryTypes.SELECT,
                replacements: whereValues,
            });
            if (this.returnType === 'object' && records.length === 1) {
                return records[0];
            } else {
                return records;
            }
        } catch (error) {
            if (error.message === 'Invalid value literal {val: "??"}') {
                console.log('Invalid value literal in where clause');
            } else {
                console.log(error);
            }
        } finally {
            this.options.columns = '';
            this.options.join = '';
            this.options.where ='';
            this.options.whereIn ='';
            this.options.whereRaw ='';
            this.options.whereBetween ='';
            this.options.groupBy = '';
            this.options.orderBy = '';
            this.options.limit = '';
        }
    }

    /**
     * Inserts a new record into the database.
     * @param {object} data - The data to insert.
     * @returns {Promise<object>} - A Promise that resolves to the inserted record.
     */
    async save(data) {
        const { table, values } = this.prepareData(data);
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
        if (this.timestamps) {
            values.push(now, now);
            this.allowedFields.push('createdAt', 'updatedAt');
        }
    
        const filteredData = {};
        for (const field of this.allowedFields) {
            if (field in data) {
                filteredData[field] = data[field];
            }
        }
        if (this.timestamps) {
            filteredData.createdAt = now;
            filteredData.updatedAt = now;
        }
    
        const keys = Object.keys(filteredData);
        const vals = Object.values(filteredData);
        const placeholders = keys.map(key => `${key} = ?`).join(', ');
    
        const query = `INSERT INTO ${table} SET ${placeholders}`;
        try {
            const result = await this.sequelize.query(query, {
                replacements: vals,
                type: Sequelize.QueryTypes.INSERT,
            });
                if(result[0] == 0){
                    const record = await this.where(this.primaryKey, data[this.primaryKey]).getResult();
                    return record;
                }else{
                    const record = await this.where(this.primaryKey, result[0]).getResult();
                    return record;
                }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
     /**
     * Updates an existing record in the database.
     * @param {object} data - The data to update.
     * @returns {Promise<object>} - A Promise that resolves to the result of the update.
     */
     async update(id, data) {
        if (!data) {
            throw new Error('Data argument is missing or null');
        }
    
        const {
            table,
            values
        } = this.prepareData(data);
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
        if (this.timestamps) {
            values.push(now);
            this.allowedFields.push('updatedAt');
        }
    
        const filteredData = {};
        for (const field of this.allowedFields) {
            if (field in data) {
                filteredData[field] = data[field];
            }
        }
    
        const setClause = Object.keys(filteredData)
            .map((key) => `${key} = ?`)
            .join(', ');
        const query = `UPDATE ${table} SET ${setClause} WHERE ${this.primaryKey} = ?`;
    
        try {
            const result = await this.sequelize.query(query, {
                type: Sequelize.QueryTypes.UPDATE,
                replacements: [...Object.values(filteredData), id],
            });
            if (result[0] === 0) {
                throw new Error(`Record with id ${id} not found`);
            }
            if (this.returnType === 'array') {
                const [record] = await this.where('id', id).getResult();
                return record;
            } else {
                const record = await this.where('id', id).getResult();
                return record;
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Deletes records from the database.
     * @returns {Promise<object>} - A Promise that resolves to the result of the delete operation.
     */
    async delete(id) {
        try {
            let recordToDelete;
            if(this.returnType == 'array'){
                [recordToDelete] = await this.where(this.primaryKey, id).getResult();
            }else{
                recordToDelete = await this.where(this.primaryKey, id).getResult();
            }
            if (!recordToDelete) {
                throw new Error(`Record with id ${id} not found`);
            }

            if (this.softDelete) {
                const result = await this.update(id, {
                    deletedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
                });

                if (!result) {
                    throw new Error(`Record with id ${id} not found`);
                }
            } else {
                const query = `DELETE FROM ${this.options.table} WHERE ${this.primaryKey} = ?`;
                const result = await this.sequelize.query(query, {
                    type: Sequelize.QueryTypes.DELETE,
                    replacements: [id],
                });

                if (result === 0) {
                    throw new Error(`Record with id ${id} not found`);
                }
            }

            if (this.returnType === 'array') {
                return recordToDelete;
            } else {
                return recordToDelete;
            }
        } catch (error) {
            console.error(`Error deleting record with id ${id}: ${error.message}`);
            throw error;
        }
    }
    /**
     * Prepares the data for insertion into the database.
     * @param {object} data - The data to prepare.
     * @returns {object} - An object containing the table name and values.
     */
    prepareData(data) {
        let table;
        let values = [];
        if (this.options.table) {
            table = this.options.table;
        } else {
            throw new Error('Table name not set');
        }

        for (const field of Object.keys(data)) {
            values.push(data[field]);
        }

        return {
            table,
            values
        };
    }
}

module.exports = Service;