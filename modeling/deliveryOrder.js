const mongoose = require("mongoose");

const date = () => {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = day + "/" + month + "/" + year;
    return newdate;
};

const dorderSchema = new mongoose.Schema({
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
            productId: {
                type: String
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
                default: "Delivered",
            }
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
        type: Date,
        default: new Date(Date.now()),
    },
    returnPeriod: {
        type: Date,
        default: new Date(Date.now() + 604800000)
    },
    delivery: {
        type: Boolean,
        default: true
    },
    return: {
        type: Boolean,
        default: false
    },
    returnAmount: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Delivery = mongoose.model("DeliveryOrder", dorderSchema);
module.exports = Delivery;
