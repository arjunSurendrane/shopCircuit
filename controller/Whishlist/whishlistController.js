const Product = require('../../modeling/productModel');
const Whishlist = require('../../modeling/whishlist');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

// =============1) WHISHLIST CREATE  =============
exports.create = catchAsync(async (req, res, next) => {
    const oldWhishlist = await Whishlist.findOne({ user: req.user._id })
    if (!oldWhishlist) {
        const whishlist = await Whishlist.create({
            user: req.user._id,
            items: { product_id: req.params.id }
        })
    } else {
        const whishlist = await Whishlist.findOneAndUpdate({ user: req.user._id }, {
            $push: {
                items: { product_id: req.params.id }
            }
        })
    }
    res.redirect('/')
})


// ============2) DELETE WHISHLIST===============
exports.delete = catchAsync(async (req, res, next) => {
    const whishlist = await Whishlist.findOneAndUpdate({ user: req.user._id }, {
        $pull: {
            items:{_id:req.params.id}
        }
    })
    res.redirect('/whishlist')
})