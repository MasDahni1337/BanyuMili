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
    this.loadFilters();
  }
  /**
   * Loads all the controllers from the Controllers directory and adds them to the App instance.
   */
  loadController() {
    const controlDir = path.resolve(__dirname, "..", "Controllers");
    const loadFiles = (dir) => {
      fs.readdirSync(dir).forEach((item) => {
          const fullPath = path.join(dir, item);
          if (fs.statSync(fullPath).isDirectory()) {
              loadFiles(fullPath);
          } else if (item.endsWith('.js')) {
              const control = require(fullPath);
              const controlName = path.basename(item, '.js');
              this[controlName] = control;
          }
      });
    };
    loadFiles(controlDir);
  }
   /**
   * Loads all the models from the Models directory and adds them to the App instance.
   */
  loadModels() {
    const modelsDir = path.resolve(__dirname, "..", "Models");
    const loadFiles = (dir) => {
      fs.readdirSync(dir).forEach((item) => {
          const fullPath = path.join(dir, item);
          if (fs.statSync(fullPath).isDirectory()) {
              loadFiles(fullPath);
          } else if (item.endsWith('.js')) {
              const model = require(fullPath);
              const modelName = path.basename(item, '.js');
              this[modelName] = model;
          }
      });
  };

  loadFiles(modelsDir);
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
   * Loads all the helper functions from the Libraries directory and adds them to the App instance.
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
   /**
   * Loads all the helper functions from the Filters directory and adds them to the App instance.
   */
  loadFilters(){
    const filterDir = path.resolve(__dirname, "..", "Filters");
    fs.readdirSync(filterDir).forEach((file) => {
      if (file.endsWith(".js")) {
        const filter = require(path.join(filterDir, file));
        const filterName = path.basename(file, ".js");
        this[filterName] = filter;
      }
    });
  }
}

module.exports = App;