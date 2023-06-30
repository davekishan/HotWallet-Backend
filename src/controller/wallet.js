const Moralis = require("moralis").default;
require("dotenv").config();
const ethers = require("ethers")

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});
// console.log("this is moralis api key:", process.env.MORALIS_API_KEY);

const Web3 = require("web3");
const userWallet = require("../module/wallet");
const userModel = require("../module/Usermodel");
const { findOneAndUpdate } = require("../module/SessionModel");
const apikey = process.env["apiKey"];
// console.log(apikey)
// const network  =  'goerli';
// const network = "sepolia";
const network = "polygon-mumbai";
const Master = "0x61C76e3a478461378c4f0157Cd0882088Fb5a88d"//master wallet
// const node = `https://polygon-mumbai.infura.io/v3/fbae842a3a8643d0bf23c966f4e35325`;
const node = `https://${network}.infura.io/v3/${apikey}`;
const web3 = new Web3(node);

// Create Random account address
let account1;

// const abc = async() => {
//     const a = await createWallet();
//     console.log("a is");
//     console.log(a);
// }

// console.log("Here is your private key:",privateKey);

const amountTo = "0.00001"; //ether amount

const createSignedTx = async (account, email) => {
  try {
    // console.log(await rawTx.gas);
    const rawTx = {
      to: account1.address,
      value: web3.utils.toWei(amountTo, "ether"),
      gas: 200000,
    };
    // rawTx.gas = await web3.eth.estimateGas(rawTx);
    const userwallet = userWallet({
      email: email,
      walletAdddress: account1.address,
      privatekey: account1.privateKey,
    });
    userwallet.save();
    const signedtx = await web3.eth.accounts.signTransaction(
      rawTx,
      account.privatekey
    ); // sign transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedtx.rawTransaction
    ); // send signed transaction
    console.log("THIS IS RECEIPT:", receipt);
    console.log("Done");

    return receipt;
  } catch (error) {
    console.log("error ---------------------------");
    // console.log("This is error");
    console.log(error);
    return "Error";
  }
};

const deposite = async (account, amount, email) => {
  const rawTx1 = {
    to: account,
    value: web3.utils.toWei(amount, "ether"),
  };

  const estimatefees = web3.eth.estimateGas(rawTx1);

  const rawTx = {
    to: account,
    value: web3.utils.toWei(amount, "ether"),
    gas: estimatefees,
  }; // sign transaction

  const signedtx = await web3.eth.accounts.signTransaction(rawTx, privateKey); // sign transaction
  const receipt = await web3.eth.sendSignedTransaction(signedtx.rawTransaction); // send signed transaction
  await userWallet.findOneAndUpdate(
    { email: email, walletAddress: account },
    { $inc: { balance: +amount } }
  );
  console.log(receipt);
  console.log("Done");

  // console.log("This is error");
  console.log(error);
  return "Error";
};

const createWallet = (email) => {
  const accountTo = web3.eth.accounts.create();
  console.log(accountTo);
  const userwallet = userWallet({
    email: email,
    walletAddress: accountTo.address,
    privatekey: accountTo.privateKey,
    balance: 0,
  });
  userwallet.save();
  return true;
};
let receipt1;

const sendeth = async (from, to, value1, email, chain) => {
  var node;
  var network;
  if (chain == "0xaa36a7") {
    network = "sepolia";
    node = `https://${network}.infura.io/v3/${process.env["apiKeySepolia"]}`;

  } else if (chain == "0x13881") {
    network = "polygon-mumbai";
    node = `https://${network}.infura.io/v3/${process.env["apiKeyPolygon"]}`;
  }
  const web3 = new Web3(node);

  const account = await userWallet.findOne({
    email: email,
    walletAddress: from,
  });
  const value = web3.utils.toWei(value1, "ether");
  const rawTx1 = {
    to: to,
    value: value,
  };

  const estimatefees = await web3.eth.estimateGas(rawTx1);

  const rawTx = {
    to: to,
    value: value,
    gas: estimatefees,
  };
  console.log("Fees is :", estimatefees, "value is :", value);
  console.log(parseInt(estimatefees) + parseInt(value));

  console.log(account);

  if (
    web3.utils.toWei(account?.balance.toString(), "ether") >
    parseInt(estimatefees) + parseInt(value)
  ) {
    const signedtx = await web3.eth.accounts.signTransaction(
      rawTx,
      account.privatekey
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedtx.rawTransaction
    );
    console.log("receipt");

    await userWallet.findOneAndUpdate(
      { email: email, walletAdddress: account },
      { $inc: { balance: -value } }
    );

    console.log(receipt);
    console.log("This is transaction hash: ", receipt.transactionHash);
    console.log("Done");
    receipt1 = receipt;
    return { receipt: receipt.transactionHash, message: "Transaction Complete" };
  } else {
    return { receipt: "", message: "Balance Is Low" };
  }
};


const sendtoMaster = async (email,walletAddress) => {
  const network = "sepolia";
  const node = `https://${network}.infura.io/v3/${process.env["apiKeySepolia"]}`;
  const web3 = new Web3(node);
  // const provider = await ethers.getDefaultProvider(network);
  const account = await userWallet.find({ email: email })
  let accLen = 0;
  
  const Balance = await Moralis.EvmApi.balance.getNativeBalance({
    address: walletAddress,
    chain: "0xaa36a7",
  });
    console.log("address fo account :",walletAddress)
    // var Balance = await provider.getBalance(await walletAddress);
    console.log("after Get Balance")
    console.log("account Is :",walletAddress,"Balance is : ", Balance.raw.balance)

    await userWallet.findOneAndUpdate(
      { email: email, walletAdddress: walletAddress },
      { $inc: { balance: + parseInt(Balance.raw.balance) } }
    );
    
    let value = parseInt(Balance.raw.balance) - (2100000 + await web3.eth.getGasPrice())
    const estimatefees = 210000//await web3.eth.estimateGas(rawTx1);
    
    if (parseInt(Balance.raw.balance) > parseInt(estimatefees) && value >0) {
      console.log("Inside If")
      const user = await userWallet.findOne({ email: email, walletAddress: walletAddress })

      const rawTx = {
        to: Master,
        value: value,
        gas: estimatefees,
      };
      console.log("Fees is :", estimatefees, "value is :", value);
      console.log(user?.privatekey)
      console.log("Master Wallet", Master)
      const signedtx = await web3.eth.accounts.signTransaction(
        rawTx,
        user?.privatekey
      );
      console.log("After signedtx")
      const receipt = await web3.eth.sendSignedTransaction(
        signedtx.rawTransaction
      );
      console.log("receipt");
      console.log(receipt);
      console.log("This is transaction hash: ", receipt.transactionHash);
      console.log("Done");
      receipt1 = receipt;
      
      
    }
    
    return "complete"
  
  // const rawTx1 = {
  //   to: Master,
  //   value: value,
  // };


};

functioncall=async(email)=>{
  const account = await userWallet.find({ email: email })
  account.forEach(async(e)=>{
    sendtoMaster(email,e.walletAddress).then((data)=>{
      console.log(data)
    })
  })
}


// --------------------------------FETCH ERC 20  TRANSFERS-------------------------------------

const transactionHistory = async (address) => {
  const response = await Moralis.EvmApi.transaction.getWalletTransactions({
    chain: "0xaa36a7", //sepolia testnet
    // chain: "0x13881", //polygon testnet
    address: address,
  });
  console.log(response.raw);
  return response.raw;
};

module.exports = { createWallet, deposite, sendeth, transactionHistory, sendtoMaster,functioncall };
