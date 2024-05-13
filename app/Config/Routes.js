const express = require("express");
const App = require("../Config/App.js");
const group = require("routergroup");
/**
 * Express Routes class for defining API routes.
 * @class
 * @extends App
 */
class Routes extends App {
  /**
   * Constructs a new Routes object.
   * Creates a new instance of the UsersController and HomeController.
   */
  constructor() {
    super();
    this.user = new this.UsersController();
    this.home = new this.HomeController();
  }
  /**
   * Defines the routes for the API.
   * @returns {Routes} An instance of the Express router containing the defined routes.
   */
  defineRoutes() {
    const routes = express.Router();
    routes.get("/", this.home.index.bind(this.home));
    routes.use(group("/banyumili", routes => {
      routes.get("/welcome", this.home.test.bind(this.home));
    }));
    return routes;
  }
}

module.exports = Routes;