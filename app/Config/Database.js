const os = require('os');
const Service = require('./Service.js');

/**
 * Represents a database service.
 * @class
 * @extends Service
 */
class Database extends Service {
  /**
   * Default configurations for the database.
   * @type {Object}
   * @memberof Database
   */
  static configurations = {
    default: {
      client: 'mysql2',
      debug: true,
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
      },
    },
    namedOption: {
      client: 'mysql2',
      debug: true,
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
      },
    },
  };

  /**
   * Creates an instance of Database.
   * @param {string} [optionName='default'] - The configuration option to use.
   * @memberof Database
   */
  constructor(optionName = 'default') {
    const options = Database.configurations[optionName];
    if (os.platform() === 'linux' || os.platform() === 'darwin') {
      options.connection.socketPath = '/var/run/mysqld/mysqld.sock';
    }
    super(options);
  }
}

module.exports = Database;
