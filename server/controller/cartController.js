const Cart = require('../models/Cart')
const User = require('../models/User')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync');

exports.getItems = catchAsync(async (req, res, next) => {
    console.log(req.user.id)
    const cart = await Cart.findOne({ user: req.user.id }).populate('product')
    for(let i=0;i<cart.product.length;i++){
        const seller = await User.findById(cart.product[i].seller)
        cart.product[i].seller = seller
    }
    res.json({ success: true, cart })
})

exports.addItems = catchAsync(async (req, res, next) => {
    const { productId } = req.body;
    if (!productId) {
        return next(
            new AppError("Product Not Provided", 404)
        )
    }
    let cart = await Cart.findOne({ user: req.user.id })
    if (cart.product.includes(productId)){
        res.json({message:"Product Already in Cart"})
    }
    cart.product.push(productId)
    console.log(cart)
    await Cart.findByIdAndUpdate(cart.id, cart)
    res.json({ success: true, message: "Item Added To Cart" })
})

exports.removeItems = catchAsync(async (req, res, next) => {

    let cart = await Cart.findOne({ user: req.user.id }).populate('product');
    console.log(typeof(cart.product[0]));
    cart.product = cart.product.filter(p=>p.id!=req.params.id);
    await cart.save()
    res.json({ success: true, message: "Product Removed Succesfully" })
})