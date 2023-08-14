import isEmpty from './is-empty.js';

export default function validateRegisterInput(data) {
    const errors = {};

    if( isEmpty(data.password) || isEmpty(data.name) || isEmpty(data.email) )  {
        errors.message = "all fields should be filled";
    }
 
    return {
        errors,
        isValid: isEmpty(errors)
    }
}