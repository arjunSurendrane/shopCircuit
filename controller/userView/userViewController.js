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
const Banner = require('../../modeling/bannerModel')
const Delivery = require('../../modeling/deliveryOrder')
const Wallet = require('../../modeling/walletModel')
const jsdf = require('jsdf')
const async = require('hbs/lib/async')
const Review = require('../../modeling/reviewModel')






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
exports.otpLogin = (req, res) => {
    res.status(200).render('user/otpVerification')
}



// ==============3) RENDER HOME PAGE ================
exports.listProduct = catchAsync(async (req, res, next) => {
    const obj = JSON.parse(JSON.stringify(req.body))
    const { productName } = obj
    const banner = await Banner.find()
    const product = await Product.find({ productName: { $regex: new RegExp('^' + obj.productName + '.*', 'i') } }).exec();
    res.render('user/index', {
        product,
        banner
    })
})


//================RENDER SUGGESTION FOR SEARCH===============
exports.suggestion = catchAsync(async (req, res, next) => {
    const payload = req.body.e
    result = await Product.find({ productName: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec()
    res.status(200).json({
        result
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
    let discountOfferPrice
    const { category, discount } = product
    if (category.offer > discount) {
        discountOfferPrice = category.offer
    }
    else {
        discountOfferPrice = discount
    }

    let outOfstock = false
    if (product.quantity == 0) {
        outOfstock = true;
    }
    const review = await Review.find({ product: req.params.id }).populate('user')
    let avgRating = 0
    review.forEach(e => {
        avgRating = avgRating + e.rating
    })
    avgRating = avgRating / review.length
    let permforReviw
    if (req.user) {
        permforReviw = await Delivery.findOne({ user: req.user._id, "orderItems.productId": req.params.id })
    }
    res.status(200).render('user/productDetail', {
        avgRating,
        permforReviw,
        review,
        outOfstock,
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
    const date = () => {
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var newdate = year + "-" + month + "-" + day;
        return newdate;
    };
    if (!cart || cart.cartItems.length == 0) {
        return res.status(200).render('user/emptycart')
    }
    else {
        const coupon = await Coupon.find()
        let validCoupon = []
        const today = new Date(Date.now())
        coupon.forEach(e => {
            if (today <= e.expireDate) {
                if (e.offerCriteria <= cart.totalPrice) {
                    validCoupon.push(e)
                }
            }
        })
        res.status(200).render('user/cart', {
            cart,
            coupon,
            validCoupon
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
exports.profile = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id })
    const pendingOrder = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    const deliveredProduct = await Delivery.find({ user: req.user._id }).sort({ createdAt: -1 })
    const order = [...pendingOrder, ...deliveredProduct]

    res.status(200).render('user/profile', {
        user,
        pendingOrder,
        deliveredProduct,
        order
    })
})


exports.address = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id })
    res.status(200).render('user/profileAddress', {
        user
    })
})


exports.profileOrders = catchAsync(async (req, res, next) => {
    const pendingOrder = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    pendingOrder.map(e => {
        const date = (e.createdAt).toString().split(' ').slice(1, 4);
        console.log(date.toString());
        e.orderDate = date.toString()
        console.log(e)
    })
    res.status(200).render('user/profileOrder', {
        pendingOrder
    })

})

exports.accountDetails = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id })
    res.status(200).render('user/profileDetails', {
        user
    })
})

exports.deliveryOrder = catchAsync(async (req, res, next) => {
    const deliveredProduct = await Delivery.find({ user: req.user._id }).sort({ createdAt: -1 })
    deliveredProduct.map(e => {
        const date = (e.createdAt).toString().split(' ').slice(1, 4);
        console.log(date.toString());
        e.orderDate = date.toString()
        console.log(e)
    })
    res.status(200).render('user/profileDeliveryOrder', {
        deliveredProduct
    })


})



