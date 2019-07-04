const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(value) {
    let errors = {};
    
    value.email = !isEmpty(value.email) ? value.email : '';
    value.password = !isEmpty(value.password) ? value.password : '';

    if (validator.isEmpty(value.email)) {
      errors.email = "Invalid Email";
    }

    if (!validator.isEmail(value.email)) {
        errors.email = 'Email is required'
    }
    
    if (validator.isEmpty(value.password)) {
        errors.password = "Password is required"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}