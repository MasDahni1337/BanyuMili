const os = require('os');
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
      debug: false,
      connection: {
        host: 'localhost',
        user: 'username',
        password: 'password',
        database: 'database',
        timezone: '+07:00',
        charset: 'utf8',
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
    if (os.platform() === 'linux' || os.platform() === 'darwin') {
      options.connection.socketPath = "/var/run/mysqld/mysqld.sock";
    }

    super(options);
  }
}

module.exports = Database;
