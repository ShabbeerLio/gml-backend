const mongoose = require('mongoose');
const moment = require('moment-timezone');

const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    description: {
        type: String
    }
});

const ClientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        required: true
    },
    subcategories: [SubcategorySchema],
    date: {
        type: Date,
        default: () => moment().tz("Asia/Kolkata").toDate()
    },
});

module.exports = mongoose.model('Client', ClientSchema);
