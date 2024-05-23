const Database = require('./Database.js');
/**
 * Represents a database model that inherits from Database class.
 * @extends Database
 */
class Model extends Database{
      /**
     * Creates an instance of Model.
     * 
     * Initializes default values for instance properties:
     * - table to null
     * - primaryKey to 'id'
     * - allowedFields to an empty array
     * - returnType to 'object'
     * - timestamps to false
     * - softDelete to false
     */
      constructor(configName = 'default'){
        super(configName);
        this.setTable(null);
        this.setPrimaryKey('id');
        this.setAllowedFields([]);
        this.setTimestamps(false);
        this.setSoftDelete(false);
    }
}

module.exports = Model;