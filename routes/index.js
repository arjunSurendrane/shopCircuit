var express = require("express");
var router = express.Router();
const authController = require("../controller/User/userAuthController");
const userController = require("../controller/userView/userViewController");
const cartController = require("../controller/Cart/cartController");
const whishlistController = require("../controller/Whishlist/whishlistController");
const orderController = require("../controller/Order/orderController");
const profileController = require("../controller/Profile/userProfileController");
const reviewController = require('../controller/Review/reviewController')
const user = require("../controller/User/userController");
const value = require('../controller/Length/valuelength')

// ======================AUTHENTICATION===================


// -------1) USED TO CHECK IF USER EXIST OR NOT---------
router.use(authController.isUser);

// ---------2) RENDER HOME PAGE---------
router.route('/').get(userController.home)
router.post("/listProduct", userController.listProduct);

// ---------3)USED FOR REGISTER NEW USER---------
router.route("/signup").post(authController.signup).get(userController.signup);

// ---------4) USED TO LOGIN USER---------
router.route("/login").post(authController.login).get(userController.login);

// --------5) OTP SEND---------------

router
  .route("/login/otp")
  .post(authController.sendOtp)
  .get(userController.otpLogin);
// ---------6) OTP VERIFICATION-----------
router.route("/login/otp/verify").post(authController.verifyOtp);

// ---------5) LOGOUT USER AND CHANGE TOKEN ---------
router.get("/logout", authController.logout);

router.route('/search/:id').get(userController.searchView)

router.route('/search').post(userController.suggestion)

// =====================PRODUCT========================
// ---------6) RENDER PRODUCT DETAIL PAGE---------
router.route("/product/:id").get(userController.getProduct);
//----------10) FORGOT PASSWORD-----------------
router.route('/forgotPassword').get(userController.forgotPassword)
//-----------SEND OTP-----------
router.route('/forgotPassword/otp').post(authController.sendOtpPassword)

//---------VERIFY OTP FOR PASSWORD------------
router.route('/forgotPassword/otp/verify').post(authController.verifyOtpPassword)


//----------12) RENDER NEW PASSWORD PAGE---------
router.route('/newPassword').get(userController.newPassword).post(authController.changePassword)



router.use(authController.permission)



// ================ USER UPDATE====================
// -------------UPDATE USER ADDRESS-------------
router.route("/address").post(user.address);


// ====================CART=====================
// ---------7) RENDER CART PAGE ------------
router.route("/cart").get(userController.cartPage);

// ---------8) ADD OR UPDATE CART COLLECTION---------
router
  .route("/cart/:id")
  .get(cartController.deleteCartItem)
  .post(cartController.addItemToCart);

// ---------9) QUANTITY UPDATE----------
router.route("/cart/quantity/:id").post(cartController.updateQuantity);


router.route('/cartCoupon/offer').post(cartController.addCoupon)


//----------13) CHANGE PASSWORD-------------


//================ CHECKOUT ===================
// --------10) RENDER CHECKOUT PAGE ----------
router
  .route("/checkout")
  .get(userController.checkout)
  .post(orderController.orderCreate);
router.route("/order/cancel/:id").get(orderController.cancelProduct);
router.route("/order/return/:id").post(orderController.returnProduct).get(orderController.return)

router.route("/order/payment").post(orderController.verifyPayment);

// ==============PROFILE==================
// ------------11) RENDER PROFILE PAGE----------
router.route("/profile").get(userController.profile).post(user.userDetails);

router.route('/address').get(userController.address)
router.route('/profileOrders').get(userController.profileOrders)
router.route('/accountDetails').get(userController.accountDetails)
router.route('/deliveredOrders').get(userController.deliveryOrder)


// ===============WHISHLIST=============
//----------------1) RENDER WHISHLIST---------
router.route("/whishlist").get(userController.whishlist);
router.route("/whishlist/:id").get(whishlistController.create);
router.route("/whishlist/delete/:id").get(whishlistController.delete);



//==============RENDER SEARCH RESULT===============


router.get('/invoice', (req, res) => {
  res.status(200).render('user/invoice', {
    invoice: true
  })
})

router.route('/paypal/success').get(orderController.paypalSuccess)
router.route('/invoice/:id').get(userController.invoice)


//=========== API FOR CHECK VALUES ===============
router.route('/cartLength').get(value.cartlength)

router.route('/whishlistLength').get(value.whishlistlength)

router.route('/walletAmount').get(value.walletAmount)

//========== RENDER WALLET ===========
router.route('/wallet').get(userController.wallet)

//=========== ORDER DETAIL ===========
router.route('/orderDetail/:id').get(orderController.orderDetail)

//=========== ADD REVIEW ==============
router.route('/productReview/:id').post(reviewController.addReview).get(userController.reviewPage)

//============== CHECK WISHLIST PRODUCTS =================
router.route('/checkWhishlist').get(whishlistController.checkWhishlist)






module.exports = router;




