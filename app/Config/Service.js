const knex = require('knex');
const moment = require('moment-timezone');
const path = require("path");
const fs = require("fs");
class Service {
    constructor(options) {
        this.knex = knex(options);
        this.tableName = '';
        this.primaryKey = 'id';
        this.allowedFields = [];
        this.timestamps = false;
        this.softDelete = false;
        this.queryBuilder = this.knex.queryBuilder();
    }

    setTable(name) {
        this.tableName = name;
        return this;
    }

    setPrimaryKey(key) {
        this.primaryKey = key;
        return this;
    }

    setAllowedFields(fields) {
        this.allowedFields = fields;
        return this;
    }

    setTimestamps(enabled) {
        this.timestamps = enabled;
        return this;
    }

    setSoftDelete(enabled) {
        this.softDelete = enabled;
        return this;
    }

    banyu() {
        return this.knex(this.tableName);
    }

    raw(column){
        return this.knex.raw(column);
    }

    async reportError(error) {
        const now = moment().tz(process.env.TZ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        console.log(now);
        const dateToday = moment().format("YYYY-MM-DD");
        const fileName = `error-${dateToday}.log`;
        const logsDirectory = path.join(__dirname, '..', '..', 'errors');
        console.log("cokk", error);
        const logMessage = `[${now}] Error: ${error.message}, Stack{${error.stack}}\n`;
        if (!fs.existsSync(logsDirectory)) {
            fs.mkdirSync(logsDirectory, { recursive: true });
        }

        const logPath = path.join(logsDirectory, fileName);
        fs.appendFileSync(logPath, logMessage, err => {
            if (err) {
                console.error(`Error writing to log file: ${err.message}`);
            }
        });
    }

    async save(data) {
        const now = moment().tz(process.env.TZ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        const originalAllowedFields = [...this.allowedFields];
        if (this.timestamps) {
            this.allowedFields.push('createdAt', 'updatedAt');
            data.createdAt = now;
            data.updatedAt = now;
        }

        let filteredData = this.filterFields(data);

        try {
            let record = await this.knex(this.tableName).insert(filteredData);
            if(this.primaryKey in data){
                record = await this.knex(this.tableName).where(this.primaryKey, data[this.primaryKey]);
            }else{
                record = await this.knex(this.tableName).where(this.primaryKey, record[0]);
            }
            this.allowedFields = originalAllowedFields;
            return record;
        } catch (error) {
            await this.reportError(error);
            console.error(`Error executing save: ${error.message}`);
            throw error;
        }
    }

    async update(id, data) {
        const now = moment().tz(process.env.TZ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        const originalAllowedFields = [...this.allowedFields];
        if (this.timestamps) {
            this.allowedFields.push('updatedAt');
            data.updatedAt = now;
        }

        let filteredData = this.filterFields(data);

        try {
            const result = await this.knex(this.tableName)
                .where(this.primaryKey, id)
                .update(filteredData);
                
            if (result === 0) {
                this.allowedFields = originalAllowedFields;
                throw new Error(`Record with id ${id} not found`);
            }else{
                const record = await this.knex(this.tableName).where(this.primaryKey, id);
                this.allowedFields = originalAllowedFields;
                return record;
            }
        } catch (error) {
            await this.reportError(error);
            console.error(`Error executing update: ${error.message}`);
            throw error;
        }
    }

    async delete(id) {
        let recordToDelete = await this.knex(this.tableName).where(this.primaryKey, id);
        const now = moment().tz(process.env.TZ).format("YYYY-MM-DD[T]HH:mm:ss.SSS");
        if (this.softDelete) {
            const originalAllowedFields = [...this.allowedFields];
            if (!this.allowedFields.includes('deletedAt')) {
                this.allowedFields.push('deletedAt');
            }
            try {
                const deletedData = { deletedAt: now };
                await this.update(id, deletedData);
                this.allowedFields = originalAllowedFields;
                return recordToDelete;
            } catch (error) {
                await this.reportError(error);
                console.error(`Error executing soft delete: ${error.message}`);
                throw error;
            }
        } else {
            try {
                await this.knex(this.tableName)
                    .where(this.primaryKey, id)
                    .del();
                return recordToDelete;
            } catch (error) {
                await this.reportError(error);
                console.error(`Error executing delete: ${error.message}`);
                throw error;
            }
        }
    }

    filterFields(data) {
        if (this.allowedFields.length === 0) {
            return data;
        }

        let filteredData = {};
        for (const field of this.allowedFields) {
            if (data.hasOwnProperty(field)) {
                filteredData[field] = data[field];
            }
        }

        return filteredData;
    }
}

module.exports = Service;