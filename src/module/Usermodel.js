const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        status:{
            type:Number,
            require:true
        }
    }
)

const userModel = mongoose.model('user', UserSchema, 'users');

module.exports = userModel;