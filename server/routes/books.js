/* books.js - Ryan Watson - 300920674 - comp308-w2019-midterm-300920674 */
// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// add passport module
let passport = require('passport');

// define the book model
let book = require('../models/books');

// function to require authorization
function requireAuth(req, res, next) {
    //check to see if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('./login');
    }
    next();
}

// GET BOOKS LIST FUNCTION
/* GET books List page. READ */
router.get('/', requireAuth, (req, res, next) => {
    // find all books in the books collection
    book.find((err, books) => {
        if (err) {
            return console.error(err);
        } else {
            res.render('books/index', {
                title: 'Books',
                books: books,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});


// GET BOOK DETAILS FUNCTION
//  GET the Book Details page in order to add a new Book
router.get('/add', requireAuth, (req, res, next) => {
    // Add find method with books list as details page is used for both add and edit
    book.find((err, books) => {
        // If results in error, log error
        if (err) {
            return console.error(err);
            // otherwise, render the details page, passing empty books list
        } else {
            res.render('books/details', {
                title: 'Add a Book',
                books: '',
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});

// ADD NEW BOOK FUNCTION
// POST process the Book Details page and create a new Book - CREATE
router.post('/add', requireAuth, (req, res, next) => {
    // create new book object with data from fields - included description field
    let newBook = book({
        "Title": req.body.title,
        "Description": req.body.description,
        "Price": req.body.price,
        "Author": req.body.author,
        "Genre": req.body.genre
    });

    // use model create method to create book
    book.create(newBook, (err, book) => {
        // if there's an error, log error and end render
        if (err) {
            console.log(err);
            res.end(err);
            // otherwise, complete adding book to list and redirect user back to books list
        } else {
            res.redirect('/books');
        }
    });
});


// GET BOOK DETAILS FUNCTION
// GET the Book Details page in order to edit an existing Book
router.get('/:id', requireAuth, (req, res, next) => {
    // set variable to hold book id
    let id = req.params.id;
    // findById method used to find book with id in model
    book.findById(id, (err, bookObj) => {
        // If error, log it and end render
        if (err) {
            console.log(err);
            res.end(err);
            // otherwise, render details page with details filled in inputs
        } else {
            res.render('books/details', {
                title: 'Update a Book',
                books: bookObj,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});

//  UPDATE BOOK FUNCTION
// POST - process the information passed from the details form and update the document
router.post('/:id', requireAuth, (req, res, next) => {
    // Set variable to hold book id
    let id = req.params.id;

    // Set variable to create new book object that has same id as book being updated
    let updatedBook = book({
        "_id": id,
        "Title": req.body.title,
        "Description": req.body.description,
        "Price": req.body.price,
        "Author": req.body.author,
        "Genre": req.body.genre
    });
    // use book model update method to update the book with the id with the new book object
    book.update({ _id: id }, updatedBook, (err) => {
        // if error, log error and end render
        if (err) {
            console.log(err);
            res.end(err);
            // otherwise, redirect user back to books list
        } else {
            res.redirect('/books');
        }
    });
});

// DELETE BOOK FUNCTION
// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
    // Set variable to hold book id
    let id = req.params.id;

    // Use remove method of book model to delete db object
    book.remove({ _id: id }, (err) => {
        // if error, log error and end rendering
        if (err) {
            console.log(err);
            res.end(err);
            // otherwise, redirect user back to books list
        } else {
            res.redirect('/books');
        }
    });
});


module.exports = router;