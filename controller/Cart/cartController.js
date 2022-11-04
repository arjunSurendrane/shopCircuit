const Cart = require("../../modeling/cartModel");
const Product = require("../../modeling/productModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

// =================1) CREATE CART OR ADD ITEMS TO CART====================
exports.addItemToCart = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });
  const oldCart = await Cart.findOne({ user: req.user._id });
  const oldProduct = await Cart.findOne({
    user: req.user._id,
    "cartItems.product": req.params.id,
  });

  //const itemExsits = oldCart.cartItems.find(item => item.product.toString() === req.params.id)

  let { quantity } = req.body;
  let cart;
  const price = product.discountPrice * quantity;
  if (oldCart) {
    if (oldProduct) {
      return res.status(200).json({
        status: "duplicate",
        data: "item already added to cart",
      });
    } else {
      console.log(oldCart.totalPrice, price)
      const totalPrice = oldCart.totalPrice || 0 + parseInt(price)
      cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        {
          $push: {
            cartItems: {
              product: req.params.id,
              quantity,
              price
            },
          },
          totalPrice
        }
      );
    }
  } else {
    const totalPrice = parseInt(price)
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.params.id,
          quantity,
          price,
        },
      ],
      totalPrice
    });
  }
  res.status(200).json({
    status: "success",
    cart,
  });
});

// ===============2) DELETE CARTITEM FROM CART COLLECTION ===============
exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    return res.redirect('/cart')
  }
  console.log(cart)
  let totalPrice = cart.totalPrice
  cart.cartItems.forEach(e => {
    if (e._id == req.params.id) {
      totalPrice = totalPrice - e.price
    }
  })
  const newCart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.id } },
      totalPrice
    }
  );
  res.redirect("/cart");
});

// ======================3) QUANTITY UPDATE ============================
exports.quantityUpdatee = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });
  const cart = await Cart.findOne({ user: req.user._id })
  const { quantity } = req.body;
  const price = product.price * quantity;
  let totalPrice = 0
  const newCart = await Cart.findOneAndUpdate(
    { user: req.user._id, "cartItems.product": req.params.id },
    {
      "cartItems.$.quantity": quantity,
      "cartItems.$.price": price
    }, {
    new: true
  }
  );
  console.log(newCart)
  newCart.cartItems.forEach(e => {
    console.log(e.price)
    totalPrice = e.price + totalPrice
  })
  console.log(totalPrice)
  const necart = await Cart.findOneAndUpdate({ user: req.user._id }, {
    totalPrice
  })

  res.status(200).json({
    status: "success",
  });
});


exports.updateQuantity = catchAsync(async (req, res, next) => {
  console.log(req.body)
  const product = await Product.findOne({ _id: req.params.id });
  let { quantity, operation } = req.body
  if (operation == 'inc') {
    quantity++
  } else {
    quantity--
  }
  const price = product.discountPrice * quantity
  console.log(quantity)
  console.log(product)
  console.log(price)
  const newCart = await Cart.findOneAndUpdate(
    { user: req.user._id, "cartItems.product": req.params.id },
    {
      "cartItems.$.quantity": quantity,
      "cartItems.$.price": price
    }, {
    new: true
  })
  console.log(newCart)
  res.status(200).json({
    status: 'success',
    quantity,
    price,
  })
})

// ===================4) COUPON ADDED TO CART ==================
exports.addCoupon = catchAsync(async (req, res, next) => {
  const { price } = req.body;
  console.log(`this is price ${price}`)
  const newCart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    {
      couponOffer: parseInt(price)
    },
    { new: true }
  );
  console.log(newCart)
  res.status(200).json({
    status: "success",
    newCart,
  });
});
