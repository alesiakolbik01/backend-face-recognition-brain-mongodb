import isEmpty from './is-empty.js';

export default function validateImageInput(imageUrl) {
    const errors = {};

    if(isEmpty(imageUrl) )  {
        errors.message = "image url not valid";
    }
 
    return {
        errors,
        isValid: isEmpty(errors)
    }
}