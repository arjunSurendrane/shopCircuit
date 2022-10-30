module.exports = function (err, req, res, next) {
    console.log(err)
    err.statusCode = err.statusCode || 500;
    if (err.statusCode < 500) {
        res.status(404).render('error')
    } else {
        err.status = err.status || 'error';
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            err
        })
    }



}




