const mongoose = require('mongoose');
const validator = require('validator');



const CategorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: [true, 'category must have category name'],
            unique: true
        },
        offerName: {
            type: String
        },
        offer: {
            type: Number
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtual: true },
        virtuals: true
    }
)


// Virtual populate
CategorySchema.virtual('products', {
    ref: 'Product',
    foreignField: 'category',
    localField: '_id',
    justOne: true
});



const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;