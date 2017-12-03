var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var order_details = new Schema({
    quantity : Number,
    document : String,
    expected_date : {
        type : Date,
        default : Date.now
    }
});

var order_update = new Schema({
    quote : Number,
    expected_date : {
        type : Date,
        default : Date.now
    },
    update_date : {
        type : Date,
        default : Date.now
    },
    status : String,
    updated_by : String,
    Comment : String
});

var Order = new Schema({
    name : String,
    description : order_details,
    created_on : {
        type : Date,
        default : Date.now
    },
    customer_id : String,
    isFinalised : {
        type : Boolean,
        default : false
    },
    isDelivered : {
        type : Boolean,
        default : false
    },
    final_quote : Number,
    work_info : [ order_update ], 
    associated_vendors : [ String ],
    final_vendor : {
        type : String,
        default : "Not finalised"
    },
    expected_delivery_date : Date
});

module.exports = mongoose.model('Order',Order);