const multer = require('multer');
const sharp = require('sharp')
const Product = require('../../modeling/productModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');




const response = (content, statusCode, res) => {
    res.status(statusCode).json({
        status: 'success',
        content
    })
}

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        // const ext = file.mimetype.split('/')[1];
        const ext = 'jpg'
        cb(null, `product-${req.body.productName}-${Date.now()}.${ext}`)
    }
})

// const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    console.log(file)
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an Image!!', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadImage = upload.fields([
    { name: 'image', maxCount: 4 }
]);

// exports.uploadImage = upload.single('image');

exports.resizeProductImage = catchAsync(async (req, res, next) => {
    console.log(req.body, req.files)
    next()
    // if (!req.body.image) {
    //     return next()
    // }

    // req.body.images = []
    // await Promise.all(
    //     req.files.image.map(async (file, i) => {
    //         const filename = `product-${req.body.productName}-${i + 1}.jpeg`;
    //         await sharp(file.buffer)
    //             .resize(500, 500)
    //             .toFormat('jpeg')
    //             .jpeg({ quality: 90 })
    //             .toFile(`public/images/${filename}`)
    //         req.body.images.push(filename);
    //     })
    // )

    // next();

})

// exports.resizeImage = (req, res, next) => {
//     if (!req.file) return next();
//     req.file.filename = `product-${req.body.productName}-${Date.now()}.jpeg`;
//     sharp(req.file.buffer)
//         .resize(500, 500)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/${req.file.filename}`)
//     next();
// }

exports.addProduct = catchAsync(async (req, res, next) => {
    console.log(`file ${req.file}`)
    console.log(req.body)
    let {
        productName,
        brand,
        varient,
        color,
        price,
        category,
        quantity,
        offer_name,
        discount,
        discription
    } = req.body
    let minusPrice = price * discount / 100
    let discountPrice = parseInt(price - minusPrice)
    // console.log(`file name is ${req.file}`)
    let image = []
    req.files.image.forEach(el => {
        image.push(el.filename)
    })
    console.log(`this is image name ${image}`)
    const newProduct = await Product.create({
        productName,
        brand,
        varient,
        color,
        price,
        discountPrice,
        category,
        quantity,
        offer_name,
        discount,
        discription,
        image
    });
    console.log(newProduct);
    response(newProduct, 200, res)
})


exports.listProduct = catchAsync(async (req, res, next) => {
    const allProduct = await Product.find();
    response(allProduct, 200, res)
})

exports.updateProduct = catchAsync(async (req, res, next) => {


    let {
        productName,
        brand,
        varient,
        color,
        price,
        category,
        quantity,
        offer_name,
        discount,
        discription
    } = req.body
    let minusPrice = price * discount / 100
    let discountPrice = parseInt(price - minusPrice)
    // console.log(`file name is ${req.file}`)
    console.log(req.body)

    // const image = req.file.filename;
    const product = await Product.findByIdAndUpdate({ _id: req.params.id },
        {
            productName,
            brand,
            varient,
            color,
            price,
            discountPrice,
            category,
            quantity,
            offer_name,
            discount,
            discription,
            // image
        },
        {
            new: true,
            runValidators: true,
            upsert: true
        });


    if (!product) {
        return next(new AppError('there is no product with this name', 404))
    }
    response("update successfully", 200, res)
})

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const deleteP = await Product.findByIdAndDelete(req.params.id)
    console.log('delete product')
    if (!deleteP) {
        return next(new AppError('there is no product with this name', 404))
    }
    // response('success', 200, res)
    res.redirect('/admin/product')
})

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.find({ _id: req.params.id })
    if (!product) {
        return next(new AppError('product doesnt exist !!!!'))
    }
    response(product, 200, res)
})


