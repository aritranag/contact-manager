var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Phone = new Schema({
	phn_number : Number,
	phn_type : {
		type : String,
		default : 'Work'
	}
});

// user_id refers to the id of the user who saved this contact
var Contact = new Schema({
	user_id : String,
	name : String,
	mobile : Number,
	mobile_type : {
		type : String,
		default : "Work"
	},
	other_phone : [Phone],
	email : {
		type : String
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
});


module.exports = mongoose.model('Contact',Contact);