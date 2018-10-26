// require all the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import environment variables from .env file
require('dotenv').config()

// create an instance of express
const app = express();
var port = process.env.PORT || 8080;

// import data models
var User = require('./models/user'); // get our mongoose model
var Status = require('./models/status'); // get our mongoose model

// connect to the database
mongoose.connect('mongodb://' + process.env.DB_HOST, {
  auth: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
})
.catch((err) => console.error(err));

// configure app to use bodyParser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var apiRouter = express.Router();

apiRouter.get('/', function(req, res) {
    res.status(200);
    res.json({
        success: true,
        apiDocumentation: 'https://github.com/UWEC-ITC/parkingNotifier-API',
    });
});

apiRouter.route('/status')
    .get(function(req, res) {
        // get most recent record in the list of records
        Status.findOne().sort({'timestamp': 'desc'}).exec(function(err, status) {
            res.status(200);
            res.json({
                alternateSideParking: status.alternateSideParking,
                message: status.message,
                updated: status.timestamp
            });
        });
    });
apiRouter.route('/developer')
    // subscribe a user
    .post(function(req, res) {
        if (!req.body.name || !req.body.email || !req.body.phone || !req.body.token) {
            res.send({
                success: false,
                message: "Please include a name, UWEC email address, and phone number to generate a token",
                apiDocumentation: 'https://github.com/UWEC-ITC/parkingNotifier-API',
            });
            return;
        } else if (req.body.email.replace(/.*@/, "") == 0 || req.body.email.replace(/.*@/, "") !== 'uwec.edu') {
            res.status(400);
            res.send({ message: "Email must be a UWEC email"});
            return;
        } else {
            console.log("Creating user");
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                token: req.body.token
            });

            console.log("attempting to save user");
            // attempt to save the user
            newUser.save(function(err) {
                console.log("waiting...")
                if (err) {
                    return res.json({ success: false, message: err });
                }
                return res.json({ success: true, message: 'Successfully created new user' });
            });
        }
    });


apiRouter.route('/users')
    // subscribe a user
    .post(function(req, res) {
        if (!req.body.name || !req.body.email || !req.body.phone) {
            res.status(400);
            res.send({
                success: false,
                message: "Please include a name, UWEC email address, and phone number to create a user",
                apiDocumentation: 'https://github.com/UWEC-ITC/parkingNotifier-API',
            });
            return;
        } else if (req.body.email.replace(/.*@/, "") == 0 || req.body.email.replace(/.*@/, "") !== 'uwec.edu') {
            res.status(400);
            res.send({ message: "Email must be a UWEC email"});
            return;
        } else {
            var newUser = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone
            });

            // attempt to save the user
            newUser.save(function(err) {
                if (err) {
                    return res.json({ success: false, message: err.errmsg });
                }
                res.json({ success: true, message: 'Successfully created new user' });
            });
        }
    });

// unsubscribe a user
apiRouter.route('/users/:email')
    .delete(function(req, res) {
        User.count({email: req.params.email}, function (err, count){
            // make sure that the user exists
            if (count > 0) {
                // remove the user that matches the email number
                User.remove({ email: req.params.email }, function(err, bear) {
                    if (err)
                        res.send(err);
                    res.json({ success: true, message: 'Successfully unsubscribed' });
                });
            } else {
                res.status(400);
                res.json({ success: false, message: 'User with that email does not exist'});
            }
        });
    })

apiRouter.route('/users/:phone')
    .delete(function(req, res) {
        User.count({phone: req.params.phone}, function (err, count){
            // make sure that the user exists
            if (count > 0) {
                // remove the user that matches the phone number
                User.remove({ phone: req.params.phone }, function(err, bear) {
                    if (err)
                        res.send(err);
                    res.json({ success: true, message: 'Successfully unsubscribed' });
                });
            } else {
                res.status(400);
                res.json({ success: false, message: 'User with that phone number does not exist'});
            }
        });
    })

app.use('/', apiRouter);

/***** ERROR PAGES *****/
app.use(function(req, res) {
    res.status(404);
    res.json({
        status: "failed",
        apiDocumentation: 'https://github.com/UWEC-ITC/parkingNotifier-API'
    });
})

app.use(function(error, req, res, next) {
    res.status(500);
    console.log(error);
    res.json({
        status: "failed",
        apiDocumentation: 'https://github.com/UWEC-ITC/parkingNotifier-API'
    });
})

app.listen(port, function() {
    console.log('API listening on port ', port);
});

// exporting the app module
module.exports = app;