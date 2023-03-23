const express = require("express");
const App = require("../Config/App.js");
/**
 * Express Routes class for defining API routes.
 * @class
 * @extends App
 */
class Routes extends App {
  /**
   * Constructs a new Routes object.
   * Creates a new instance of the UsersController.
   */
  constructor() {
    super();
    this.user = new this.UsersController();
  }
  /**
   * Defines the routes for the API.
   * @returns {Router} An instance of the Express router containing the defined routes.
   */
  defineRoutes() {
    const routes = express.Router();

    routes.get("/test", this.user.testUser.bind(this.user));
    routes.post("/testPost", this.user.createUser.bind(this.user));

    return routes;
  }
}

module.exports = Routes;