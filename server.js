import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { dbConfig } from './db-config.js';
import bcrypt from 'bcrypt';
import cors from 'cors';

const saltRounds = 10;

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



app.get('/', (req, res) => {
    res.json({status: 'it\'s working'});
})

app.post('/signin', async (req, res) => {
    const userData = req.body;
    const result = await signInUser(userData);
    if(result && result.document){
        res.json({status: "success", userId: result.document._id});
    }
    else{
        res.status(400).json({error: "user doesn't exist"})
    }
})

app.post('/register', async (req, res) => {
    const userData = req.body;
    const existUser = await checkUserExist(userData);
    if(existUser.document){
        res.json({error: "user alredy exist"})
    }
    else
    {
        userData.entries = 0;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(userData.password, salt);
        userData.password = hash;
        userData.createdDate = Date();
        const resData = await setUserToDB(userData);
        res.json(resData);
    }
})

app.get('/profile/:id', async (req, res) => {
    const user = req.params;
    const userData = await getUserProfile(user.id);
    if(userData.status === "success"){
        res.json(userData);
    }
    else
    {
        res.status(400).json({error: 'profile is not found'})
    }
})

app.put('/image', async(req, res) => {
    const userId = req.body.id;
    const dataResult = await updateUserPfofile(userId);

    if(dataResult.status === "success"){
        res.json(dataResult);
    }
    else
    {
        res.status(400).json({error: 'profile is not found'})
    }
})

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})

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

const signInUser = async (user) => {
   
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

