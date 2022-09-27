const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    product: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})
const Cart = mongoose.model("Cart", CartSchema)
module.exports = Cart;