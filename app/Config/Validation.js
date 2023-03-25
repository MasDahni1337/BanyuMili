const validator = require('validator');
const Database = require('./Database.js');
/**
 * Class representing a validation object.
 * @class
 */
class Validation extends Database{
  /**
   * Create a validation object.
   * @constructor
   * @param {object} rules - The rules to be used for validation.
   */
    constructor(rules) {
      super();
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
          Object.keys(this.rules).forEach(async (key) => {
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
            } else if (this.rules[key].valid_json && !validator.isJSON(value)) {
              errors.push(`${key} must be a valid JSON string`);
            } else if (this.rules[key].valid_url && !validator.isURL(value)) {
              errors.push(`${key} must be a valid URL`);
            } else if (this.rules[key].valid_ip && !validator.isIP(value)) {
              errors.push(`${key} must be a valid IP address`);
            } else if (this.rules[key].alpha_dash && !validator.isAlpha(value.replace(/-/g, ""))) {
              errors.push(`${key} must contain only letters, numbers, and dashes`);
            } else if (this.rules[key].alpha_space && !validator.isAlpha(value.replace(/\s/g, ""))) {
              errors.push(`${key} must contain only letters and spaces`);
            } else if (this.rules[key].alpha_numeric_punct && !validator.isAlphanumeric(value.replace(/[^\w\s,.?!]/g, ""))) {
              errors.push(`${key} must contain only letters, numbers, and punctuation marks`);
            } else if (this.rules[key].regex_match && !validator.matches(value, this.rules[key].regex_match)) {
              errors.push(`${key} is not in the correct format`);
            } else if (this.rules[key].valid_date && !validator.isDate(value)) {
              errors.push(`${key} must be a valid date`);
            } else if (this.rules[key].valid_cc_number && !validator.isCreditCard(value)) {
              errors.push(`${key} must be a valid credit card number`);
            }else if (rules.is_unique) {
              const [table, column] = rules.is_unique.split(".");
              const id = params.id || null;
              const query = `SELECT COUNT(*) as count FROM ${table} WHERE ${column} = ? ${id ? `AND id != ${id}` : ''}`;
              const result = await this.query(query, [value]);
              if (result[0].count > 0) {
                errors.push(`${key} already exists`);
              }
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