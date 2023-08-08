import handlers from '../services/handlers.js';

const handleGetProfile = async (req, res) => {
    const user = req.params;
    const userData = await handlers.getUserProfile(user.id);
    if(userData.status === "success"){
        res.json(userData);
    }
    else
    {
        res.status(400).json({error: 'profile is not found'})
    }
}

export default {
    handleGetProfile
}
