const dotenv = require('dotenv')
const Order = require('../../modeling/orderModel')
const Cart = require('../../modeling/cartModel')
const Product = require('../../modeling/productModel')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError');
const cors = require('cors')
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const crypto = require('crypto')
const Razorpay = require('razorpay')

dotenv.config();




const instance = new Razorpay({
    key_id: 'rzp_test_NdbzbxQDFDJ5MH',
    key_secret: 'xu7o6g0gBhMZz3TlbUuVZcu4'
})


// =============== CREATE ORDER COLLECTION ===============
exports.orderCreate = catchAsync(async (req, res, next) => {
    console.log(req.body)
    let paymentStatus
    const cart = await Cart.findOne({ user: req.user._id }).populate({
        path: 'cartItems.product'
    })
    const { cartItems } = cart
    let orderItems = [];
    cartItems.forEach(el => {
        orderItems.push({
            productName: el.product.productName,
            quantity: el.quantity,
            price: el.price,
            image: el.product.image[1],

        })
    });
    if (req.body.paymentMethod == 'COD') { paymentStatus = 'Completed' }
    const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress: req.body.address,
        totalPrice: req.body.totalPrice,
        PaymentMethod: req.body.paymentMethod,
        paymentStatus

    })
    if (req.body.paymentMethod == 'COD') {
        console.log(order.shippingAddress)
        res.status(200).json({
            status: 'success'
        })
    }
    else {
        console.log(process.env.RAZORPAY_KEY_ID)
        instance.orders.create({
            amount: req.body.totalPrice,
            currency: "INR",
            receipt: `${order._id}`,

        }, function (err, order) {
            if (err) {
                console.log(err)
            } else {

                console.log(order)
                res.status(200).json({
                    status: 'pending',
                    order
                })
            }
        })

    }
})





//================ CANCEL ORDER ================
exports.cancelProduct = catchAsync(async (req, res, next) => {
    const order = await Order.findOneAndUpdate({ user: req.user._id, 'orderItems._id': req.params.id }, {
        'orderItems.$.cancel': true
    })
    res.redirect('/profile')
})



// ============== ADMIN CANCEL ORDER ==============
exports.adminCancelProduct = catchAsync(async (req, res, next) => {
    console.log('inside function')
    const order = await Order.findOneAndUpdate({ 'orderItems._id': req.params.id }, {
        'orderItems.$.cancel': true
    })
    res.redirect('/admin/order')
})




// ============== ORDER STATUS EDIT ==============
exports.adminEditProductStatus = catchAsync(async (req, res, next) => {
    console.log('inside function')
    const order = await Order.findOneAndUpdate({ 'orderItems._id': req.params.id }, {
        'orderItems.$.status': req.body.status
    })
    res.redirect('/admin/order')
})




//============= VERIFY PAYMENT=================
exports.verifyPayment = catchAsync(async (req, res, next) => {
    console.log('inside verification')
    console.log(req.body)
    const { payment, order } = req.body
    let hmac = crypto.createHmac('sha256', 'xu7o6g0gBhMZz3TlbUuVZcu4')
    hmac.update(`${payment.razorpay_order_id}|${payment.razorpay_payment_id}`)
    hmac = hmac.digest('hex')
    if (hmac == payment.razorpay_signature) {
        const updateorder = await Order.findByIdAndUpdate({ _id:order.receipt }, {
            paymentStatus: 'Completed'
        }, { new: true })
        console.log(`new order${updateorder}`)
        res.status(200).json({
            status: 'success'
        })

    } else {
        res.status(200).json({
            status: 'fail'
        })
    }
})