//=========== RENDER WHISHLIST ============
exports.whishlist = catchAsync(async (req, res) => {
    const whishlist = await Whishlist.findOne({ user: req.user._id }).populate({
        path: 'items.product_id'
    })
    if (whishlist == null || whishlist.items == 0) {
        return res.status(200).render('user/emptyWhishlist')
    }
    res.status(200).render('user/whishlist', {
        whishlist
    })
}
)

//============= RENDER WALLET ==================
exports.wallet = catchAsync(async (req, res, next) => {
    const wallet = await Wallet.findOne({ user: req.user._id });
    let trans = []
    wallet.transcation.forEach(e => {
        const day = e.date.getDate();
        const month = e.date.getMonth();
        const year = e.date.getFullYear();
        e.newDate = `${day}-${month}-${year}`
        let updated = { "newDate": e.newDate, "productName": e.productName, "amount": e.amount, "getit": e.getit, method: e.method }
        trans.push(updated)
    }
    )

    const transaction = wallet.transcation
    res.render('user/wallet', {
        transaction,
        wallet
    })
})
//=============RENDER SEARCH VIEW =================
exports.searchView = catchAsync(async (req, res, next) => {
    let filter;
    const { sort } = req.query
    if (sort == 'asc') {
        filter = { price: 1 }
    } else if (sort == 'desc') {
        filter = { price: -1 }
    } else if (sort == 'name') {
        filter = { productName: 1 }
    } else {
        filter = { createdAt: -1 }
    }
    const page = (req.query.page - 1) * 12
    let searchView = await Product.find({ category: req.params.id }).sort(filter).limit(12).skip(page);
    // res.status(200).json({
    //     status: 'success',
    //     searchView
    // })
    let length = parseInt(searchView.length / 12) + 1
    let pagination = []
    for (let i = 1; i <= length; i++) {
        pagination.push(i);
    }
    let outOfstock = false
    if (searchView.quantity == 0) {
        outOfstock = true;
    }

    res.status(200).render('user/categoryView', {
        pagination,
        outOfstock,
        searchView
    })
})


//===========RENDER FORGOT PASSWORD PAGE===============
exports.forgotPassword = catchAsync(async (req, res, next) => {
    res.status(200).render('user/forgotPasswordOtp')
})


//===========RENDER NEW PASSWORD PAGE==============
exports.newPassword = catchAsync(async (req, res, next) => {
    res.status(200).render('user/newPassword')
})


//===========RENDER HOME PAGE====================
exports.home = catchAsync(async (req, res, next) => {
    const banner = await Banner.find()
    let cart = null;
    let whishlist = null;
    if (req.user) {
        cart = await Cart.findOne({ user: req.user._id });
        whishlist = await Whishlist.findOne({ user: req.user._id });
    }
    const product = await Product.find().sort({ productName: 1 })
    let outOfstock = false
    if (product.quantity == 0) {
        outOfstock = true;
    }
    const review = await Review.find({ product: req.params.id }).populate('user')
    let avgRating = 0
    review.forEach(e => {
        avgRating = avgRating + e.rating
    })
    avgRating = avgRating / review.length
    res.status(200).render('user/home', {
        avgRating,
        outOfstock,
        cart,
        whishlist,
        product,
        banner
    })
})

//=============== RENDER INVOICE===============
exports.invoice = catchAsync(async (req, res, next) => {
    let order = await Order.findOne({ _id: req.params.id })
    if (!order) {
        order = await Delivery.findOne({ _id: req.params.id })
    }
    const user = await User.findOne({ _id: req.user._id })
    res.status(200).render('user/invoice', {
        invoice: true,
        order,
        user
    })
})


//==================INVOICE DOWNLOAD =====================
exports.invoiceDownload = catchAsync(async (req, res, next) => {

})


//==============RENDER REVIEW PAGE ==================
exports.reviewPage = catchAsync(async (req, res, next) => {
    const review = await Review.findOne({ $and: [{ user: req.user._id }, { product: req.params.id }] })
    res.render('user/addReview', {
        review
    })
})

