var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Vendor = new Schema({
    name : String,
    email : String,
    username : String,
    password : String,
    date_created : {
        type : Date,
        default : Date.now
    },
    quoted_orders : [String],
    finalised_orders : [String],
    completed_orders : [String]
});


module.exports = mongoose.model('Vendor',Vendor);