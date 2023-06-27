const express = require('express');
const cors = require('cors');
const UserSession = require('../module/SessionModel');
const userModel = require('../module/Usermodel');
const app = express();
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { createWallet,deposite,sendeth, transactionHistory } = require('../controller/wallet');
const userWallet = require('../module/wallet');
const ethers=require('ethers');
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
  if(account && value)
  {

    const user=await userWallet.findOne({email:req.session.email})
    console.log(req.session.email);
    console.log(user);
    const fun=await sendeth(user.walletAddress,account,value,req.session.email);
    
    res.json({success:true,message:"Send Ether Successfully..."})
  }
  else
  {
    res.json({success:false,message:"Something Went Wrong..."})
  }
 })


 walletrouter.get('/getinfo',async(req,res)=>{
  const user=await userWallet.findOne({email:req.session.email})

  if(req.session.email)
  {

    const network = 'sepolia' // use rinkeby testnet
    const provider =await ethers.getDefaultProvider(network)
    const balance=await provider.getBalance(user?.walletAddress)
    res.json({success:true,balance:balance.toString(),address:user.walletAddress})
  }
  else{
   res.json({success:false})

  }

  
 })


 walletrouter.get('/getallac',async(req,res)=>{
  const user=await userWallet.find({email:req.session.email})

  if(req.session.email)
  {
    res.json({success:true,user:user})
  }
  else{
   res.json({success:false})

  }
  
 })


 
 walletrouter.get('/gethistory',async(req,res)=>{
  if(req.session.email)
  {

    const user=await transactionHistory(req.session.email)
    res.json({success:true,history:user})
  }else{
    res.json({success:false,message:"No Transaction"})

  }
  
 })

module.exports = walletrouter;