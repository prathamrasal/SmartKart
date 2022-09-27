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

const moment = require('moment');
const { sendEmail } = require("../utils/sendEmail");

const getPinataURIs = async (id) => {

  const orderData = await Order.findById(id)
    .populate("product")
    .populate("seller")
    .populate("customer");
  const activeCardSVG = returnCardString(
    orderData.product.name,
    orderData.customer.username,
    orderData.orderId,
    orderData.createdAt,
    orderData.product.warranty,
    `${orderData.customerWallet.slice(0, 3)}...${orderData.customerWallet.slice(
      orderData.customerWallet.length - 4,
      orderData.customerWallet.length
    )}`
  );
  const expiryCardSVG = returnExpireCardString(
    orderData.product.name,
    orderData.customer.username,
    orderData.orderId,
    `${moment(orderData.createdAt).day()} ${moment(orderData.createdAt).format('MMM')} ${moment(orderData.createdAt).year()}`,
    orderData.product.warranty,
    `${orderData.customerWallet.slice(0, 3)}...${orderData.customerWallet.slice(
      orderData.customerWallet.length - 4,
      orderData.customerWallet.length
    )}`
  );
  let base64Active = svg64(activeCardSVG);
  let base64Expire = svg64(expiryCardSVG);
  const activeTemplate = returnTemplate(orderData, base64Active, true);
  const expiryTemplate = returnTemplate(orderData, base64Expire, false);

  const pinataURIActive = await storeTokenUriMetaData(activeTemplate);
  const pinataURIExpiry = await storeTokenUriMetaData(expiryTemplate);

  return {
    expireTokenURI: `ipfs://${pinataURIExpiry.IpfsHash}`,
    activeTokenURI: `ipfs://${pinataURIActive.IpfsHash}`
  }
}

exports.placeOrder = catchAsync(async (req, res, next) => {
  const {
    productId,
    customerName,
    customerContact,
    couponCode,
    houseNumber,
    state,
    shippingMethod,
    city,
    pincode,
    country,
    customerWallet,
  } = req.body;
  let newOrder = [];
  let totalCost = 0;
  if (typeof productId == "string") {
    productId = Array(productId);
  }
  for (let i = 0; i < productId.length; i++) {
    const product = await Product.findById(productId[i]);
    if (!product) {
      return next(new AppError("Invalid Product Id Provided", 403));
    }
    totalCost += +product.cost;

    const order = new Order({
      seller: product.seller,
      customer: req.user.id,
      orderId: generateUniqueId({
        length: 10,
        useLetters: false,
      }),
      couponCode,
      customerWallet,
      orderDetails: {
        customerName,
        customerAddress: {
          houseNumber,
          city,
          state,
          pincode,
          country,
        },
        customerContact,
      },
      shippingMethod,
      totalCost,
      product: productId[i],
    });
    const tempOrd = await order.save();
    const pinataURIs = await getPinataURIs(tempOrd.id);
    const orderFromDB = await Order.findById(tempOrd.id);
    orderFromDB.activeTokenURI = pinataURIs.activeTokenURI;
    orderFromDB.expireTokenURI = pinataURIs.expireTokenURI;
    const orderUpdated = await orderFromDB.save();
    newOrder.push(orderUpdated);
  }
  const cart = await Cart.findOne({ user: req.user.id });
  cart.product = [];
  await cart.save();
  res.json({
    success: true,
    message: "Orders Placed Succesfully",
    order: newOrder,
  });
});

const returnTemplate = (request, URI) => {
  const metaDataTemplate = {
    name: order.product.name,
    description: order.product.description,
    image: URI,
    attributes: [{
      "Order ID": order.orderId,
      "Customer Name": order.customer.username,
      "Product Name": order.product.name,
      "Warranty": `${order.product.warranty} Months`,
      "Seller Name": order.seller.businessName,
      "Price": order.product.cost,
      "isExpired": expired
    }]
  }
  return metaDataTemplate;
}

exports.getMyOrder = catchAsync(async (req, res, next) => {
  if (req.user.role == "seller") {
    const myOrder = await Order.find({ seller: req.user.id })
      .populate("seller")
      .populate("customer")
      .populate("product");
    res.json({ orders: myOrder });
  } else if (req.user.role == "customer") {
    const myOrder = await Order.find({ customer: req.user.id })
      .populate("seller")
      .populate("customer")
      .populate("product");

    res.json({ orders: myOrder });
  } else {
    return next(new AppError("UnAuthorized User", 403));
  }
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("seller");
  if (!order) {
    return next(new AppError("Invalid Order Id Provided", 403));
  }
  if (order.orderStatus == "delivered") {
    return next(new AppError("Order Status Delivered Can't be changed.", 403));
  }
  const { status } = req.body;
  if (req.user.id === order.seller.id) {
    order.orderStatus = status;

    await order.save();
    const updatedOrderFromDB = await Order.findById(req.params.id)
      .populate("product")
      .populate("seller")
      .populate("customer");
    res.json({
      success: true,
      message: `Order Status Changed To ${status}`,
      updatedOrder: updatedOrderFromDB,
    });
  } else {
    res.json({ success: false, message: "Unauthorized" });
  }
});

exports.mintNFT = catchAsync(async (req, res, next) => {
  let { tokenId } = req.body;
  if (!tokenId) {
    return next(new AppError("Token Id Not Provided", 400));
  }
  const orders = await Order.findOne({ orderId: req.params.id });
  if (!orders) {
    return next(new AppError("Invalid Order Id Provided", 400));
  }
  if (isNftMinted) {
    sendEmail("prathamrasal6@gmail.com")
  }
  orders.isNftMinted = true;
  orders.tokenId = tokenId;
  const updatedOrder = await orders.save();
  res.json({
    success: true,
    message: "NFT Uri stored Succesfully",
    updatedOrder,
  });
});

exports.getSingleOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderId: req.params.id })
    .populate("product")
    .populate("seller")
    .populate("customer");
  if (!order) {
    return next(new AppError("Order Not Found", 404));
  }
  res.json({ success: true, order });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderId: req.params.id });
  order.orderStatus = "Cancelled";
  await order.save();
  res.json({ success: true, message: "Order Cancelled Succesfully" });
});

exports.getWarrantyAddresses = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const allOrderWithWalletId = await Order.find({
    customerWallet: id,
  }).populate("seller");
  let warrantyContracts = [];
  for (let order of allOrderWithWalletId) {
    if (order.isNftMinted) {
      let warrantyContract = order.seller.warrantyAddress;
      if (!warrantyContracts.includes(warrantyContract)) {
        warrantyContracts.push(warrantyContract);
      }
    }
  }
  console.log(warrantyContracts);
  return res.json(warrantyContracts);
});
