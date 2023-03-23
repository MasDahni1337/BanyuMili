const fs = require("fs");
const path = require("path");

/**
 * The App class is responsible for loading all the controllers, models, configuration files,
 * helper functions and libraries used by the application.
 */
class App {
   /**
   * Creates an instance of the App class.
   */
  constructor() {
    this.loadController();
    this.loadModels();
    this.loadConfig();
    this.loadHelper();
    this.loadLibraries();
  }
  /**
   * Loads all the controllers from the Controllers directory and adds them to the App instance.
   */
  loadController() {
    const controlDir = path.resolve(__dirname, "..", "Controllers");
    fs.readdirSync(controlDir).forEach((file) => {
      if (file.endsWith(".js")) {
        const control = require(path.join(controlDir, file));
        const controlName = path.basename(file, ".js");
        this[controlName] = control;
      }
    });
  }
   /**
   * Loads all the models from the Models directory and adds them to the App instance.
   */
  loadModels() {
    const modelsDir = path.resolve(__dirname, "..", "Models");
    fs.readdirSync(modelsDir).forEach((file) => {
      if (file.endsWith(".js")) {
        const model = require(path.join(modelsDir, file));
        const modelName = path.basename(file, ".js");
        this[modelName] = model;
      }
    });
  }
  
  /**
   * Loads all the configuration files from the current directory and adds them to the App instance.
   */
  loadConfig() {
    const configDir = path.join(__dirname);
    fs.readdirSync(configDir).forEach((file) => {
      if (file.endsWith(".js")) {
        const config = require(path.join(configDir, file));
        const configName = path.basename(file, ".js");
        this[configName] = config;
      }
    });
  }
  /**
   * Loads all the helper functions from the Helpers directory and adds them to the App instance.
   */
  loadHelper(){
    const helperDir = path.resolve(__dirname, "..", "Helpers");
    fs.readdirSync(helperDir).forEach((file) => {
      if (file.endsWith(".js")) {
        const helper = require(path.join(helperDir, file));
        const helperName = path.basename(file, ".js");
        this[helperName] = helper;
      }
    });
  }
  /**
   * Loads all the helper functions from the Helpers directory and adds them to the App instance.
   */
  loadLibraries(){
    const libraryDir = path.resolve(__dirname, "..", "Libraries");
    fs.readdirSync(libraryDir).forEach((file) => {
      if (file.endsWith(".js")) {
        const library = require(path.join(libraryDir, file));
        const libraryName = path.basename(file, ".js");
        this[libraryName] = library;
      }
    });
  }
}

module.exports = App;