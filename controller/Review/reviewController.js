const Review = require('../../modeling/reviewModel')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError');
const Product = require('../../modeling/productModel');



exports.addReview = catchAsync(async (req, res, next) => {
    console.log(req.body)
    console.log(req.params.id)
    const oldReview = await Review.findOne({ $and: [{ user: req.user._id }, { product: req.params.id }] })
    console.log(oldReview)
    let review
    if (oldReview) {
        review = await Review.findOneAndUpdate({ user: req.user._id, product: req.params.id }, {
            review: req.body.review,
            rating: req.body.starRating
        }, { new: true })
    } else {

        review = await Review.create({ user: req.user._id, review: req.body.review, product: req.params.id, rating: req.body.starRating })
    }

    console.log(review)
    res.json({
        status: 'success'
    })
})




