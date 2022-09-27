const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    role: {
        type: String,
        enum: ['seller', 'customer', 'admin'],
        default: 'customer'
    },
    warrantyAddress: {
        type: String
    },
    businessName: {
        type: String,
        default: undefined
    },
    isSellerVerified: {
        type: Boolean,
        default: false
    },
    sellerAddress: {
        type: String
    }
}, {
    timestamps: true
})

const User = new mongoose.model("User", UserSchema);

module.exports = User;