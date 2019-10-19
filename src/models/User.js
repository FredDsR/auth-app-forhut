const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String, 
        require: true,
    },
    password:{ 
        type: String,
        required: true,
    },
    bio: {
        type: String,
    }
});

module.exports = mongoose.model('User', UserSchema);