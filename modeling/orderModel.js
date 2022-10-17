const mongoose = require("mongoose");

const date = () => {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1;
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  var newdate = day + "/" + month + "/" + year;
  return newdate;
};

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Must enter user details"],
  },
  orderItems: [
    {
      productName: {
        type: String,
        required: [true, "enter product Name"],
      },
      quantity: {
        type: Number,
        required: [true, "Enter quantity"],
      },
      image: [
        {
          type: String,
          required: [true, "Enter Image Link"],
        },
      ],
      price: {
        type: Number,
        required: [true, "Enter Price"],
      },
      status: {
        type: String,
        default: "Confirm Order",
      },
      cancel: {
        type: Boolean,
        default: false,
      },
    },
  ],
  shippingAddress: {
    type: String,
    required: [true, "Please select shipping address"],
  },
  PaymentMethod: {
    type: String,
    required: [true, "Please select paymenth method"],
  },
  totalPrice: {
    type: Number,
    required: [true, "must enter total price"],
  },
  createdAt: {
    type: String,
    default: date(),
  },
  paymentStatus: {
    type: String,
    default: "Pending",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
