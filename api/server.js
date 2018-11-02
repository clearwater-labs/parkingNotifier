// require all the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

const userRoutes = require("./routes/users");
const statRoutes = require("./routes/stats");
const statusRoutes = require("./routes/status");
const numberRoutes = require("./routes/numbers");

// import environment variables from .env file
const dotenv = require('dotenv').config();
const getenv = require('getenv');

// create an instance of express
const app = express();
var port = process.env.PORT || 9000;

// connect to the database
setTimeout(function() {
  console.log("Trying to connect");
  mongoose
    .connect(
      //'mongodb://' + process.env.DB_HOST, {
      'mongodb://localhost:27017/parkingnotifier', {
      /*auth: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }*/
        useNewUrlParser: true
      }
    )
    .then(() => {
      console.log("Connected to database");
    })
    .catch(err => {
      console.log(
        "This error could be because of a missing .env file. Make sure you have created your own:"
      );
      console.error(err);
    });
}, 20000);

// allow CORS
app.options("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  res.sendStatus(200);
});

// request logging
app.use(morgan("tiny"));

// configure app to use bodyParser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

userRoutes(app);
statRoutes(app);
statusRoutes(app);
numberRoutes(app);

/***** ERROR PAGES *****/
app.use(function(req, res) {
  res.status(404);
  res.json({
    status: "failed",
    message: "This resource does not exist",
    apiDocumentation: "https://github.com/UWEC-ITC/parkingNotifier-API"
  });
});

app.use(function(error, req, res, next) {
  res.status(500);
  console.log(error);
  res.json({
    status: "failed",
    message: "Server error",
    apiDocumentation: "https://github.com/UWEC-ITC/parkingNotifier-API"
  });
});

app.listen(port, function() {
  console.log("API listening on port ", port);
});

// exporting the app module
module.exports = app;
