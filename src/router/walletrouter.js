const express = require('express');
const cors = require('cors');
const UserSession = require('../module/SessionModel');
const userModel = require('../module/Usermodel');
const app = express();
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { callfun } = require('../controller/wallet');
dotenv.config();

app.use(express.json());
app.use(cors());


const walletrouter = express.Router();

walletrouter.get('/checkemail',async (req, res) => {
   const fun=await callfun(req.session.email);
   console.log(fun);
   res.json({success:true})
  })

module.exports = walletrouter;