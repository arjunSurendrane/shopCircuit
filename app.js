var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')
const hbs = require('express-handlebars')

var indexRouter = require('./routes/index');
var adminRouter
  = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// app.engine('hbs', hbs.engine({
//   extname: 'hbs',
//   defaultLayout: 'layout',
//   layoutDir: __dirname + '/views/layouts/',
//   partialsDir: __dirname + '/views/partials/'
// }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  next()
})

app.use('/', indexRouter);
app.use('/admin', adminRouter
);


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
