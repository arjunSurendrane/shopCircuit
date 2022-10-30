const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
        },
      },
    ],
    couponOffer: {
      type: Number,
    },
    totalPrice: {
      type: Number
    }
  },
  { timeStamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
