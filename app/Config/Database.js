const Service = require('./Service.js');
/**
 * Represents a database service.
 * @class
 * @extends Service
 */

class Database extends Service {
    /**
     * Creates an instance of Database.
     * @memberof Database
     */
    constructor() {
        /**
         * change host with your host
         * change user with your username mysql
         * change password with your password mysql
         * change database with your database
         * @type {Object}
         */
        const options = {
            client: 'mysql2',
            connection: {
                host: 'localhost',
                user: 'username',
                password: 'password',
                database: 'database',
                timezone: '+07:00',
                charset: 'utf8',
                socketPath: '/var/run/mysqld/mysqld.sock'
            },
            pool: { 
              min: 0, 
              max: 7,
              acquireTimeoutMillis: 10000,
              createTimeoutMillis: 10000,
              idleTimeoutMillis: 120000,
              reapIntervalMillis: 10000, 
            }
          };
        super(options);
    }
}

module.exports = Database;
