const validator = require('validator');
const isEmpty = require('./isEmpty'); 

module.exports  = function validateRegisterInput(value){
    let errors = {};

    value.name = !isEmpty(value.name) ? value.name : '';
    value.email = !isEmpty(value.email) ? value.email : '';
    value.password = !isEmpty(value.password) ? value.password : '';
    value.password2 = !isEmpty(value.password2) ? value.password2 : '';

    if (validator.isEmpty(value.name)) {
        errors.name = 'Name is required'
    }

    if(!validator.isLength(value.name, {min : 2, max : 30})){
        errors.name = 'Name must be between 2 and 30 characters'
    }
    
    if(validator.isEmpty(value.email)){
        errors.email = 'Email is required'
    }
    if(!validator.isEmail(value.email)){
        errors.email = 'Invalid Email'
    }
    if(!validator.isLength(value.password, {min : 6, max : 12})){
        errors.password = 'Password must be between 6 and 12 characters'
    }
    if(validator.isEmpty(value.password)){
        errors.password = "Password is required"
    }
    if(validator.isEmpty(value.password2)){
        errors.password2 = "Confirm password is required"
    }
    if(!validator.equals(value.password, value.password2)){
        errors.password2 = "Both the passwords must match"
    }

    return {
        errors, 
        isValid : isEmpty(errors)
    }
}