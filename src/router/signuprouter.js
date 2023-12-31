const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const userModel = require('../module/Usermodel');
const UserSession = require('../module/SessionModel');
const { otpMail } = require('../controller/mail');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());



const signuprouter = express.Router();



signuprouter.post('/signup', async (req, res) => {
  const {username,email,password} = req.body;
  console.log(username,email,password);
  const passwordHash = bcrypt.hashSync(password, 10);

  const checkUserExists = await userModel.findOne({ "email": email })
  console.log(checkUserExists);
  var otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  console.log(otp);

  if (checkUserExists === null) {
    const adduser = userModel({ userName: username, email: email, password: passwordHash,status:0 })
    await adduser.save()
    req.session.isAuth = true;
    req.session.email = email;
    const confirmationCode = otp;
    req.session.otp = confirmationCode;
    await otpMail(email, confirmationCode);
    res.json(true)
  } else {
    res.json(false);
  }
})

signuprouter.post('/verifyotp', async (req, res) => {
  const { otp } = req.body;
  if (otp == req.session.otp) {
    const email = req.session.email;
    const token = jwt.sign({ email }, process.env.JWT_KEY)
    res.cookie('jwt', token, { httpOnly: true, expires: 0 })
    const userses = new UserSession({ email: email, jwt_id: token });
    await userses.save();

    const user = await userModel.findOneAndUpdate({ "email": email }, { "status": 1 })
    res.json({ success: true, message: "Account Verifyed Successfully" })
  } else {
    res.json({ success: false, message: "Wrong Otp" })

  }
})

module.exports = signuprouter;