import handlers from '../services/handlers.js';
import validateImageInput from '../validation/image.js';

const handleGetClarifai = async (req, res) => {
    const { imageUrl } = req.body;
    const { errors, isValid} = validateImageInput(imageUrl);

    if(!isValid){
        res.status(400).json({error: errors.message})
    }

    try{
        const data = await handlers.getClarifaiApiData(imageUrl);
        res.json(data);
    }
    catch(error){
        res.status(400).json(error)
    }

}

export default {
    handleGetClarifai
}