const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')





const CustomerSchema = new mongoose.Schema({
    block: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: [true, 'user must have a name']

    },
    mob: {
        type: Number,
        required: [true, 'user must have a mobile number']

    },
    email: {
        type: String,
        required: [true, 'user must have a email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail]



    },
    password: {
        type: String,
        required: [true, 'user must have a password'],
        minlength: 4,
        select: false


    },
    confirmPassword: {
        type: String,
        required: [true, 'must enter the confirm password'],
        validate: {
            validator: function (el) {
                return el == this.password
            },
            message: "password are not same"
        }
    },

    address: [{
        Pincode: {
            type: Number,


        },
        city: {
            type: String,


        },
        Locality: {
            type: String,


        },
        BuildingName: {
            type: String,


        },
        Landmark: String,
        AddressType: String

    }],

});



CustomerSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8)
    console.log(this.password)
    this.confirmPassword = undefined;
    next()

})

CustomerSchema.methods.hashPassword = async function (password) {

    password = await bcrypt.hash(password, 8)
    return password
}

CustomerSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

CustomerSchema.methods.changePassword = function (JWTTime) {
    if (this.passwordChangeAt) {
        const passwordTimeStamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10)
        console.log(passwordTimeStamp, JWTTime)
        return passwordTimeStamp < JWTTime
    }
    return false
}

const User = mongoose.model('User', CustomerSchema);
module.exports = User;