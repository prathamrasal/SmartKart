const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth');
const warrantyController = require('../controller/warrantyController');


router
    .route('/:id')
    .get(checkAuth, warrantyController.getWarrantyAddresses)
    

module.exports = router