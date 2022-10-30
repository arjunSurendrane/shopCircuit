const Category = require('../../modeling/categoryModel')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/appError');


// -----------RESPONSE FUNCTION----------------
const response = (content, statusCode, res) => {
    res.status(statusCode).json({
        status: 'success',
        content
    })
}


// --------------ADD CATEGORY-------------------
exports.addCategory = catchAsync(async (req, res, next) => {
    const category = await Category.create(req.body);
    response(category, 200, res)
    // res.redirect('/admin/category')
});


// -------------DELETE CATEGORY------------------
exports.deleteCategory = catchAsync(async (req, res, next) => {
    const deleteItem = await Category.findByIdAndDelete({ _id: req.params.id })
    if (!deleteItem) {
        return next(new AppError('this item not available'))
    }
    // response('success', 200, res)
    res.redirect('/admin/category')
})


// ------------UPDATE CATEGORY-------------------
exports.updateCategory = catchAsync(async (req, res, next) => {
    const { categoryName, newName } = req.body;
    const updateItem = await Category.findByIdAndUpdate({ _id: req.params.id },
        req.body, { new: true, upsert: true })
    if (!updateItem) {
        return next(new AppError('this category not available!!!', 404))
    }
    response(updateItem, 200, res)
})


//------LIST CATEGORY-------
exports.getCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById({ _id: req.params.id }).populate('products')
    response(category, 200, res)
})
