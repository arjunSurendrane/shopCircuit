const mongoose = require('mongoose')


const whishlistSchema = new mongoose.Schema({
    items: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const whishlist = mongoose.model('Whishlist', whishlistSchema);
module.exports = whishlist