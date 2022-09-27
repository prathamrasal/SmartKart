const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth');
const productController = require('../controller/productController')
const upload = require("../middlewares/multer");
const restrictTo = require('../middlewares/restrictTo');

router
    .route('/')
    .get(productController.getAllProducts)
    .post(checkAuth, restrictTo('seller'), upload.single("image"), productController.addProduct)

router
    .route('/:id')
    .patch(checkAuth, restrictTo('seller'), productController.updateProduct)

router
    .route('/sellerProduct/:id')
    .get(productController.getProduct)


module.exports = router