const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    registerDate:{
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = model('Users', userSchema, 'users');