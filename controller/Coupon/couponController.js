const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const Coupon = require('../../modeling/couponModel');
const async = require('hbs/lib/async');


exports.create = catchAsync(async (req, res, next) => {
    let { code, isPercent, expireDate, isActive, offerCriteria } = req.body
    expireDate = new Date(expireDate)
    console.log(expireDate)
    const coupon = await Coupon.create({
        code,
        expireDate,
        isActive,
        isPercent,
        offerCriteria
    })
    res.status(200).json({
        status: 'success',
        data: coupon
    })
})

exports.update = catchAsync(async (req, res, next) => {
    const { isPercent, code } = req.body
    console.log(req.params.id, isPercent, code)
    const coupon = await Coupon.findByIdAndUpdate({ _id: req.params.id }, { isPercent, code }, { new: true })
    res.status(200).json({
        status: 'success',
        coupon
    })
})

exports.delete = catchAsync(async (req, res, next) => {
    const coupon = await Coupon.findOneAndDelete({ _id: req.params.id })
    res.redirect('/admin/coupon')
})