const UsersController = require("../Controllers/UsersController");
const HomeController = require("../Controllers/HomeController");
class Routing {
    /**
     * Express Routes class for defining API routes.
     * @class
     * @extends Routing
     */
    constructor() {
        this.user = new UsersController();
        this.home = new HomeController();
    }
}

module.exports = Routing;