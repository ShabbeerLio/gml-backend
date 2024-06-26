const mongoose = require('mongoose');

const SubcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String,
        required: true
    },
});

const BlogsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: String,
        required: true
    },
    categoryImageUrl: {
        type: String,
        required: true
    },
    subcategories: [SubcategorySchema],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blogs',BlogsSchema)