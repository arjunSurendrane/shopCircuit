const Wallet = require('../../modeling/walletModel')
const User = require('../../modeling/userModel')
const catchAsync = require('../../utils/catchAsync')




//============== ADD AMOUNT TO WALLET ==============
exports.addWallet = catchAsync(async (req, res, next) => {
    const wallet = await Wallet.findOneAndUpdate({ user: req.user._id }, {
        amount: req.body.amount
    })
    res.status(200).json({
        status: 'success',
        wallet
    })
})


//============= SHOP USING WALLET =============
exports.shopUsingWallet = catchAsync(async (req, res, next) => {
    const wallet = await Wallet.findOneAndUpdate({ user: req.user._id }, {
        amount: req.body.amount
    })
    res.status(200).json({
        status: 'success',
        wallet
    })
})