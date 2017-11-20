var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AppUser = new Schema({
    email : String,
    date : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('AppUser',AppUser);