// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the books model
let book = require('../models/books');

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
    res.render('content/index', {
        title: 'Home',
        books: ''
    });
});

// GET to display login page
router.get('/login', (req, res, next) => {
    res.render('content/index', {
        title: 'Home',
        books: ''
    });
});

// POST to process login page
router.post('/login', (req, res, next) => {
    res.render('content/index', {
        title: 'Home',
        books: ''
    });
});

// GET to display registration page
router.get('/register', (req, res, next) => {
    res.render('content/index', {
        title: 'Home',
        books: ''
    });
});

// POST to process registration page
router.post('/register', (req, res, next) => {
    res.render('content/index', {
        title: 'Home',
        books: ''
    });
});

// GET to logout user
router.get('/logout', (req, res, next) => {
    res.render('content/index', {
        title: 'Home',
        books: ''
    });
});

module.exports = router;