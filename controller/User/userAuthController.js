
const User = require('../../modeling/userModel')
const catchAsync = require('../../utils/catchAsync')
const jwt = require('jsonwebtoken');
const AppError = require('../../utils/appError');
const { token } = require('morgan');
const Cart = require('../../modeling/cartModel');
const { response } = require('express');
const Otp = require('../../modeling/otpModel')
const otpGenerator = require('otp-generator')
const _ = require('lodash');
const Category = require('../../modeling/categoryModel');



// ------------CREATE TOKEN-------------
const generateToken = (userid) => {
    return jwt.sign({ id: userid }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN
    })
}


//----------CREATE AND SEND TOKEN------------------
const createSendToken = (user, statusCode, res) => {
    const token = generateToken(user._id);
    const cookieOption = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    res.cookie('jwt', token, cookieOption);
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    })

}



// ------------USER SIGNUP-----------
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        mob: req.body.mob,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    const cart = await Cart.create({ user: newUser._id })
    createSendToken(newUser, 200, res)
})



// ------------SEND OTP------------
exports.sendOtp = catchAsync(async (req, res, next) => {
    const user = await User.findOne({
        mob: req.body.number
    })
    if (!user) return res.status(400).json({ status: 'failed', message: 'this user cant exist' })
    const OTP = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    const number = req.body.number
    console.log(OTP)
    const accountSid = 'AC2a634dc20e74be40bd0720af45749e07';
    const authToken = 'f992065b29eb7a0deab502507cdbf0e3';
    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
            body: OTP,
            messagingServiceSid: 'MG949c6b0885954363817c62edcef07931',
            to: `+91${number}`
        })
        .then(message => console.log(message.sid))
        .done();
    const result = await Otp.create({
        number,
        otp: OTP
    })
    res.status(200).json({
        status: 'success',
        message: 'otp send successfully'
    })
})




exports.verifyOtp = catchAsync(async (req, res, next) => {
    const otpHolder = await Otp.find({
        number: req.body.number
    })
    if (otpHolder.length == 0) return res.status(400).json({ status: 'failed', message: 'incorrect otp' })
    const rightOtpHolder = otpHolder[otpHolder.length - 1]
    const validUser = rightOtpHolder.otp == req.body.otp

    if (!validUser) return res.status(400).json({ status: 'failed', message: 'incorrect otp' })
    const number = req.body.number
    const user = await User.findOne({ mob: number })
    const deleteOtp = await Otp.deleteMany({
        number: rightOtpHolder.number
    })
    createSendToken(user, 200, res)

})



exports.addAddress = catchAsync(async (req, res, next) => {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, {
        $push: {
            address: {
                Pincode: req.body.Pincode,
                city: req.body.city,
                Locality: req.body.Locality,
                BuildingName: req.body.BuildingName,
                Landmark: req.body.Landmark,
                AddressType: req.body.AddressType
            }
        }
    }, {
        new: true
    })
    res.status(200).json({
        user
    })
})


// ------------USER LOGIN-----------
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // -------check email and password---------
    if (!email || !password) {
        return next(new AppError('must enter email and password', 404))
    }
    // ------find user and compare password--------
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect username or password', 401))
    }
    // -------success login--------------
    createSendToken(user, 200, res)
    // return next()
})

exports.logout = (req, res, next) => {
    res.cookie('jwt', 'logged out', {
        expiresIn: new Date(Date.now() + 1000),
        httpOnly: true
    })
    // res.status(200).json({
    //     status: 'success'
    // })
    res.redirect('/')
}


// -----------CHECK JWT TOKEN----------------
exports.protect = catchAsync(async function (req, res, next) {
    // 1) ---------getting token and check of it there-----------
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    // 2) -------------Verification token-------------
    const decoded = await jwt.verify(token,
        process.env.JWT_SECRET
    );
    console.log(decoded)
    // 3) --------------Check if user still exist-----------
    const newUser = await User.findById(decoded.id)
    // 4)----------- Check if user change password after the token was issued---------
    const changePassword = newUser.changePassword(decoded.iat)
    console.log("change passwored = " + changePassword)
    next();
})

exports.isUser = async function (req, res, next) {
    // 1) ---------getting token and check of it there-----------
    if (req.cookies.jwt) {
        try {
            // 2) -------------Verification token-------------
            const decoded = await jwt.verify(req.cookies.jwt,
                process.env.JWT_SECRET
            );
            if (!decoded) {
                return next()
            }
            // 3) --------------Check if user still exist-----------
            const newUser = await User.findById(decoded.id)
            if (!newUser) {
                return next()
            }
            // 4)----------- Check if user change password after the token was issued---------
            // const changePassword = newUser.changePassword(decoded.iat)
            // console.log("change passwored = " + changePassword)
            const category = await Category.find()
            res.locals.user = newUser;
            res.locals.category = category;
            req.user = newUser
            return next()
        } catch (err) {
            return next();
        }
    }
    next();
}

exports.update = catchAsync(async (req, res, next) => {
    const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true })
    res.redirect('/profile')
})


