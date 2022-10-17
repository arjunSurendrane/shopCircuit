const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'admin must have email'],
        validate: [validator.isEmail]
    },
    password: {
        type: String,
        required: [true, 'admin must have password']
    },
    role: {
        type: String,
        default: "Admin"
    }
})

AdminSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 8)
})

AdminSchema.methods.comparePassword = async (clientPassword, password) => {
    return await bcrypt.compare(clientPassword, password)
}

const Admin = mongoose.model('admin', AdminSchema);
module.exports = Admin

