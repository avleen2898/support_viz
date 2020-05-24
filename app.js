const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const usersRouter = require('./api/users');
const healthRouter = require('./api/health');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.use('/health', healthRouter);
app.use('/users', usersRouter);

if (app.get('env') === 'development') {
    require('dotenv').config();
}
require('./loaders/db')

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log('ERRRORORORORRORORO');
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});

module.exports = app;