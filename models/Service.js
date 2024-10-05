const mongoose = require('mongoose');
const moment = require('moment-timezone');

const ServiceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: () => moment().tz("Asia/Kolkata").toDate()
    },
});

module.exports = mongoose.model('Service', ServiceSchema);
