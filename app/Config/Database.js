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
      database: 'database',
      username: 'username',
      password: 'password',
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        useUTC: false
      },
      timezone: '+07:00',
      redis:true,
      cacheTime: 3600,
    };

    if (os.platform() === 'linux' || os.platform() === 'darwin') {
      options.dialectOptions.socketPath = "/var/run/mysqld/mysqld.sock";
    }
    super(options);
  }
}

module.exports = Database;
