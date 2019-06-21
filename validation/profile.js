const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateProfileInput(value) {
    let errors = {};

    value.handle = !isEmpty(value.handle) ? value.handle : '';
    value.status = !isEmpty(value.status) ? value.status : '';
    value.skills = !isEmpty(value.skills) ? value.skills : '';
    
    if(!validator.isLength(value.handle, {min : 2, max : 40})){
        errors.handle = "Handle needs to have at least 2 and maximum of 40 characters"
    }
    if(validator.isEmpty(value.handle)){
        errors.handle = "Handle is required"
    }
    if(validator.isEmpty(value.status)){
        errors.status = "Status is required"
    }
    if(validator.isEmpty(value.skills)){
        errors.skills = "Skills are required"
    }
    if(!isEmpty(value.website)) {
        if(!validator.isURL(value.website)){
            errors.website = "Not a valid URL"
        }
    }
    if(!isEmpty(value.facebook)) {
        if(!validator.isURL(value.facebook)){
            errors.facebook = "Not a valid URL"
        }
    }
    if(!isEmpty(value.instagram)) {
        if(!validator.isURL(value.instagram)){
            errors.instagram = "Not a valid URL"
        }
    }
    if(!isEmpty(value.linkedin)) {
        if(!validator.isURL(value.linkedin)){
            errors.linkedin = "Not a valid URL"
        }
    }
    if(!isEmpty(value.youtube)) {
        if(!validator.isURL(value.youtube)){
            errors.youtube = "Not a valid URL"
        }
    }
    if(!isEmpty(value.twitter)) {
        if(!validator.isURL(value.twitter)){
            errors.twitter = "Not a valid URL"
        }
    }

    return {
        errors,
        isValid : isEmpty(errors)
    };
};
