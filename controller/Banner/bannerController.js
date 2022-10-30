const Product = require("../../modeling/productModel");
const multer = require("multer");
const Banner = require("../../modeling/bannerModel");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

//================= MULTER ======================
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, `banner-${req.body.productName}-${Date.now()}.jpg`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new AppError("Not an Image!!", 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadBannerPhoto = upload.single("image");


//================== CREATE BANNER ================
exports.createBanner = catchAsync(async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    const { productName, productId, discription } = req.body;

    const image = req.file.filename;
    const banner = await Banner.create({
        productName,
        productId,
        discription,
        image,
    });
    res.status(200).json({
        status: "success",
        banner,
    });
});

//================= EDIT BANNER =================
exports.editBanner = catchAsync(async (req, res, next) => {
    console.log(req.body)
    const banner = await Banner.findOneAndUpdate(
        { _id: req.params.id },
        req.body
        , {
            new: true
        });
    console.log(banner)
    res.status(200).json({
        status: 'success'
    })
});

//================ DELETE BANNER ================
exports.deleteBanner = catchAsync(async (req, res, next) => {
    const banner = await Banner.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({
        status: 'success'
    })
});
