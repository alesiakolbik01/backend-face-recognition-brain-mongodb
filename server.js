import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import register from './controllers/register.js';
import profile from './controllers/profile.js';
import image from './controllers/image.js';
import signin from './controllers/signin.js';

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

app.post('/signin', (req, res) => { signin.handleSignIn(req, res, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, bcrypt, saltRounds) })

app.get('/profile/:id', (req, res) => { profile.handleGetProfile(req, res) })

app.put('/image', (req, res) => { image.incrimentEntries(req, res) })

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})


