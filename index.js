const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const nodemailer = require('nodemailer');
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const bcrypt = require("bcrypt")
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');

const http = require('http');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const path = require('path');
const usersignup=require('./src/router/signuprouter')

const dotenv = require('dotenv');
const loginrouter = require('./src/router/loginroutes');
const walletrouter=require('./src/router/walletrouter');
dotenv.config()

const app = express();
const server = http.createServer(app)
const store = new MongoDBSession({
    uri: process.env.MONGO_URL,
    collection: "mySessionsss"
})

app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 3 * 60 * 60 * 1000
        }
    })
);
app.use(cookie())


app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());


app.use('/api/login', loginrouter);
app.use('/api/signup', usersignup);
app.use('/api/wallet',walletrouter);


server.listen(3000, async () => {
    console.log("Listening");
   mongoose.connect(process.env.MONGO_URL)
    console.log("Mongoose Connected");
})

