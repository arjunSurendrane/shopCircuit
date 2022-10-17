var express = require("express");
var router = express.Router();
const authController = require("../controller/User/userAuthController");
const userController = require("../controller/userView/userViewController");
const cartController = require("../controller/Cart/cartController");
const whishlistController = require("../controller/Whishlist/whishlistController");
const orderController = require("../controller/Order/orderController");
const profileController = require("../controller/Profile/userProfileController");
const user = require("../controller/User/userController");

// ======================AUTHENTICATION===================
// -------1) USED TO CHECK IF USER EXIST OR NOT---------
router.use(authController.isUser);

// ---------2) RENDER HOME PAGE---------
router.get("/", userController.listProduct);

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

// ================ USER UPDATE====================
// -------------UPDATE USER ADDRESS-------------
router.route("/address").post(user.address);

// =====================PRODUCT========================
// ---------6) RENDER PRODUCT DETAIL PAGE---------
router.route("/product/:id").get(userController.getProduct);

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

//================ CHECKOUT ===================
// --------10) RENDER CHECKOUT PAGE ----------
router
  .route("/checkout")
  .get(userController.checkout)
  .post(orderController.orderCreate);
router.route("/order/cancel/:id").get(orderController.cancelProduct);

router.route("/order/payment").post(orderController.verifyPayment);

// ==============PROFILE==================
// ------------11) RENDER PROFILE PAGE----------
router.route("/profile").get(userController.profile).post(user.userDetails);

module.exports = router;

// ===============WHISHLIST=============
//----------------1) RENDER WHISHLIST---------
router.route("/whishlist").get(userController.whishlist);
router.route("/whishlist/:id").get(whishlistController.create);
router.route("/whishlist/delete/:id").get(whishlistController.delete);
