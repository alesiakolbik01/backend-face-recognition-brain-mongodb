import isEmpty from './is-empty.js';

export default function validateSignInInput(data) {
    const errors = {};

    if( isEmpty(data.password) || isEmpty(data.email) )  {
        errors.message = "all fields should be filled";
    }
 
    return {
        errors,
        isValid: isEmpty(errors)
    }
}