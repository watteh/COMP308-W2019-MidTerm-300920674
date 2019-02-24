// moddules for node and express
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

// modules required for authentication
let session = require('express-session');
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

// import "mongoose" - required for DB Access
let mongoose = require('mongoose');
// URI
let config = require('./config/db');

mongoose.connect(process.env.URI || config.URI, { useNewUrlParser: true });

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
    console.log("Connected to MongoDB...");
});


// define routers
let index = require('./routes/index'); // top level routes
let books = require('./routes/books'); // routes for books

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /client
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

// setup for express session
app.use(session({
    secret: "SomeSecret", //assigns session id cookie
    saveUninitialized: false, //false will help with race conditions and is useful for login
    resave: false // true is deprecated, so should be false
}));

// Initialize flash
app.use(flash());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// create user model
let userModel = require('./models/user');
let User = userModel.User;

// implement a user authentication strategy
passport.use(User.createStrategy());

// serialize and deserialize user information
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// route redirects
app.use('/', index);
app.use('/books', books);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;