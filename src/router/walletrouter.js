const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const {
  createWallet,
  deposite,
  sendeth,
  transactionHistory,
} = require("../controller/wallet");
const userWallet = require("../module/wallet");
const ethers = require("ethers");
dotenv.config();

app.use(express.json());
app.use(cors());

const walletrouter = express.Router();

walletrouter.get("/createwallet", async (req, res) => {
  const fun = await createWallet(req.session.email);
  console.log(fun);
  res.json({
    success: true,
    message: "Account Created..",
    address: fun.address,
  });
});

walletrouter.post("/deposite", async (req, res) => {
  const { account, value } = req.body;
  const fun = await deposite(account, value, req.session.email);
  console.log(fun);
  res.json({ success: true, message: "Deposite Ether...." });
});

walletrouter.post("/sendeth", async (req, res) => {
  const { account, value, from, chain } = req.body;
  console.log(account, value, from, chain);
  var message;
  if (account && value && from && chain) {
    message = await sendeth(from, account, value, req.session.email, chain);

    res.json({
      success: true,
      message: message.message,
      hash: message.receipt,
      chain: chain,
    });
  } else {
    res.json({ success: false, message: "Something Went Wrong..." });
  }
});

walletrouter.get("/getinfo", async (req, res) => {
  const user = await userWallet.findOne({ email: req.session.email });

  if (req.session.email) {
    const network = "sepolia"; // use rinkeby testnet
    const provider = await ethers.getDefaultProvider(network);
    const balance = await provider.getBalance(user?.walletAddress);
    res.json({
      success: true,
      balance: balance.toString(),
      address: user.walletAddress,
    });
  } else {
    res.json({ success: false });
  }
});

walletrouter.get("/getallac", async (req, res) => {
  const user = await userWallet.find({ email: req.session.email });

  if (req.session.email) {
    res.json({ success: true, user: user });
  } else {
    res.json({ success: false });
  }
});

walletrouter.get("/gethistory/:address", async (req, res) => {
  console.log(req.params.address);
  if (req.session.email) {
    const user = await transactionHistory(req.params.address);
    res.json({ success: true, history: user });
  } else {
    res.json({ success: false, message: "No Transaction" });
  }
});

walletrouter.get("/getbalance/:address", async (req, res) => {
  if (req.session.email) {
    const user = await userWallet.findOne({
      email: req.session.email,
      walletAddress: req.params.address,
    });
    res.json({ success: true, balance: user.balance });
  } else {
    res.json({ success: false, message: "No Balance" });
  }
});

module.exports = walletrouter;
