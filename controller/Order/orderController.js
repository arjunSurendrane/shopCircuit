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
const paypal = require('paypal-rest-sdk')
const Delivery = require('../../modeling/deliveryOrder')
const { DeliveryReceiptContext } = require('twilio/lib/rest/conversations/v1/conversation/message/deliveryReceipt')
const Wallet = require('../../modeling/walletModel')
const Return = require('../../modeling/returnOrders')
const Review = require('../../modeling/reviewModel')
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AeDUH8MavBU5sRCKyS1iFVvhzGKzA5zwuEX5f7Nk4YjVcqGDCMBxNMeeIA9fkCJzKQ3djVx5_6ux0NIv',
    'client_secret': 'EIHqBkBI5P8Z1NyzcDaB_Lr5Qe98WobbfG2lQ1v39am39r2z4J7bYzweWe5BEMiHE8dCK-KJcSrYXEXH'
});

dotenv.config();




const instance = new Razorpay({
    key_id: 'rzp_test_NdbzbxQDFDJ5MH',
    key_secret: 'xu7o6g0gBhMZz3TlbUuVZcu4'
})


const stockManagment = async (productId, stock) => {
    const product = await Product.findOne({ _id: productId });
    let { quantity } = product;
    quantity = product.quantity - stock
    if (quantity <= 0) {
        quantity = 0
    }
    const productUpdate = await Product.findOneAndUpdate({ _id: productId }, {
        quantity
    })
    return productUpdate
}


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
            productId: el.product._id,
            quantity: el.quantity,
            price: el.price,
            image: el.product.image[1],

        })
        stockManagment(el.product._id, el.quantity);
    });
    if (req.body.paymentMethod == 'COD') { paymentStatus = 'Completed' }
    let date = new Date(Date.now())
    const orderDate = (date).toString().split(' ').slice(1, 4);
    console.log(orderDate.toString());

    const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress: req.body.address,
        totalPrice: req.body.totalPrice,
        PaymentMethod: req.body.paymentMethod,
        paymentStatus,
        date: orderDate.toString()

    })
    if (req.body.paymentMethod == 'COD') {

        res.status(200).json({
            status: 'success'
        })
        const delCart = await Cart.findOneAndDelete({ user: req.user._id })
    }
    else if (req.body.paymentMethod == 'RAZORPAY') {
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

    } else if (req.body.paymentMethod == 'PAYPAL') {
        try {
            let amount = req.body.totalPrice / 70;
            console.log(req.body)
            let create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:8000/paypal/success",
                    "cancel_url": "http://localhost:8000/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "item",
                            "sku": "item",
                            "price": `${amount}`,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": `${amount}`
                    },
                    "description": "This is the payment description."
                }]
            };


            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    console.log(error)
                    throw error;
                } else {
                    console.log("Create Payment Response");
                    console.log(payment);
                    res.status(200).json({
                        status: 'paypal',
                        payment
                    })

                }
            });
        } catch (err) {
            console.log(err)
            res.status(400).json({
                err
            })
        }
    } else if (req.body.paymentMethod == 'WALLET') {
        let productName;
        let totalPrice = order.totalPrice;
        order.orderItems.forEach(e => {
            productName = e.productName;
        })
        const wallet = await Wallet.findOne({ user: req.user._id })
        const amount = wallet.amount - order.totalPrice;
        if (amount <= 0) {
            return res.status(200).json({
                status: 'transaction failed',
                message: 'not enough money'
            })
        } else {
            const newWallet = await Wallet.findOneAndUpdate({ user: req.user._id }, {
                amount,
                $push: {
                    transcation: {
                        productName,
                        amount: totalPrice,
                        date: new Date(Date.now()),
                        method: 'Debit',
                        get: false
                    }
                }
            }, { new: true, upsert: true })
            console.log(newWallet)
            res.status(200).json({
                status: 'success'
            })
        }


    }
})

//=============== RENDER RETURN FORM ==========
exports.return = catchAsync(async (req, res, next) => {
    res.render('user/returnForm')
})

//========== CANCEL RETURN ===============
exports.returnCancel = catchAsync(async (req, res, next) => {
    console.log(req.params.id)
    const cancelReturn = await Delivery.findByIdAndUpdate({ _id: req.params.id }, {
        return: false
    }, { new: true })
    console.log(cancelReturn)
    const returnOrder = await Return.findOneAndDelete({ order: cancelReturn._id })
    res.status(200).json({
        status: 'success',
        cancelReturn
    })
})

