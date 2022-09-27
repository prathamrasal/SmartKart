const User = require('../models/User')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

exports.changeRole = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    let { role } = req.body
    role = role.toLowerCase();
    if (role == 'admin' || role == 'seller' || role == 'customer') {
        user.role = role;
        await user.save()
        res.json({ success: true, message: `User Role Changed To ${role} Succesfully`, user })
    }
    return next(
        new AppError('Invalid Role Entered', 403)
    )
})

exports.verifyToken = catchAsync(async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({
            error: true,
            message: "Token is required."
        });
    }
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) return res.status(401).json({
            error: true,
            message: "Invalid token."
        });
        return res.json(user);
    });
})

exports.verifySeller = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'seller') {
        return next(
            new AppError("Only Seller's are Allowed", 400)
        )
    }
    const seller = await User.findById(req.user.id);
    if (!seller) {
        return next(
            new AppError("Invalid Seller", 400)
        )
    }
    if (seller.isSellerVerified) {
        return next(
            new AppError("Seller Is Already Verified", 204)
        )
    }
    const { warrantyAddress, sellerAddress } = req.body;
    if (!warrantyAddress || !sellerAddress) {
        return next(
            new AppError("Metamask Address Not Provided, Verification Failed", 400)
        )
    }
    const user = await User.find({ isSellerVerified: true })
    for (let i = 0; i < user.length; i++) {
        if (user.sellerAddress == sellerAddress) {
            return next(
                new AppError("Seller Address Already Exists", 400)
            )
        }
        if (user.warrantyAddress == warrantyAddress) {
            return next(
                new AppError("Waranty Address Already Exists", 400)
            )
        }
    }
    if (!warrantyAddress || !sellerAddress) {
        return next(
            new AppError("Metamask Address Not Provided, Verification Failed", 400)
        )
    }
    seller.warrantyAddress = warrantyAddress;
    seller.sellerAddress = sellerAddress
    seller.isSellerVerified = true
    const updatedSeller = await seller.save();
    res.json({ success: true, message: "Seller Verified Successfully", updatedSeller })
})