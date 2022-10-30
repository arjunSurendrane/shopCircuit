const mongoose = require('mongoose')
const date = () => {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = day + "/" + month + "/" + year;
    return newdate;
};
const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'wallet must have user id']
    },
    amount: {
        type: Number,
        default: 0
    },
    transcation: [{
        productName: {
            type: String
        },
        amount: {
            type: Number
        },
        date: {
            type: Date,
            default: new Date(Date.now())
        },
        method: {
            type: String
        },
        getit: {
            type: Boolean
        }
    }]
})

const Wallet = mongoose.model('Wallet', walletSchema)
module.exports = Wallet