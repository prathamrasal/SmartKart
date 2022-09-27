const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: Number
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderStatus: {
        type: String,
        default: 'inProgress'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    couponCode: {
        type: String,
    },
    customerAddress: {
        houseNumber: String,
        city: String,
        state: String,
        pincode: Number,
        country: String
    },
    shippingMethod: {
        type: String
    },
    totalCost: {
        type: Number
    }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;