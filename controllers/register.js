import handlers from '../services/handlers.js';
import validateRegisterInput from '../validation/register.js';

const handleRegister = async (req, res, bcrypt, saltRounds) => {
    const userData = req.body;
    const { errors, isValid } = validateRegisterInput(userData);

    if(!isValid){
        return res.status(400).json({error: errors.message})
    }

    const existUser = await handlers.checkUserExist(userData);

    if(existUser.document){
        res.status(400).json({error: "user alredy exist"})
    }
    else
    {
        userData.entries = 0;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(userData.password, salt);
        userData.password = hash;
        userData.createdDate = Date();
        const resData = await handlers.setUserToDB(userData);
        res.json(resData);
    }
}


export default {
    handleRegister
}
