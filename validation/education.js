const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateEducationInput(value){
    let errors = {};

    value.school = !isEmpty(value.school) ? value.school : '';
    value.degree = !isEmpty(value.degree) ? value.degree : '';
    value.fieldofstudy = !isEmpty(value.fieldofstudy) ? value.fieldofstudy : '';
    value.from = !isEmpty(value.from) ? value.from : '';

    if(validator.isEmpty(value.school)){
        errors.school = "School is required"
    }
    if(validator.isEmpty(value.degree)){
        errors.degree = "degree is required"
    }
    if(validator.isEmpty(value.fieldofstudy)){
        errors.fieldofstudy = "Field of Study is required"
    }
    if(validator.isEmpty(value.from)){
        errors.from = "From is required"
    }

    return {
        errors, 
        isValid : isEmpty(errors)
    }
}