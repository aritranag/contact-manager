var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    q = require('q'),
    //config = require('./config/config'),
    bodyParser = require('body-parser');

var app = express();

// mongoose set up
mongoose.promise = q; // setting up the promise library

// options for creating the mongo db connection
var mongoose_connection_options = {
    useMongoClient : true
};


//var db = mongoose.connect("mongodb://localhost/ConQR",mongoose_connection_options);

var mongodbUri = "mongodb://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@ds111754.mlab.com:11754/conqr";

var db = mongoose.connect(mongodbUri,mongoose_connection_options);


// MODELS (Mongo DB models)
var Contact = require('./router/models/Contact.js');
var User = require('./router/models/User.js');
var AppUser = require('./router/models/AppUser.js');


// app setting up
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(bodyParser.json());

// setting up middleware to check every request coming to the app

// middle ware to check for the authorization header
app.use(function(req, res, next){
    var authValue = req.get('Authorization');
    if(authValue == process.env.AUTH_SECRET){
        next();
    }
    else{
        res.status(401);
        res.send("Unauthorized request");
    }
});


// getting the router
var ContactRouter = require('./router/ContactRoutes.js')(Contact);
var AppUserRouter = require('./router/AppUserRoutes')(AppUser,Contact);
//var UserRouter = require('./router/UserRoutes')(User);


// the routes
app.use('/app/user',AppUserRouter);
app.use('/contact',ContactRouter);

app.listen((process.env.PORT || 8001),function(){
  console.log("Server started running");
});