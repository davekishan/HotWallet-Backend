require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const router = express.Router();



const Web3 = require("web3");
const apikey = process.env["apiKey"];
// const network  =  'goerli';
const network = "sepolia";
// console.log(network);

const node = `https://${network}.infura.io/v3/${apikey}`;
const web3 = new Web3(node);
// console.log(web3)

// Create Random account address
const walletcreate = async () => {
  const accountTo = web3.eth.accounts.create();
  console.log(accountTo);
  console.log("This is New Generated Address:", accountTo.address);
  console.log("This is New Generated privateKey:", accountTo.privateKey);
  return accountTo;
};

router.get("/getemail") ,async (req,res) =>{
    try {
        console.log("working")
        res.send(req.session.email);
        
    } catch (error) {
        console.log("This is Error ++");
        console.log(error);
    }
}


router.post("/newwallet", async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const walletdata = await walletcreate();
    // console.log(walletdata);

    const wallet = new CollectionName({
      //change it to collection name as per it is
      email: req.user.email, 
      account: walletdata.address, 
      privatekey: walletdata.privateKey,
    });
    const savedwallet = await wallet.save();
    res.json(savedwallet);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});



// send transection
const privateKey = process.env["privateKey"];
// console.log("Here is your private key:",privateKey);

const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);
// console.log("This is From address:",accountFrom);

const createSignedTx = async (rawTx) => {
  try {
    rawTx.gas = await web3.eth.estimateGas(rawTx);
    // console.log(rawTx);
    const signedtx = await web3.eth.accounts.signTransaction(rawTx, privateKey); // sign transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedtx.rawTransaction
    ); // send signed transaction
    console.log("THIS IS RECEIPT");
    console.log(receipt);
    console.log("Done");
  } catch (error) {
    console.log("error ---------------------------");
    // console.log("This is error");
    console.log(error);
  }
};

// Convert Eth to Wei
// const amountTo = "0.0001"; //ether amount
// const rawTx = {
//   to: accountTo.address,
//   value: web3.utils.toWei(amountTo, "ether"),
// };

// createSignedTx(rawTx);
module.exports = router;
