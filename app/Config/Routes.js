const express = require("express");
const group = require("routergroup");
const Routing = require("./Routing");

/**
 * Routes class for defining API endpoints.
 * Extends the base Routing class to organize API route definitions.
 *
 * @class
 * @extends Routing
 */
class Routes extends Routing {
  /**
   * Register API routes.
   *
   * @returns {express.Router} Configured Express router instance with all defined routes.
   */
  defineRoutes() {
    const routes = express.Router();

    // Root Route
    routes.get("/", this.home.index.bind(this.home));

    // Grouped Routes
    routes.use(group("/banyumili", (router) => {
      router.get("/welcome", this.home.test.bind(this.home));
    }));

    return routes;
  }
}

module.exports = Routes;
