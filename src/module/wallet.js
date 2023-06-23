
const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        walletAddress: {
            type: String,
            required: true
        },
        privatekey:{
            type:String,
            require:true
        },
        balance:{
            type:Number,
            require:true
        },

    }
)

const userWallet = mongoose.model('userwallet', WalletSchema, 'wallet');

module.exports = userWallet;