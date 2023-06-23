const express = require('express');
const cors = require('cors');
const UserSession = require('../module/SessionModel');
const userModel = require('../module/Usermodel');
const app = express();
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { createWallet,deposite,sendeth } = require('../controller/wallet');
const userWallet = require('../module/wallet');
dotenv.config();

app.use(express.json());
app.use(cors());


const walletrouter = express.Router();

walletrouter.get('/createwallet',async (req, res) => {
   const fun=await createWallet(req.session.email);
   console.log(fun);
   res.json({success:true,message:"Account Created.."})
  })

  
walletrouter.post('/deposite',async (req, res) => {
  const {account,value}=req.body;
  const fun=await deposite(account,value,req.session.email);
  console.log(fun);
  res.json({success:true,message:"Deposite Ether...."})
 })

 
walletrouter.post('/sendeth',async (req, res) => {
  const {account,value}=req.body;
  const user=await userWallet.findOne({email:req.session.email})
  console.log(req.session.email);
  console.log(user);
  const fun=await sendeth(user.walletAddress,account,value,req.session.email);
  
  res.json({success:true,message:"Send Ether Successfully..."})
 })

module.exports = walletrouter;