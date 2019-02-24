// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

// create a reference to the controller
// let booksController = require('../controllers/contact');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
    // find all books in the books collection
    book.find((err, books) => {
        if (err) {
            return console.error(err);
        } else {
            res.render('books/index', {
                title: 'Books',
                books: books
            });
        }
    });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
    // Add find method with books list as details page is used for both add and edit
    book.find((err, books) => {
        // If results in error, log error
        if (err) {
            return console.error(err);
            // otherwise, render the details page, passing empty books list
        } else {
            res.render('books/details', {
                title: 'Add a Book',
                books: books
            });
        }
    });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
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

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    /*****************
     * ADD CODE HERE *
     *****************/
});


module.exports = router;