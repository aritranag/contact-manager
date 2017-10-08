var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    q = require('q'),
    bodyParser = require('body-parser');

var app = express();

// mongoose set up
mongoose.promise = q; // setting up the promise library

// options for creating the mongo db connection
var mongoose_connection_options = {
    useMongoClient : true
};


//var db = mongoose.connect("mongodb://localhost/Contacts",mongoose_connection_options);

var mongodbUri = "mongodb://"+process.env.DB_USERNAME+":"+ process.env.DB_PASSWORD + "@ds147864.mlab.com:47864/contacts";

var db = mongoose.connect(mongodbUri,mongoose_connection_options);

var Person = require('./router/models/Person.js');


// app setting up
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(bodyParser.json());


// getting the router
var PersonRouter = require('./router/PersonRoutes.js')(Person);

// the routes
app.use('/person',PersonRouter);

app.listen((process.env.PORT || 8001),function(){
  console.log("Server started running");
});