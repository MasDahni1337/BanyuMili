const App = require("../Config/App.js");
/**
 * BaseController class.
 * @extends App
 */
class BaseController extends App{
    /**
   * Creates an instance of BaseController.
   * @memberof BaseController
   */
    constructor() {
        super();
        /**
     * Simple Create new object just initiation with new this.YourModel()
     * @type {Object}
     */
        this.user = new this.UsersModel();
        this.mahasiswa = new this.MahasiswaModel();
    }
     /**
   * Returns a new instance of the Validation class with specified validation rules.
   * @param {Object} rules - Validation rules to apply.
   * @returns {Object} - A new instance of the Validation class.
   */
    valid(rules) {
        return new this.Validation(rules);
    };
}

module.exports = BaseController;