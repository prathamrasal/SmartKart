const Product = require('../models/Products');
const User = require('../models/User');
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary')

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find().populate('seller')
    let activeProducts = []
    for (let i = 0; i < products.length; i++) {
        if (products[i].seller.isSellerVerified) {
            activeProducts.push(products[i]);
        }
    }
    res.json({ success: true, products: activeProducts })
})

exports.addProduct = catchAsync(async (req, res, next) => {
    const seller = await User.findById(req.user.id);
    if (!seller.isSellerVerified) {
        return next(
            new AppError("Please Connect Your MetaMask Wallet/ Verify Yourself", 400)
        )
    }
    const { name, type, cost, warranty, description } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);
    const url = result.secure_url;
    const newProduct = new Product({
        image: url, name, type, cost, warranty, seller: req.user.id, description
    })

    const addedProduct = await newProduct.save()
    res.json({ success: true, message: "Product Added Succesfully!", product: addedProduct })
})

exports.getProduct = catchAsync(async (req, res, next) => {
    const sellerProduct = await Product.find({ seller: req.params.id })
    // if (sellerProduct.length == 0) {
    //     return next(
    //         new AppError("No Product Found", 404)
    //     )
    // }
    res.json({ success: true, products: sellerProduct })
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { image, name, type, cost, warranty, seller, description } = req.body
    const product = {
        image, name, type, cost, warranty, seller, description
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, { new: true })
    res.json({ success: true, message: "Product Updated Succesfully", updatedProduct })
})