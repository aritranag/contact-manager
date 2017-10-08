var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Phone = new Schema({
	phn_number : Number,
	phn_type : {
		type : String,
		default : 'Work'
	}
});

var User = new Schema({
	name : String,
	mobile : Number,
	mobile_type : {
		type : String,
		default : "Work"
	},
	other_phone : [Phone],
	email : {
		type : String,
		index : true,
		unique : true
	},
	email_type : {
		type : String,
		default : "Work"
	},
	company : String,
    job_title : String,
    date : {
        type : Date,
        default : Date.now
    }
},{strict : true});


module.exports = mongoose.model('Person',User);