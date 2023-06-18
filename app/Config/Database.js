const mysql = require('mysql2/promise');
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
      database: 'database',
      username: 'username',
      password: 'password',
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        socketPath: "/var/run/mysqld/mysqld.sock",
        useUTC: false
      },
      timezone: '+08:00'
    };
    super(options);
  }
}

module.exports = Database;
