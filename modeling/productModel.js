const mongoose = require('mongoose');
const validator = require('validator');
const Category = require('./categoryModel');


const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'product must have product name']
    },
    brand: {
        type: String,
        required: [true, 'product must have brand name']
    },
    varient: {
        type: String
    },
    color: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'product must have price']
    },
    discountPrice: {
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'must enter the category']
    },
    quantity: {
        type: Number,
        required: [true, 'must enter product quantity']
    },
    offer_name: {
        type: String
    },
    discount: {
        type: Number
    },
    discription: {
        type: String,
        required: [true, 'must enter product description']
    },
    image: [String]

}, { timestamps: true })

ProductSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: ['categoryName', 'offer']
    })
    next()
})


const Product = mongoose.model('Product', ProductSchema);
module.exports = Product