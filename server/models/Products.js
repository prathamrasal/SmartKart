const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    warranty: {
        type: String
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String
    }
})

const Product = new mongoose.model("Product", ProductSchema)

module.exports = Product