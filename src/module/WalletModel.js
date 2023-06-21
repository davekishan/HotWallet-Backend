const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        account: {
            type: String,
            required: true
        },
        privatekey:{
            type:String,
            require:true
        }
    }
)

const walletModel = mongoose.model('wallet', WalletSchema, 'users');

module.exports = walletModel;