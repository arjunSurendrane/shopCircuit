const async = require("hbs/lib/async");
const Cart = require("../../modeling/cartModel");
const Wallet = require("../../modeling/walletModel");
const catchAsync = require("../../utils/catchAsync");
const Whishlist = require("../../modeling/whishlist");



exports.cartlength = catchAsync(async (req, res, next) => {
    let cart
    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id })
    } else {
        return res.json({
            status: 'success',
        })
    }
    res.json({
        status: 'success',
        cart
    })
})

exports.whishlistlength = catchAsync(async (req, res, next) => {
    let whishlist
    if (req.user) {
        whishlist = await Whishlist.findOne({ user: req.user._id })
    } else {
        res.json({
            status: 'success',

        })
    }
    return res.json({
        status: 'success',
        whishlist
    })
})

exports.walletAmount = catchAsync(async (req, res, next) => {
    const wallet = await Wallet.findOne({ user: req.user._id })
    res.json({
        status: 'success',
        wallet
    })
})

