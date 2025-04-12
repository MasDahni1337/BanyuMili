const UsersModel = require("../Models/UsersModel");
class Controller {
    constructor() {
        /**
     * Simple Create new object just initiation with new YourModel()
     * @type {Object}
     */
        this.user = new UsersModel();
    }
}

module.exports = Controller;