import { dbConfig } from '../db-config.js';
import axios from 'axios';

const clarifaiDataInit = {
    API_KEY: '1df95d8e43544eeea5a8323f85dc6b24',
    PAT: '731e0f2f1e0d441eb082a581d4d40459',
    USER_ID: 'alesiakolbik',
    APP_ID: 'test-faces-recognition',
    MODEL_ID: 'face-detection',
    MODEL_VERSION_ID: '6dc7e46bc9124c5c8824be4822abe105'
  };

const checkUserExist = async (user) => {
    const data = JSON.stringify({
        "collection": "users",
        "database": "smart-brain-app",
        "dataSource": "Cluster0",
        "filter": {
            "email": user.email
        }
    });
        
    const config = {...dbConfig, data: data,  url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-wxsud/endpoint/data/v1/action/findOne'}

    return await axios(config)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });

}

const setUserToDB = async (user) => {

    const data = JSON.stringify({
        "collection": "users",
        "database": "smart-brain-app",
        "dataSource": "Cluster0",
        "document": user
    });
        
    var config = {...dbConfig, data: data,  url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-wxsud/endpoint/data/v1/action/insertOne'}
                
    return await axios(config)
        .then(function (response) {
            return {...response.data, status: "success"};
        })
        .catch(function (error) {
            console.log(error);
        });
}

const updateUserPfofile = async (userId) => {
    const userData = await getUserProfile(userId);
    if(!userData){
        return { matchedCount: 0, modifiedCount: 0 }
    }

    let newNumderReq = userData.entries + 1;
    const data = JSON.stringify({
        "collection": "users",
        "database": "smart-brain-app",
        "dataSource": "Cluster0",
        "filter": { "_id": { "$oid": userId } },
        "update": {
            "$set": {
                "entries": newNumderReq,
                "modified": Date()
            }
        }
    });
      
    const config = {...dbConfig, data: data,  url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-wxsud/endpoint/data/v1/action/updateOne'}

    return await axios(config)
        .then(function (response) {
            if(response.data.modifiedCount === 1){
                return {
                    status: "success",
                    entries: newNumderReq
                }
            }
            return { status: "error"};
        })
        .catch(function (error) {
            console.log(error);
        });
}

const getUserProfile = async (userId) => {
    const data = JSON.stringify({
        "collection": "users",
        "database": "smart-brain-app",
        "dataSource": "Cluster0",
        "filter": { "_id": { "$oid": userId } }
    });
      
    const config = {...dbConfig, data: data,  url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-wxsud/endpoint/data/v1/action/findOne'}

    return await axios(config)
        .then(function (response) {
            const data = response.data.document;
            return {
                status: "success",
                name: data.name,
                entries: data.entries,
                joined: data.joined
            };
        })
        .catch(function (error) {
            return {error: error};
        });
}

const signInUser = async (user, bcrypt) => {
   
    const data = JSON.stringify({
        "collection": "users",
        "database": "smart-brain-app",
        "dataSource": "Cluster0",
        "filter": {
            "email": user.email
        }
    });
    const config = {...dbConfig, data: data,  url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-wxsud/endpoint/data/v1/action/findOne'}

    return await axios(config)
        .then(function (response) {

            const userPassword = response.data.document.password;
            const isValid = bcrypt.compareSync(user.password, userPassword);
   
            if(isValid)
                return response.data;
            else
                throw new Error("user doesn't exist");    
        })
        .catch(function (error) {
            console.log(error);
        });
}

const getOptionsClarifai = (Imageurl) => {
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": clarifaiDataInit.USER_ID,
            "app_id": clarifaiDataInit.APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": Imageurl
                    }
                }
            }
        ]
    });

    return {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Key ' + clarifaiDataInit.PAT
        },
        data: raw,
        url: "https://api.clarifai.com/v2/models/" + clarifaiDataInit.MODEL_ID + "/versions/" + clarifaiDataInit.MODEL_VERSION_ID + "/outputs"
    };
}

const getClarifaiApiData = async (imageUrl) => {
    return await axios(getOptionsClarifai(imageUrl))
    .then(result => { return result.data })
    .catch(error => { return error });
}

export default {
    signInUser,
    getUserProfile,
    updateUserPfofile,
    checkUserExist,
    setUserToDB,
    getClarifaiApiData
}

