const createError = require('http-errors');
const express = require('express');
const path = require('path');
const Razorpay = require('razorpay')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const dotenv = require('dotenv')
const crypto = require('crypto')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')
const hbs = require('express-handlebars')




const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  next()
})

app.use('/admin', adminRouter);
app.use('/', indexRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl} in this server!!`, 404))
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(globalErrorHandler);

module.exports = app;
