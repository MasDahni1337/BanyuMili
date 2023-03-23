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
     * The MySQL database connection pool.
     * change host with your host
     * change user with your username mysql
     * change password with your password mysql
     * change database with your database
     * @type {Object}
     */
    const pool = mysql.createPool({
      connectionLimit: 10,
      host: 'localhost',
      user: 'username',
      password: 'password',
      database: 'database'
    });
    super(pool);
  }
}

module.exports = Database;