const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')
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


//TASK 1+ 10:
// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const response = await Promise.resolve({
        data: books
    });
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
        message: "Error Retrieving Books"
    });
  }
  
});


//TASK 2 + 11 :
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; 

  axios
  .get(`http://localhost:5000/api/books/isbn/${isbn}`)
  .then(response =>{
    return res.status(200).json(response.data);
  })
  .catch(error =>{
    if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
    return res.status(404).json({
        message: "Book not Found "
    });

  });
   
 });

//TASK 3+ 12:
//Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  axios
  .get(`http://localhost:5000/api/books/author/${encodeURIComponent(author)}`)
  .then(response=>{
    return res.status(200).json(response.data);
  })
  .catch (error =>{
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

  
});

//TASK 4+13:
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  axios
  .get(`http://localhost:5000/api/books/title/${encodeURIComponent(title)}`)
  .then(response=>{
    return res.status(200).json(response.data);
  })
  .catch (error =>{
    const title = req.params.title;
    const booksByTitle = [];

    const keys = Object.keys(books);
    keys.forEach((isbn) =>{
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    });
    return res.status(200).json(booksByTitle);
  });

  
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
