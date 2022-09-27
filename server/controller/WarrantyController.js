const Cart = require("../models/Cart");
const Order = require("../models/Orders");
const Product = require("../models/Products");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const generateUniqueId = require("generate-unique-id");
const svg64 = require('svg64');
const { returnCardString } = require("../CardStrings/cardString");
const { returnExpireCardString } = require("../CardStrings/ExpireCardString");
const { storeTokenUriMetaData } = require("../utils/pinataSDK");



exports.getWarrantyAddresses = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const allOrderWithWalletId = await Order.find({
      customerWallet: id,
    }).populate("seller");
    let warrantyContracts = [];
    for (let order of allOrderWithWalletId) {
    warrantyContracts.push({
        tokenId : order.tokenId,
        warrantyContract : order.seller.warrantyAddress,
        orderId : order.orderId
    })
    }
    console.log(warrantyContracts);
    return res.json({warrantyContracts});
  });
  