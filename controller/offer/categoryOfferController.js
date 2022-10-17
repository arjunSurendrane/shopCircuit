const Category = require('../../modeling/categoryModel')
const Product  = require('../../modeling/productModel')
const catchAsync = require('../../utils/catchAsync')



exports.categoryOffer = catchAsync(async(req,res,next)=>{
    console.log('offer')
    const category = await Category.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
    let {_id,offer} = category;
    console.log(_id)
    const product = await Product.find({'category:_id':_id});
    product.forEach( async el =>{
        let {price , discount,_id} = el
        console.log(`price is ${price}, discount is ${discount}, the id is ${_id},  the category offer is ${offer}`)
        if(offer>discount)
        {
            let minusPrice = price*offer/100 
            let  discountPrice = parseInt(price-minusPrice)
            const productFinal = await Product.findOneAndUpdate({_id},{discountPrice},{new:true})
        }else{
            console.log(discount)
            console.log('discount')
            let minusPrice = price*discount/100 
            let  discountPrice = parseInt(price-minusPrice)
            const productFinal = await Product.findOneAndUpdate({_id},{discountPrice},{new:true})
        }
    })
    


    res.status(200).json({
        status:'success',
        category,
        data:'enth myrada'
    })
})