import handlers from "../services/handlers.js";
import validateSignInInput from '../validation/signin.js';

const handleSignIn = async (req, res, bcrypt) => {
    const userData = req.body;
    const { errors, isValid } = validateSignInInput(userData);
  
    if(!isValid){
        return res.status(400).json({error: errors.message})
    }

    const result = await handlers.signInUser(userData, bcrypt);
    
    if(result && result.document){
        res.json({status: "success", userId: result.document._id});
    }
    else{
        res.status(400).json({error: "user doesn't exist"})
    }
}

export default {
    handleSignIn
}