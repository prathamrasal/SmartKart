const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth');
const orderController = require('../controller/orderController');
const restrictTo = require('../middlewares/restrictTo');

router
    .route('/')
    .get(checkAuth, orderController.getMyOrder)
    .post(checkAuth, orderController.placeOrder)

router
    .route('/:id')
    .post(checkAuth, restrictTo('seller', 'customer'), orderController.updateOrderStatus)
    .get(checkAuth, orderController.getSingleOrder)

router
    .route('/cancelOrder/:id')
    .get(checkAuth, orderController.cancelOrder)

router
    .route('/mintNFT/:id')
    .post(checkAuth, orderController.mintNFT)


router
    .route(checkAuth, '/warranty-contracts/:id')
    .get(checkAuth, orderController.getWarrantyAddresses);

module.exports = router;