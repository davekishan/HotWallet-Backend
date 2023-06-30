const express = require('express');
const cors = require('cors');
const UserSession = require('../module/SessionModel');
const userModel = require('../module/Usermodel');
const app = express();
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userWallet = require('../module/wallet');
const { sendtoMaster, functioncall } = require('../controller/wallet');
dotenv.config();

app.use(express.json());
app.use(cors());

const loginrouter = express.Router();



loginrouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.find({ "email": email });

  const session = await UserSession.find({ "email": email });

  console.log(user)
  if (user[0]?.status == 1) {

    if (user[0]?.email == email && bcrypt.compareSync(password, user[0].password)) {

      req.session.isAuth = true;
      req.session.email = email;
      

      const token = jwt.sign({ 'email': email }, process.env.JWT_KEY)
      const sessionmod = await UserSession.findOneAndUpdate({ "email": email }, { "jwt_id": token })
      const passwordHash = bcrypt.hashSync(password, 10);

      res.cookie('jwt', token, { httpOnly: true, expires: 0 })

      res.json({ success: true, message: "Login SuccessFully" })


    } else {
      res.json({ success: false, message: "Invalid Creadential" })
    }
  }
  else {
    res.json({ success: false, message: "Please Verify Your Email" })
  }
})

loginrouter.get('/logout', async (req, res) => {
  req.session.destroy();
  res.clearCookie("jwt");
  res.json({ success: true, message: "You Are Logged Out" })
})

loginrouter.get('/usernow', (req, res) => {
  res.json({ 'email': req.session.email });
})

loginrouter.get('/checksession', (req, res) => {
  if (req.session.isAuth) {
    res.json({ success: true })
  }
  else {
    res.json({ success: false })

  }
})

loginrouter.post('/adminlogin', (req, res) => {
  const { email, password } = req.body;
  if (email == "kishan.dave@minddeft.net" && password == "1234") { 
    req.session.email = email;
    
    res.json({ success: true })
  } else {
    res.json({ success: false })

  }
})


loginrouter.get('/sendtomaster',async (req,res)=>{
  const email=req?.session?.email;
  const resp=await functioncall(email)
  console.log(resp)
  res.json({success: resp})
})


module.exports = loginrouter;