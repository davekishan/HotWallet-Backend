require('dotenv').config();

const Web3 = require('web3');
const userWallet = require('../module/wallet');
const apikey = process.env['apiKey']
console.log(apikey)
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

const privateKey = process.env.privateKey
// console.log("Here is your private key:",privateKey);

const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);

const amountTo = "0.0001" //ether amount
const rawTx = {
    
    to : accountTo.address,
    value: web3.utils.toWei(amountTo,"ether"),
    gas:100000,
    
    
}


const createSignedTx = async(rawTx,email) => {
    try { 
        // console.log(await rawTx.gas);
        // rawTx.gas = await web3.eth.estimateGas(rawTx);
        const userwallet=userWallet({email:email,walletAdddress:accountTo.address,privatekey:accountTo.privateKey})
        userwallet.save();
        const signedtx =  await web3.eth.accounts.signTransaction(rawTx, privateKey);   // sign transaction 
        const receipt = await web3.eth.sendSignedTransaction(signedtx.rawTransaction); // send signed transaction
        console.log(receipt);
        console.log("Done");

        return receipt
    } catch (error) {
        console.log("error ---------------------------");
        // console.log("This is error");
        console.log(error);
        return "Error"
    } 
} 




const callfun=(email)=>{
    createSignedTx(rawTx,email)
    
}


module.exports = { rawTx,createSignedTx,callfun };