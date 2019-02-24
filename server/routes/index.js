// modules required for routing
let express = require('express');
let router = express.Router();
// add passport module
let passport = require('passport');
let mongoose = require('mongoose');

// define the books model
let book = require('../models/books');

// define the user model
let userModel = require('../models/user');
let User = userModel.user; // alias for user

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
    res.render('content/index', {
        title: 'Home',
        // books: '',
        displayName: req.user ? req.user.displayName : ''
    });
});

// GET to display login page
router.get('/login', (req, res, next) => {
    // Check if user is already logged in
    if (!req.user) {
        res.render('auth/login', {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    } else {
        return res.redirect('/');
    }
});

// POST to process login page
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/books');
        });
    })(req, res, next);
});

// GET to display registration page
router.get('/register', (req, res, next) => {
    if (!req.user) {
        res.render('auth/register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    } else {
        return res.redirect('/');
    }
});

// POST to process registration page
router.post('/register', (req, res, next) => {
    // define a new User object
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        displayName: req.body.displayName
    });

    User.register(
        newUser,
        req.body.password,
        (err) => {
            if (err) {
                console.log('Error: Inserting new user');
                if (err.name == "UserExistsError") {
                    req.flash('registerMessage', 'Registration Error: User already exists!');
                    console.log('Error: Inserting new user');
                }
                return res.render('auth/register', {
                    title: 'Register',
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName : ''
                });
            } else {
                // if no error exists, then registration is successful
                // redirect the user
                return passport.authenticate('local')(req, res, () => {
                    res.redirect('/books');
                });
            }
        }
    );
});

// GET to logout user
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;