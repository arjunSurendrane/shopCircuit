
const User = require('../../modeling/userModel')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError');



// ==========1) UPDATE USER ADDRESS ============
exports.address = catchAsync(async (req, res, next) => {
    const user = await User.findOneAndUpdate({ _id: req.user._id }, {
        $push: {
            address: {
                Pincode: req.body.Pincode,
                city: req.body.city,
                Locality: req.body.Locality,
                BuildingName: req.body.BuildingName,
                Landmark: req.body.Landmark
            }
        }
    })
    res.redirect('/checkout')
})



// ================= UPDATE USER PROFILE ===============
exports.userDetails = catchAsync(async (req, res, next) => {
    const user = await User.findOneAndUpdate({ _id: req.user._id }, {
        name: req.body.name,
        email: req.body.email,
        mob: req.body.mob
    })
    res.status(200).json({
        status: 'success'
    })
})



// ===============OTP VERIFICATION===============