const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username === username;
    });  //returns boolean
    return userswithsamename.length>0;
//write code to check is the username is valid
};

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return user.username === username && user.password === password;
    });
    return validusers.length > 0;
//write code to check if username and password match the one we have in records.
};

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
  const review = req.query.review;

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
    reviews: books[isbn].reviews
  });
});

//Task9:
regd_users.delete("/auth/review/:isbn", (req, res) =>{
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if(!books[isbn]) {
        return res.status(404).json({
            message: "Book not Found"
        });
    }
    if(books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: "Review successfully deleted ",
            reviews: books[isbn].reviews 
        });
    } else {
        return res.status(404).json({
            message: "Review not found for this user"
      });
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
