const {
    Sequelize
} = require('sequelize');

class Service {
    constructor(options) {
        this.sequelize = new Sequelize(options.database, options.username, options.password, options);
        this.options = {};
        this.allowedFields = [];
        this.primaryKey = 'id';
        this.returnType = 'object';
        this.timestamps = false;
        this.softDelete = false;
    }

    setPrimaryKey(key) {
        this.primaryKey = key;
    }

    setAllowedFields(fields) {
        this.allowedFields = fields;
    }

    setTimestamps(enabled) {
        this.timestamps = enabled;
    }

    setSoftDelete(enabled) {
        this.softDelete = enabled;
    }

    setReturnType(type) {
        this.returnType = type;
    }

    setTable(name) {
        this.options.table = name;
    }

    select(...columns) {
        this.options.columns = columns;
        return this;
    }

    where(column, value) {
        if (!this.options.where) {
          this.options.where = {};
        }
        this.options.where[column] = Sequelize.literal(`${column} = ${this.sequelize.escape(value)}`);
        return this;
      }

    join(table, condition) {
        const joinClause = `JOIN ${table} ON ${condition}`;
        if (!this.options.join) {
            this.options.join = '';
        }
        this.options.join += ` ${joinClause}`;
        return this;
    }

    orderBy(order) {
        this.options.orderBy = order;
        return this;
    }

    groupBy(group) {
        this.options.groupBy = group;
        return this;
    }

    selectMax(column, alias) {
        const max = `MAX(${column})`;
        this.options.columns = [
            [max, alias]
        ];
        return this;
    }

    async single() {
        const [record] = await this.getResult();
        return record;
    }

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

    async getResult() {
        const columns = this.options.columns ? this.options.columns.join(', ') : '*';
        const table = this.options.table;
        let whereClause = '';
        const whereValues = [];
    
        if (this.options.where) {
            const whereValues = Object.values(this.options.where);
            whereClause = `WHERE ${whereValues.join(' AND ')}`;
          }
    
        const joinClause = this.options.join ? this.options.join : '';
        const groupByClause = this.options.groupBy ? `GROUP BY ${this.options.groupBy}` : '';
        const orderByClause = this.options.orderBy ? `ORDER BY ${this.options.orderBy}` : '';
        const query = `SELECT ${columns} FROM ${table} ${joinClause} ${whereClause} ${groupByClause} ${orderByClause}`;
    
        try {
            const records = await this.sequelize.query(query, {
                type: Sequelize.QueryTypes.SELECT,
                replacements: whereValues,
            });
            return records;
        } catch (error) {
            if (error.message === 'Invalid value literal {val: "??"}') {
                console.log('Invalid value literal in where clause');
            } else {
                console.log(error);
            }
        } finally {
            this.options.join = '';
        }
    }

    async save(data) {
        const {
            table,
            values
        } = this.prepareData(data);
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if (this.timestamps) {
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
        try {
            const result = await this.sequelize.query(query, {
                replacements: [filteredData],
                type: Sequelize.QueryTypes.INSERT,
            });

            if (this.returnType === 'id') {
                return {
                    id: result[0],
                };
            } else {
                const [record] = await this.getResult();
                return record;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async update(id, data) {
        const {
            table,
            values
        } = this.prepareData(data);
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if (this.timestamps) {
            values.push(now);
            this.allowedFields.push('updated_at');
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
            if (this.returnType === 'id') {
                return {
                    id
                };
            } else {
                const [record] = await this.getResult();
                return record;
            }
        } catch (error) {
            console.log(error);
        }
    }


    async delete(id) {
        const query = `DELETE FROM ${this.options.table} WHERE ${this.primaryKey} = ${this.sequelize.escape(id)}`;
        try {
            const result = await this.sequelize.query(query, {
                type: Sequelize.QueryTypes.DELETE
            });
            if (result[0] === 0) {
                throw new Error(`Record with id ${id} not found`);
            }
            if (this.softDelete) {
                await this.update(id, {
                    deleted_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
                });
            }
            if (this.returnType === 'id') {
                return {
                    id
                };
            } else {
                const [record] = await this.getResult();
                return record;
            }
        } catch (error) {
            console.error(`Error deleting record with id ${id}: ${error.message}`);
            throw error;
        }
    }

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