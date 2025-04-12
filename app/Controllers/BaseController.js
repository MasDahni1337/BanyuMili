const Controller = require("./Controller");
const Validation = require("../Config/Validation.js");
/**
 * BaseController provides common functionality shared across all controllers.
 * Inherits from the main Controller class.
 *
 * @extends Controller
 */
class BaseController extends Controller {
    constructor() {
        super();
    }

    /**
     * Create a new Validation instance with specified rules.
     *
     * @param {Object} rules - Validation rules.
     * @returns {Validation} Validation instance.
     */
    valid(rules) {
        return new Validation(rules);
    }
}

module.exports = BaseController;
