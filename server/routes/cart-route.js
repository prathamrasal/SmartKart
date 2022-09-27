const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth');
const cartController = require('../controller/cartController');

router
    .route('/')
    .get(checkAuth, cartController.getItems)
    .post(checkAuth, cartController.addItems)
    
router
    .route('/:id')
    .delete(checkAuth, cartController.removeItems)

module.exports = router;