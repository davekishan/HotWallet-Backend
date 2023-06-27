const Moralis = require("moralis").default;
require("dotenv").config();

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});
// console.log("this is moralis api key:", process.env.MORALIS_API_KEY);

const Web3 = require("web3");
const userWallet = require("../module/wallet");
const userModel = require("../module/Usermodel");
const apikey = process.env["apiKey"];
// console.log(apikey)
// const network  =  'goerli';
const network = "sepolia";
// console.log(network);

const node = `https://${network}.infura.io/v3/${apikey}`;
const web3 = new Web3(node);
// console.log(web3)

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

const sendeth = async (from, to, value1, email) => {
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
    web3.utils.toWei(account.balance.toString(), "ether") >
    parseInt(estimatefees) + parseInt(value)
  ) {
    const signedtx = await web3.eth.accounts.signTransaction(
      rawTx,
      account.privatekey
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedtx.rawTransaction
    ); // send signed transaction
    console.log("receipt"); // sign transaction

    await userWallet.findOneAndUpdate(
      { email: email, walletAdddress: account },
      { $inc: { balance: -value } }
    );
    console.log(receipt);
    console.log("This is transaction hash: ", receipt.transactionHash);
    console.log("Done");
    receipt1 = receipt;
  } else {
    console.log("Balance is low");
  }
};

// --------------------------------FETCH ERC 20  TRANSFERS-------------------------------------

const transactionHistory = async (email) => {
  console.log("this is email:", email);
  const user = await userWallet.findOne({ email: email });
  console.log(user);
  // const { address } = await receipt1.from;

  const response = await Moralis.EvmApi.transaction.getWalletTransactions({
    chain: "0xaa36a7", //sepolia testnet
    // "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
    address: user.walletAddress,
  });
  console.log(response.raw);
  return response.raw;
};

// const test = async () => {
//   await transactionHistory('vishalstudy21@gmail.com');
// };
// test();
// abc();
module.exports = { createWallet, deposite, sendeth, transactionHistory };
