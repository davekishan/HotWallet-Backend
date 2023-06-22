require('dotenv').config();

const Web3 = require('web3');
const userWallet = require('../module/wallet');
const apikey = process.env['apiKey']
// console.log(apikey)
// const network  =  'goerli'; 
const network  =  'sepolia'; 
// console.log(network);

const node =  `https://${network}.infura.io/v3/${apikey}`;
const web3 =  new Web3(node)
// console.log(web3)


// Create Random account address    
let account1;
const createWallet = async() =>{
    const accountTo = web3.eth.accounts.create();
    console.log(accountTo);
    console.log("This is New Wallet Address:",accountTo.address);
    console.log("Here is your PrivateKey:",accountTo.privateKey);
    account1 = await accountTo;
    return (accountTo)
}
    
// const abc = async() => {
//     const a = await createWallet();
//     console.log("a is");
//     console.log(a);
// }

const privateKey = process.env.privateKey
// console.log("Here is your private key:",privateKey);

const create_wallet=(email)=>{
    return createWallet(email)
}
const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);

const amountTo = "0.00001" //ether amount


const createSignedTx = async(account,email) => {
    try { 
        // console.log(await rawTx.gas);
        const rawTx = {
            
            to : account1.address,
            value: web3.utils.toWei(amountTo,"ether"),
            gas:100000,    
        }
        // rawTx.gas = await web3.eth.estimateGas(rawTx);
        const userwallet=userWallet({email:email,walletAdddress:account1.address,privatekey:account1.privateKey})
        userwallet.save();
        const signedtx =  await web3.eth.accounts.signTransaction(rawTx, privateKey);   // sign transaction 
        const receipt = await web3.eth.sendSignedTransaction(signedtx.rawTransaction); // send signed transaction
        console.log("THIS IS RECEIPT:",receipt);
        console.log("Done");

        return receipt
    } catch (error) {
        console.log("error ---------------------------");
        // console.log("This is error");
        console.log(error);
        return "Error"
    } 
} 



const callfun=(account,email)=>{
    createSignedTx(account,email)
}


// abc();
module.exports = {createSignedTx,callfun,create_wallet };