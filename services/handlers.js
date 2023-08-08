import { dbConfig } from '../db-config.js';
import axios from 'axios';

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

export default {
    signInUser,
    getUserProfile,
    updateUserPfofile,
    checkUserExist,
    setUserToDB
}