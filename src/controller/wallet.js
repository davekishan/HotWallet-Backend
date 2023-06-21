require('dotenv').config();

const Web3 = require('web3');
const userModel = require('../module/Usermodel');
const userWallet=require('../module/wallet')
const apikey = process.env['apiKey']
console.log(apikey)
// const network  =  'goerli'; 
const network = 'sepolia';
// console.log(network);

const node = `https://${network}.infura.io/v3/${apikey}`;
const web3 = new Web3(node)
// console.log(web3)

// Create Random account address
// console.log(accountTo);
// console.log("This is New Generated Address:",accountTo.address);

const privateKey = process.env.privateKey
// console.log("Here is your private key:",privateKey);

const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);



const createWallet = (email) => {
    const accountTo = web3.eth.accounts.create();
    console.log(accountTo)
    const userwallet = userWallet({ email: email, walletAddress: accountTo.address, privatekey: accountTo.privateKey, balance: 0 })
    userwallet.save();
    return true;
}

// createWallet('yash.khayri')


const deposite = async(account,amount,email) => {
    const rawTx1 = {
        to: account,
        value: web3.utils.toWei(amount, "ether"),
    }

    const estimatefees=web3.eth.estimateGas(rawTx1)

    const rawTx = {
        to: account,
        value: web3.utils.toWei(amount, "ether"),
        gas: estimatefees,


    }

    try {

        const signedtx = await web3.eth.accounts.signTransaction(rawTx, privateKey);   // sign transaction 
        const receipt = await web3.eth.sendSignedTransaction(signedtx.rawTransaction); // send signed transaction
        await userWallet.findOneAndUpdate({email:email,walletAddress:account},{ '$inc': { 'balance': + amount }})
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



const sendeth=async(from,to,value1,email)=>{
    const account=await userWallet.findOne({email:email,walletAddress:from})
    const value=web3.utils.toWei(value1, "ether")

    const rawTx1 = {
        to: to,
        value: value
    }

    const estimatefees=await web3.eth.estimateGas(rawTx1)

    const rawTx = {
       
        to: to,
        value: value,
        gas: estimatefees,
    }
    console.log("Fees is :",estimatefees,"value is :",value);
    console.log(parseInt(estimatefees)+parseInt(value));
    
    console.log(account)
    if(web3.utils.toWei((account.balance).toString(), "ether")  >(parseInt(estimatefees)+parseInt(value)))
    {
        const signedtx = await web3.eth.accounts.signTransaction(rawTx, "0x1e6d3fdbc225c0cfc450999e5e29018566c1c43f4288a4e0ac20dc4ddf741938");   // sign transaction 
        const receipt = await web3.eth.sendSignedTransaction(signedtx.rawTransaction); // send signed transaction
        await userWallet.findOneAndUpdate({email:email,walletAdddress:account},{ '$inc': { 'balance': - value }})
        console.log(receipt);
        console.log("Done");
    }
    else{
        console.log("Balance is low");
    }
    
}




module.exports = {createWallet,deposite,sendeth };