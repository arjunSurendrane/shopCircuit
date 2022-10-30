const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    review: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    }

})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review