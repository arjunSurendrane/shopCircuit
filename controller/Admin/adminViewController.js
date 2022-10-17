const User = require("../../modeling/userModel");
const Order = require("../../modeling/orderModel");
const Coupon = require("../../modeling/couponModel");
const Product = require("../../modeling/productModel");
const Category = require("../../modeling/categoryModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const async = require("hbs/lib/async");
const Cart = require("../../modeling/cartModel");
//===========DATE FUNCTION=============
const date = () => {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var newdate = day + "/" + month + "/" + year;
    return newdate;
};
// =============DASHBOARD=================
exports.dashboardDemo = catchAsync(async (req, res, next) => {
    const completeOrders = await Order.find({
        paymentStatus: "Completed",
    }).populate("user");
    const upiPayment = await Order.find({
        paymentStatus: "Completed",
        PaymentMethod: "UPI",
    });
    const codPayment = await Order.find({
        paymentStatus: "Completed",
        PaymentMethod: "COD",
    });

    const pendingOrders = await Order.find({ paymentStatus: "Pending" }).populate(
        "user"
    );

    let totalAmount = 0;
    completeOrders.forEach((el) => {
        totalAmount = el.totalPrice + totalAmount;
    });
    let totalCompleteOrders = completeOrders.length;
    let totalPendingOrders = pendingOrders.length;
    let totalUpi = upiPayment.length;
    let totalCod = codPayment.length;
    let today = date();
    let month = today.split("/")[1];
    let year = today.split("/")[2];
    let jan = 0;
    let feb = 0;
    let mar = 0;
    let apr = 0;
    let may = 0;
    let jun = 0;
    let jul = 0;
    let aug = 0;
    let oct = 0;
    let nov = 0;
    let dec = 0;
    let sep = 0;
    let thisMonth = 0;
    console.log(year, month);
    completeOrders.forEach((el) => {
        if (el.createdAt.split("/")[2] == year) {
            if (el.createdAt.split("/")[1] == 1) {
                jan = el.totalPrice + jan;
                if (month == 1) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 2) {
                feb = el.totalPrice + feb;
                if (month == 2) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 3) {
                mar = el.totalPrice + mar;
                if (month == 3) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 4) {
                apr = el.totalPrice + apr;
                if (month == 4) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 5) {
                may = el.totalPrice + may;
                if (month == 5) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 6) {
                jun = el.totalPrice + jun;
                if (month == 6) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 7) {
                jul = el.totalPrice + jul;
                if (month == 7) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 8) {
                aug = el.totalPrice + aug;
                if (month == 8) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 9) {
                sep = el.totalPrice + sep;
                if (month == 9) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 10) {
                oct = el.totalPrice + oct;
                if (month == 10) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 11) {
                nov = el.totalPrice + nov;
                if (month == 12) thisMonth = el.totalPrice + thisMonth;
            } else if (el.createdAt.split("/")[1] == 12) {
                dec = el.totalPrice + dec;
                if (month == 12) thisMonth = el.totalPrice + thisMonth;
            }
        }
    });
    console.log(jan, feb, mar, sep);
    // let today = new Date(Date.now())
    // let todayDate = `${today}`
    // console.log(todayDate)
    // const thisMonth = todayDate.split(' ')[1]
    // const thisYear = todayDate.split(' ')[3]
    // console.log(completeOrders)
    const category = await Category.find();
    let cat;
    category.forEach((el) => {
        cat += { ...el.categoryName };
    });
    console.log(cat);

    res.status(200).render("admin/Dashboard/adminDashboard", {
        thisMonth,
        jan,
        feb,
        mar,
        apr,
        may,
        jun,
        jul,
        aug,
        sep,
        oct,
        nov,
        dec,
        totalUpi,
        totalCod,
        totalPendingOrders,
        totalCompleteOrders,
        totalAmount,
        admin: true,
    });
});
//============AGGREGATE TO CALCULATE REVENUE============
exports.aggregation = catchAsync(async (req, res, next) => {
    const order = await Order.aggregate([
        {
            $match: {
                totalPrice: { $gt: 60000 },
            },
        },
        {
            $group: {
                _id: "$PaymentMethod",
                num: { $sum: 1 },
                totalRevenue: { $sum: "$totalPrice" },
            },
        },
    ]);
    console.log(order);
    res.status(200).json({
        length: order.length,
        order,
    });
});
//==============CALCULATE YEARLY REVENUE==============
exports.dashboard = catchAsync(async (req, res, next) => {
    let year = date();
    year = parseInt(year.split('/')[2])
    console.log(year);
    const start = new Date(`${year}-01-01T09:04:13.671Z`);
    const end = new Date(`${year}-12-01T09:04:13.671Z`);
    console.log(start, end);
    const revenue = await Order.aggregate([
        {
            $unwind: "$createdAt",
        },
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year}-12-01`),
                },
            },
        },
        {
            $group: {
                _id: { $month: "$createdAt" },
                totalPrice: {
                    $sum: "$totalPrice",
                },
            },
        }
    ]);
    const paymentOption = await Order.aggregate([
        {
            $match: {
                totalPrice: { $gt: 60000 },
            },
        },
        {
            $group: {
                _id: "$PaymentMethod",
                num: { $sum: 1 },
                totalRevenue: { $sum: "$totalPrice" },
            },
        },
    ]);
    const pendingOrders = await Order.aggregate([
        {
            $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 }
            }
        }
    ])

    const yearly = await Order.aggregate([
        {
            $unwind: "$createdAt",
        },
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${year}-01-01`),
                    $lt: new Date(`${year}-12-01`),
                },
            },
        },
        {
            $group: {
                _id: { $year: "$createdAt" },
                totalPrice: {
                    $sum: "$totalPrice",
                },
            },
        },
    ]);



    console.log(yearly);
    res.status(200).render("admin/Dashboard/adminDashboard", {
        admin: true,
        revenue,
        paymentOption,
        yearly,
        pendingOrders,
    });
});
//==============PRODUCT VIEW===================
exports.productView = catchAsync(async (req, res, next) => {
    const product = await Product.find();
    res.status(200).render("admin/product/admin-productView", {
        status: "success",
        admin: true,
        product,
    });
});
//================USER VIEW====================
exports.userView = catchAsync(async (req, res, next) => {
    const user = await User.find();
    res.status(200).render("admin/users/adminUserView", {
        status: "success",
        user,
        admin: true,
    });
});
//=============CATEGORY VIEW===================
exports.categoryView = catchAsync(async (req, res, next) => {
    const category = await Category.find();
    res.status(200).render("admin/category/adminCategoryView", {
        status: "success",
        category,
        admin: true,
    });
});
//=================PRODUCT EDIT VIEW===================
exports.productEdit = catchAsync(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.id });
    console.log(product);
    console.log("Inside");
    res.status(200).render("admin/product/adminProductEdit", {
        product,
        style: "login",
        admin: true,
        product,
    });
});
//==============CATEGORY EDIT VIEW====================
exports.categoryEdit = catchAsync(async (req, res, next) => {
    const category = await Category.findOne({ _id: req.params.id });
    res.status(200).render("admin/category/adminCategoryEdit", {
        style: "login",
        admin: true,
        category,
    });
});
//===============CATEGORY ADD VIEW===================
exports.categoryAdd = (req, res) => {
    res.status(200).render("admin/category/adminCategoryAdd", {
        style: "login",
        admin: true,
    });
};
//=============USER ADD======================
exports.userAdd = (req, res) => {
    res.status(200).render("admin/users/adminUserAdd", {
        style: "login",
    });
};
// =================ORDER==================
exports.order = catchAsync(async (req, res, next) => {
    const order = await Order.find().populate("user");
    console.log(order);
    res.status(200).render("admin/orders/adminOrderView", {
        order,
        admin: true,
    });
});
// ================SALES========================
exports.sales = catchAsync(async (req, res, next) => {
    const completeOrders = await Order.find({
        paymentStatus: "Completed",
    }).populate("user");
    const pendingOrders = await Order.find({ paymentStatus: "Pending" }).populate(
        "user"
    );
    let totalAmount = 0;
    let pendingAmount = 0;
    completeOrders.forEach((el) => {
        totalAmount = el.totalPrice + totalAmount;
    });
    pendingOrders.forEach((el) => {
        pendingAmount = el.totalPrice + pendingAmount;
    });
    res.status(200).render("admin/sales/adminSalesReport", {
        pendingAmount,
        totalAmount,
        completeOrders,
        pendingOrders,
        admin: true,
    });
});

