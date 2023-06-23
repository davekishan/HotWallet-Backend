const express = require('express');
const cors = require('cors');
const UserSession = require('../module/SessionModel');
const userModel = require('../module/Usermodel');
const app = express();
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { callfun,  create_wallet } = require('../controller/wallet');
const { createWallet,deposite,sendeth } = require('../controller/wallet');
const userWallet = require('../module/wallet');
dotenv.config();

let account;
app.use(express.json());
app.use(cors());


const walletrouter = express.Router();
walletrouter.get('/sendeth',async (req, res) => {
    email = req.session.email
  
   console.log("wallet router response");
   const fun= callfun(account,email);
  //  console.log(fun);
   res.json({success:true})
   
  })
walletrouter.get('/createwallet',async (req, res) => {
    email = req.session.email
  
   console.log("wallet router response");
   const fun= await create_wallet(email);
   account =await fun;
   console.log("VG");
   console.log(fun);
   res.json({success:true})
   
  })
//test
module.exports = walletrouter;