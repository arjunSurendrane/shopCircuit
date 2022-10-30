const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    productName: {
        type: String,
        require: [true, 'banner must have a product name']
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    image: {
        type: String,
        require: [true, 'banner must have an image']
    },
    discription: {
        type: String,
        require: [true, 'banner have a discription']
    }
})

const Banner = mongoose.model('Banner', bannerSchema)
module.exports = Banner