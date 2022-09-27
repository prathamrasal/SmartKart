const router = require('express').Router()
const checkAuth = require('../middlewares/checkAuth');
const userController = require('../controller/userController');
const authController = require('../controller/authController')
const restrictTo = require('../middlewares/restrictTo');

router
    .route('/verifyToken')
    .post(authController.verifyToken)

router
    .route("/login")
    .post(userController.loginUser)

router
    .route("/createUser")
    .post(userController.createUser)

router
    .route("/logout")
    .get(checkAuth, userController.logoutUser)

router
    .route('/verifySeller')
    .post(checkAuth, restrictTo('seller'), authController.verifySeller)

router
    .route("/updateUser/:id")
    .patch(checkAuth, userController.updateUser)

router
    .route("/removeUser/:id")
    .delete(checkAuth, restrictTo('admin'), userController.removeUser)

router
    .route("/getUser")
    .get(checkAuth, userController.getUser)

router
    .route('/changeRole/:id')
    .patch(checkAuth, restrictTo('admin'), authController.changeRole)

module.exports = router