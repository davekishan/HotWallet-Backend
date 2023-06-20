require('dotenv').config();

const Web3 = require('web3');
const apikey = process.env['apiKey']
// const network  =  'goerli'; 
const network  =  'sepolia'; 
// console.log(network);

const node =  `https://${network}.infura.io/v3/${apikey}`;
const web3 =  new Web3(node)
// console.log(web3)

// Create Random account address
const accountTo = web3.eth.accounts.create();
// console.log(accountTo);
// console.log("This is New Generated Address:",accountTo.address);

const privateKey = process.env['privateKey'];
// console.log("Here is your private key:",privateKey);

const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);
// console.log("This is From address:",accountFrom);

const createSignedTx = async(rawTx) => {
    try { 
        rawTx.gas = await web3.eth.estimateGas(rawTx);
        // console.log(rawTx);
        const signedtx =  await web3.eth.accounts.signTransaction(rawTx, privateKey);   // sign transaction 
        const receipt = await web3.eth.sendSignedTransaction(signedtx.rawTransaction); // send signed transaction
        console.log("THIS IS RECEIPT");
        console.log(receipt);
        console.log("Done");
    } catch (error) {
        console.log("error ---------------------------");
        // console.log("This is error");
        console.log(error);
    } 
} 

// Convert Eth to Wei 
const amountTo = "0.0001" //ether amount
const rawTx = {
    to : accountTo.address,
    value: web3.utils.toWei(amountTo,"ether"),
}

createSignedTx(rawTx);