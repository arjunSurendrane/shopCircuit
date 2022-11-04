module.exports = function (err, req, res, next) {
    console.log(err)
    err.statusCode = err.statusCode || 500;

    res.status(404).render('error')




}




