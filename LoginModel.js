const mongoose = require('mongoose');
const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String
    }
});

const LoginModel = new mongoose.model('login', LoginSchema);
module.exports = LoginModel;