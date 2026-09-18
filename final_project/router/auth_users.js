const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//Task 7:
//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({
        message: "username and password are required"
    });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
        {username: username}, 
        "access", 
        {expiresIn: 60 * 60}
    );

    req.session.authorization = {
        accessToken: accessToken,
        username: username
    };

    return res.status(200).json(
        {message: "User successfully logged in",
        accessToken: accessToken
    });
  } else {
    return res.status(401).json({
        message: "Invalid Login. Check username and password"
    });
  }
  
});

//Task 8  
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here

  const isbn = req.params.isbn; 
  const review = req.query.reviewl

  const username = req.session.authorization.username;

  if(!books[isbn]) {
    return res.status(404).json({
        message: "Book not found"
    });
  }

  if (!review) {
    return res.status(400).json({
        message: "review is required"
    });
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: books[isbn].reviews\
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
