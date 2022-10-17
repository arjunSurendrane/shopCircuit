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
  let { quantity } = req.body;
  let cart;
  const price = product.price * quantity;
  if (oldCart) {
    if (oldProduct) {
      res.status(200).json({
        status: "success",
        data: "item already added to cart",
      });
    } else {
      cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        {
          $push: {
            cartItems: {
              product: req.params.id,
              quantity,
              price,
            },
          },
        }
      );
    }
  } else {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: req.params.id,
          quantity,
          price,
        },
      ],
    });
  }
  res.status(200).json({
    status: "success",
    cart,
  });
});

// ===============2) DELETE CARTITEM FROM CART COLLECTION ===============
exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const newCart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } }
  );
  res.redirect("/cart");
});

// ======================3) QUANTITY UPDATE ============================
exports.updateQuantity = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });
  const { quantity } = req.body;
  const price = product.price * quantity;
  const newCart = await Cart.findOneAndUpdate(
    { user: req.user._id, "cartItems.product": req.params.id },
    {
      "cartItems.$.quantity": quantity,
      "cartItems.$.price": price,
    }
  );
  res.status(200).json({
    status: "success",
  });
});

// ===================4) COUPON ADDED TO CART ==================
exports.addCoupon = catchAsync(async (req, res, next) => {
  const { price } = req.body;
  console.log(`this is price ${price}`)
  const newCart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { couponOffer: parseInt(price) },
    { new: true }
  );
  console.log(newCart)
  res.status(200).json({
    status: "success",
    newCart,
  });
});