//============RENDER COUPON PAGE===================
exports.coupon = catchAsync(async (req, res, next) => {
    const coupon = await Coupon.find();
    res.status(200).render("admin/coupon/adminCouponView", {
        admin: true,
        coupon,
    });
});

//============RENDER COUPON EDIT PAGE===============
exports.editCoupon = catchAsync(async (req, res, next) => {
    const coupon = await Coupon.findById({ _id: req.params.id });
    res.status(200).render("admin/coupon/adminCouponEdit", {
        admin: true,
        coupon,
    });
});

//============RENDER COUPEN ADD PAGE=================
exports.addCoupon = catchAsync(async (req, res, next) => {
    res.status(200).render("admin/coupon/adminCouponAdd", {
        admin: true,
    });
});

//==========RENDER PRODUCT OFFER PAGE============
exports.productOffer = catchAsync(async (req, res, next) => {
    const product = await Product.find();
    res.status(200).render("admin/offer/productOffer", {
        admin: true,
        product,
    });
});

//==========RENDER CATEGORY OFFER PAGE============
exports.categoryOffer = catchAsync(async (req, res, next) => {
    const category = await Category.find();
    res.status(200).render("admin/offer/categoryOffer", {
        admin: true,
        category,
    });
});

//=========RENDER PRODUCT OFFER PAGE=============
exports.editProductOffer = catchAsync(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.id });
    res.status(200).render("admin/offer/productOfferEdit", {
        admin: true,
        product,
    });
});

//=========RENDER CATEGORY OFFER PAGE=============
exports.editCategoryOffer = catchAsync(async (req, res, next) => {
    const category = await Category.findOne({ _id: req.params.id });
    res.status(200).render("admin/offer/categoryOfferEdit", {
        admin: true,
        category,
    });
});
