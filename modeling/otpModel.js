const mongoose = require('mongoose')


const otpSchema = mongoose.Schema({
    number:{
        type:Number,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        index:{expires:300}
    }
},{timesamp:true})




const otp = mongoose.model('Otp',otpSchema)

module.exports = otp