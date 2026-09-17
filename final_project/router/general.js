const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Task 6:
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if(isValid(username)) {
        return res.status(409).json({
            message: "User already existed"
        });
    }
    users.push({
        username: username,
        password: password
    });
    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
  } else {
    return res.status(400).json({message: "Username and password are required"});
  } 
});


//TASK 1:
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});


//TASK 2:
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; 
  if (book[isbn]) {
    return res.status(200).json(books[isbn]);
  } else return res.status(404).json({message: "Book not Found "});
 });

//TASK 3:
//Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = [];

  const keys = Object.keys(books);
  keys.forEach((isbn) =>{
    if (books[isbn].author === author) {
        booksByAuthor.push(books[isbn]);
    }
  });
  return res.status(200).json(booksByAuthor);
});

//TASK 4:
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  const title = get.params.title;
  const booksByTitle = [];

  const keys = Object.keys(books);
  keys.forEach((isbn) =>{
    if(books[isbn].title === title){
        booksByTitle.push(books[isbn]);
    }
  })
  return res.status(200).json(booksByTitle);
});

//TASK 5:
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else return res.status(404).json({message: "Book not Found"});
  
});

module.exports.general = public_users;
