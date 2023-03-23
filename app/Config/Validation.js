const validator = require('validator');
/**
 * Class representing a validation object.
 * @class
 */
class Validation {
  /**
   * Create a validation object.
   * @constructor
   * @param {object} rules - The rules to be used for validation.
   */
    constructor(rules) {
      this.rules = rules || {};
    }
     /**
   * Check if the given request passes validation.
   * @returns {Function} - A middleware function to be used for validation.
   */
    check() {
      return async (req, res, next) => {
        try {
          const errors = [];
          if (!this.rules) {
            throw new Error("Validation rules are not defined");
          }
          Object.keys(this.rules).forEach((key) => {
            const value = req.body[key];
            if (this.rules[key].required && (!value || value.length === 0)) {
              errors.push(`${key} is required`);
            } else if (this.rules[key].minLength && value.length < this.rules[key].minLength) {
              errors.push(`${key} must be at least ${this.rules[key].minLength} characters long`);
            }else if (this.rules[key].is_email && !validator.isEmail(value)) {
                errors.push(`${key} must be a valid email address`);
            } else if (this.rules[key].alpha_numeric && !validator.isAlphanumeric(value)) {
                errors.push(`${key} must contain only letters and numbers`);
            } else if (this.rules[key].alpha_numeric_space && !validator.isAlphanumeric(value.replace(/\s/g, ""))) {
                errors.push(`${key} must contain only letters, numbers, and spaces`);
            }
          });
          if (errors.length === 0) {
            next();
          } else {
            return errors;
          }
        } catch (error) {
            return error.message;
        }
      };
    }
  }
  
  module.exports = Validation;