var express = require("express");
var router = express.Router();
const categoryOfferController = require("../controller/offer/categoryOfferController");
const productOfferController = require("../controller/offer/productOfferController");
const couponController = require("../controller/Coupon/couponController");
const authController = require("../controller/Admin/adminAuthController");
const productController = require("../controller/Product/productController");
const categoryController = require("../controller//Category/categoryController");
const adminController = require("../controller/Admin/adminController");
const orderController = require("../controller/Order/orderController");
const cartController = require("../controller/Cart/cartController");
const Admin = require("../modeling/adminModel");
const adminViewController = require("../controller/Admin/adminViewController");
const Category = require("../modeling/categoryModel");
const catchAsync = require("../utils/catchAsync");

//======RENDER DASHBOARD==========
router.route("/dashboard").get(adminViewController.dashboard);

/* GET users listing. */
router.get("/", (req, res) => {
  res.status(200).render("admin/admin-login", {
    style: "login",
    admin: true,
  });
});

router.post("/register", async (req, res) => {
  try {
    await Admin.create(req.body);
    res.json({
      status: "success",
    });
  } catch (err) {
    res.json({
      err,
    });
  }
});

// ------LOGIN-----------
router.post("/login", authController.login);

// ------PRODUCT MANAGMENT--------
router
  .route("/product")
  .post(
    productController.uploadImage,
    productController.resizeProductImage,
    productController.addProduct
  )
  .get(authController.isAdmin, adminViewController.productView);

router.get(
  "/productAdd",
  catchAsync(async (req, res) => {
    const category = await Category.find();
    res.status(200).render("admin/product/adminProductAdd", {
      style: "login",
      category,
      admin: true,
    });
  })
);

router
  .route("/productEdit/:id")
  .get(adminViewController.productEdit)
  .patch(productController.updateProduct);

router.get("/product/details", productController.getProduct);

router.route("/productDelete/:id").get(productController.deleteProduct);

router
  .route("/product/:id")
  .get(adminViewController.productEdit)
  .patch(
    productController.uploadImage,
    productController.resizeProductImage,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);
//  .get(productController.getProduct)

// ---------CATEGORY MANAGMENT-----------
router
  .route("/category")
  .post(categoryController.addCategory)
  .get(authController.isAdmin, adminViewController.categoryView);

router
  .route("/category/:id")
  .post(categoryController.updateCategory)
  .get(adminViewController.categoryEdit);

router.get("/categoryAdd", adminViewController.categoryAdd);

router.route("/categoryDelete/:id").get(categoryController.deleteCategory);

// ---------USER MANAGMENT-----------
router
  .route("/user")
  .get(authController.isAdmin, adminViewController.userView)
  .post(adminController.createUser);

router
  .route("/user/:id")
  .delete(adminController.deleteUser)
  .post(adminController.blockUser)
  .get(adminController.unBlockUser);
router
  .route("/userAdd")
  .get(adminViewController.userAdd)
  .post(adminController.createUser);
router.route("/userDel/:id").get(adminController.deleteUser);

router.route("/userBlock/:id").get(adminController.blockUser);

router.route("/order").get(adminViewController.order);

router
  .route("/order/:id")
  .get(orderController.adminCancelProduct)
  .post(orderController.adminEditProductStatus);

//============SALES REPORT===============
//--------RENDER SALES PAGE-------------
router.route("/sales").get(adminViewController.sales);

//============COUPON======================

router
  .route("/coupon")
  .post(couponController.create)
  .get(adminViewController.coupon);
router.route("/couponAdd").get(adminViewController.addCoupon);
router
  .route("/coupon/:id")
  .post(couponController.update)
  .get(couponController.delete);

router.route("/coupon/edit/:id").get(adminViewController.editCoupon);

router.route("/cartCoupon/offer").post(cartController.addCoupon);

//=========== OFFER MANAGMENT===============
//--------RENDER CATEGORY MANAGMENT------------
router.route("/offer/product").get(adminViewController.productOffer);

//--------RENDER PRODUCT MANAGMENT----------
router.route("/offer/category").get(adminViewController.categoryOffer);

//----------RENDER PRODUCT EDIT PAGE---------------
router
  .route("/offer/product/edit/:id")
  .get(adminViewController.editProductOffer)
  .post(productOfferController.productOffer);

//---------RENDER CATEGORY EDIT PAGE------------
router
  .route("/offer/category/edit/:id")
  .get(adminViewController.editCategoryOffer)
  .post(categoryOfferController.categoryOffer);

module.exports = router;
