const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateExperienceInput(value) {
    let errors = {};

    value.title = !isEmpty(value.title) ? value.title : '';
    value.company = !isEmpty(value.company) ? value.company : '';
    value.from = !isEmpty(value.from) ? value.from : '';

    if (validator.isEmpty(value.title)) {
        errors.title = "title is required"
    }
    if (validator.isEmpty(value.company)) {
        errors.company = "company is required"
    }
    if (validator.isEmpty(value.from)) {
        errors.from = "From is required"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}