//=============== PAYPAL SUCCESSS ==============
exports.paypalSuccess = catchAsync(async (req, res, next) => {
    console.log('you are here')
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        "transaction": [{
            amount: {
                "currency": "USD",
                "total": "1.0",
            }
        }]
    }
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response success messaege");
            console.log(payment);
            res.status(200).json({
                status: 'success'
            })
        }
    })
})

//================ CANCEL ORDER ================
exports.cancelProduct = catchAsync(async (req, res, next) => {
    const order = await Order.findOneAndUpdate({ user: req.user._id, 'orderItems._id': req.params.id }, {
        'orderItems.$.cancel': true
    }, { new: true })
    console.log(order.orderItems)
    let totalPrice;
    order.orderItems.forEach(e => {
        if (e.cancel) {
            console.log(e.productName)
            console.log(e.price)
            console.log(order.totalPrice)
            totalPrice = order.totalPrice - e.price
        }
        console.log(e.price, order.totalPrice, totalPrice)

    })

    const neworder = await Order.findOneAndUpdate({ user: req.user._id, 'orderItems._id': req.params.id }, {
        totalPrice
    })


    res.redirect(`/orderDetail/${order._id}`)
})

//================ RETURN ORDER ================
exports.returnProduct = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const order = await Delivery.findOneAndUpdate({ user: req.user._id, _id: req.params.id }, {
        return: true,
        paymentStatus: 'Return Product'
    });
    const returnOrder = await Return.create({ order: order._id, returnReason: req.body.returnReason })
    res.redirect('/profile')
})

//============== ADMIN APPROVE RETURN ========================
exports.approveReturn = catchAsync(async (req, res, next) => {
    console.log(req.body, req.params.id)
    const order = await Delivery.findOne({ _id: req.params.id })
    let productName;
    let totalPrice = order.totalPrice;
    order.orderItems.forEach(e => {
        productName = e.productName
    })
    const walletAmount = await Wallet.findOneAndUpdate({ user: order.user })
    const amount = walletAmount.amount + order.totalPrice
    console.log(amount)
    const wallet = await Wallet.findOneAndUpdate({ user: order.user }, {
        amount,
        $push: {
            transcation: {
                productName,
                amount: totalPrice,
                date: new Date(Date.now()),
                method: 'Credit',
                getit: true
            }
        }
    }, { new: true })
    const returnOrderAmount = await Delivery.findOneAndUpdate({ _id: req.params.id }, {
        returnAmount: true
    }, { new: true })
    console.log(returnOrderAmount)
    res.status(200).json({
        status: 'success',
        wallet,
        returnOrderAmount
    })
})

// //================ RETURN ORDER ================
// exports.returnProduct = catchAsync(async (req, res, next) => {
//     const order = await Order.findOneAndUpdate({ user: req.user._id, 'orderItems._id': req.params.id }, {
//         'orderItems.$.cancel': true
//     })
//     res.redirect('/profile')
// })



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
    }, { new: true })
    console.log(order)
    if (req.body.status == 'delivered') {
        const { user, shippingAddress, PaymentMethod, totalPrice, paymentStatus } = order
        let orderItems = []
        order.orderItems.forEach(e => {
            orderItems.push(e)
        })
        console.log(orderItems)
        const deliveryOrder = await Delivery.create({ user, shippingAddress, PaymentMethod, totalPrice, paymentStatus, orderItems })
        const deleteOrder = await Order.findOneAndDelete({ _id: order._id })
    }
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
        const updateorder = await Order.findByIdAndUpdate({ _id: order.receipt }, {
            paymentStatus: 'Completed'
        }, { new: true })
        console.log(`new order${updateorder}`)
        res.status(200).json({
            status: 'success'
        })
        const delCart = await Cart.findOneAndDelete({ user: req.user._id })


    } else {
        res.status(200).json({
            status: 'fail'
        })
    }
})


//============= ORDER DETAIL ===============
exports.orderDetail = catchAsync(async (req, res, next) => {
    let order = await Order.findOne({ _id: req.params.id })
    if (!order) {
        order = await Delivery.findOne({ _id: req.params.id })
    }
    res.status(200).render('user/orderDetail', {
        order
    })
})