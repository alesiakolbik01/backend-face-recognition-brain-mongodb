import handlers from '../services/handlers.js';

const incrimentEntries = async(req, res) => {
    const userId = req.body.id;
    const dataResult = await handlers.updateUserPfofile(userId);

    if(dataResult.status === "success"){
        res.json(dataResult);
    }
    else
    {
        res.status(400).json({error: 'profile is not found'})
    }
}

export default {
    incrimentEntries
}