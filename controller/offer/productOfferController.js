const Product = require('../../modeling/productModel')
const catchAsync = require('../../utils/catchAsync')



exports.productOffer = catchAsync(async(req,res,next)=>{
    const product = await Product.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    let {price , discount} = product
    let minusPrice = price*discount/100 
    let  discountPrice = parseInt(price-minusPrice)
    const productFinal = await Product.findOneAndUpdate({_id:req.params.id},{discountPrice},{new:true})

    res.status(200).json({
        status:'success',
        productFinal
    })
})