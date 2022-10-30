var express = require("express");
var router = express.Router();
const bannerController = require("../controller/Banner/bannerController");
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

//========== ADMIN LOGIN PAGE =================
router.get("/", (req, res) => {
  res.status(200).render("admin/admin-login", {
    style: "login",
    admin: true,
  });
});


//=========== LOGIN API =============
router.post("/login", authController.login);




//========= PROTECT MIDDLEWARE
router.use(authController.isAdmin)



//======RENDER DASHBOARD==========
router.route("/dashboard").get(adminViewController.dashboard);







// =========== PRODUCT MANAGEMENT ===============
router
  .route("/product")
  .post(
    productController.uploadImage,
    productController.resizeProductImage,
    productController.addProduct
  )
  .get(adminViewController.productView);

//=====PRODUCT ADD======
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
//==========PRODUCT EDIT==========
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
  .get(adminViewController.categoryView);

router
  .route("/category/:id")
  .post(categoryController.updateCategory)
  .get(adminViewController.categoryEdit);

router.get("/categoryAdd", adminViewController.categoryAdd);

router.route("/categoryDelete/:id").get(categoryController.deleteCategory);

// ---------USER MANAGMENT-----------
router
  .route("/user")
  .get(adminViewController.userView)
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
router
  .route("/sales")
  .get(adminViewController.sales, adminViewController.salesReport);

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

// ==================sample ===============
router.route("/aggregation").get(adminViewController.aggregation);

//================ BANNER =======================
router.route("/banner").get(adminViewController.banner);

router
  .route("/banner/add")
  .get(adminViewController.addBanner)
  .post(bannerController.uploadBannerPhoto, bannerController.createBanner);

router.route("/banner/delete/:id").delete(bannerController.deleteBanner);

router
  .route("/banner/:id")
  .get(adminViewController.editBanner)
  .patch(bannerController.editBanner)


//============ RENDER DELIVERY ORDER ===============
router.route('/deliveredProduct')
  .get(adminViewController.deliveredProducts)

//============== RENDER RETURN PRODUCT ==========
router.route('/returnProduct').get(adminViewController.return)



//==========ADMIN APPROVE RETURN ===============
router.route('/orderReturn/approve/:id').post(orderController.approveReturn)

//============  ADMIN CANCEL RETURN ============
router.route('/orderReturn/cancel/:id').post(orderController.returnCancel)




module.exports = router;
