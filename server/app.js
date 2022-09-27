const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
// const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');
const hpp = require('hpp');
const authRoute = require('./routes/auth-route')
const passport = require('passport')
const session = require('express-session')
var cookieParser = require('cookie-parser')
const productRoute = require('./routes/product-route')
const globalErrorHandler = require('./middlewares/globalErrorHandler');
const orderRoute = require('./routes/order-route')
const cartRoute = require('./routes/cart-route')
const warrantyRoute = require('./routes/warranty-route');
const AppError = require('./utils/appError');

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
}

app.use(allowCrossDomain);
app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret: 'somethingsecretgoeshere',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(passport.initialize())
app.use(passport.session())


// set security http headers
app.use(helmet());
app.use(bodyParser.json({
    limit: '500mb'
}));

app.use(bodyParser.urlencoded({
    limit: '500mb',
    parameterLimit: 100000,
    extended: true
}));

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

//  set limit request from same API in timePeroid from same ip
const limiter = rateLimit({
    max: 1000, //   max number of limits
    windowMs: 60 * 60 * 1000, // hour
    message: ' Too many req from this IP , please Try  again in an Hour ! ',
});

app.use('/api', limiter);

// Data sanitization against NoSql query injection
app.use(mongoSanitize()); //   filter out the dollar signs protect from  query injection attact

// Data sanitization against XSS
app.use(xss()); //    protect from molision code coming from html

// testing middleware
app.use((req, res, next) => {
    next();
});


// routes
app.use('/api/auth', authRoute)
app.use('/api/product', productRoute)
app.use('/api/order', orderRoute)
app.use('/api/cart', cartRoute)
app.use('/api/warranty', warrantyRoute)


// handling all (get,post,update,delete.....) unhandled routes
app.all('*', (req, res, next) => {
    next(
        new AppError(`Can't find ${req.originalUrl} on the server`, 404)
    );
});

// error handling middleware
app.use(globalErrorHandler);

module.exports = app;