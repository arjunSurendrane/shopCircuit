const mongoose = require("mongoose");
const date = () => {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = day + "/" + month + "/" + year;
    return newdate;
};


const rorderSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryOrder'
    },
    returnReason: {
        type: String
    },
    returnDate: {
        type: Date,
        default: new Date(Date.now())
    }
}, {
    timestamps: true
});

const Return = mongoose.model("Return", rorderSchema);
module.exports = Return;
