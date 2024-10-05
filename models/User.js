const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment-timezone');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: () => moment().tz("Asia/Kolkata").toDate()
    },
});
const User = mongoose.model('user',UserSchema);
module.exports = User;