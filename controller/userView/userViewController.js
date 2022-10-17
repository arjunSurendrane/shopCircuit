const Product = require('../../modeling/productModel')
const Whishlist = require('../../modeling/whishlist')
const User = require('../../modeling/userModel')
const Coupon = require('../../modeling/couponModel')
const catchAsync = require('../../utils/catchAsync')
const jwt = require('jsonwebtoken');
const AppError = require('../../utils/appError');
const Category = require('../../modeling/categoryModel')
const Cart = require('../../modeling/cartModel');
const Order = require('../../modeling/orderModel')
const { response } = require('express');






// =========1) RENDER SIGNUP PAGE =============
exports.signup = (req, res, next) => {
    res.status(200).render('user/signup', {
        title: 'signup',
        header: false,
        style: 'login'
    })
}



// ==========2) RENDER LOGIN PAGE =============
exports.login = (req, res, next) => {
    res.status(200).render('user/login', {
        titile: 'loginpage',
        header: false,
        style: 'login'
    })
}


//========= RENDER OTP LOGIN PAGE===========
exports.otpLogin = (req,res)=>{
    res.status(200).render('user/otpVerification')
}



// ==============3) RENDER HOME PAGE ================
exports.listProduct = catchAsync(async (req, res, next) => {
    const category = await Category.find()
    const product = await Product.find();
    res.render('user/index', {
        category,
        product,

    })
})



// =============4) RENDER PRODUCT DETAIL PAGE ================
exports.getProduct = catchAsync(async (req, res, next) => {
    const categorys = await Category.find();
    const { user } = req
    const product = await Product.findOne({ _id: req.params.id })
    if (!product) {
        return next(new AppError('product doesnt exist !!!!'))
    }
    console.log(product)
    let discountOfferPrice
    const {category,discount} = product
    if(category.offer>discount)
    {
        discountOfferPrice = category.offer
    }
    else{
        discountOfferPrice = discount
    }
    console.log(discountOfferPrice)

    
    res.status(200).render('user/productDetail', {
        discountOfferPrice,
        product,
        categorys,
        user,
    })
})



// ============5) RENDER CART PAGE =============
exports.cartPage = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'cartItems.product'
    })
    const coupon = await Coupon.find()
    console.log(coupon)
    if (cart.cartItems.length == 0) {
        res.status(200).render('user/emptycart')
    }
    else {
        res.status(200).render('user/cart', {
            cart,
            coupon
        })
    }

})



// =============6) RENDER CHECKOUT PAGE =============
exports.checkout = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'cartItems.product'
    }).populate('user')
    let amount = 0
    cart.cartItems.forEach(el => {
        amount = el.price + amount
    })
    discount = amount - cart.couponOffer
    res.status(200).render('user/checkout', {
        discount,
        cart,
        amount
    })
})



// =============7) RENDER PROFILE PAGE=================
exports.profile = catchAsync(async(req,res,next)=>{
    const user = await User.findOne({_id:req.user._id})
    const order = await Order.find({user:req.user._id})
    res.status(200).render('user/profile',{
        user,
        order
    })
}) 



//=========== RENDER WHISHLIST ============
exports.whishlist = catchAsync(async(req,res)=>{
    const whishlist = await Whishlist.findOne({user:req.user._id}).populate({
        path:'items.product_id'
    })
    console.log(whishlist)
    res.status(200).render('user/whishlist',{
        whishlist
    })
}
)



