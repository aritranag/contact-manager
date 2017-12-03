var utilityService = require('../services/utilities.service');

module.exports = {
    createNewOrder : createNewOrder,
    updateOrderWorkinfo : updateOrderWorkinfo
};

//=============================== EXPORT FUNCTIONS =====================================//
// steps involved in creating a new order
// 1. check valid order details
// 2. check valid customer
// 3. create the order
// 4. update the customer
function createNewOrder(Order,Customer,reqObj){

    var promise = new Promise(function(resolve, reject){

        if(checkOrderDetails(reqObj)){

            var customerTemp = {};
            // check whether the customer exists or not
            utilityService.isValidCustomer(Customer,reqObj.customerId).then(function(customer){

                // if customer exists then create the new order
                customerTemp = customer;
                return createActualOrder(Order,reqObj);
            })
            // if new order is created update customer details
            .then(function(new_order){

                // update customer details; to be replaced with a mongo update operation
                customerTemp.open_orders.push(new_order._id);

                // save the customer
                customerTemp.save(function(err){
                    if(!err){
                        resolve(new_order);
                    }
                    else{
                        reject(err);
                    }
                })
            })
            .catch(function(err){
                reject(err);
            })

        }
        else{
            reject("Invalid params");
        }
    });

    return promise;
}

// steps involved in updating an order
// 1. check valid order update details
// 2. check valid vendor
// 3. update the order workinfo
// 4. update the vendor 
function updateOrderWorkinfo(Order,Vendor,reqObj){
    
    var promise = new Promise(function(resolve, reject){

        if(checkOrderUpdateDetails(reqObj)){

            var customerTemp = {};
            // check whether the vendor exists or not
            utilityService.isValidVendor(Vendor,reqObj.vendorId).then(function(vendor){

                // if vendor exists then update the order with the quote
                vendorTemp = vendor;
                return updateOrder(Order,reqObj,vendor._id);
            })
            // if order is updated update vendor details via the utility service
            .then(function(updated_order){

                // update vendor details; to be replaced with a mongo update operation
                vendorTemp.quoted_orders.push(updated_order._id);

                // save the updated vendor
                vendorTemp.save(function(err){
                    if(!err){
                        resolve(updated_order);
                    }
                    else{
                        reject(err);
                    }
                })
            })
            .catch(function(err){
                reject(err);
            })

        }
        else{
            reject("Invalid params");
        }
    });

    return promise;
}


//=============================== UTILITY FUNCTIONS =====================================//

// check whether customer_id and order details are supplied or not
function checkOrderDetails(reqObj){

    var flag = true;
    if(!reqObj.customerId || !reqObj.description.quantity || !reqObj.description.document){
        flag = false;
    }
    return flag;
}

// checks whether the necessary parameters are there for an update
function checkOrderUpdateDetails(reqObj){

    var flag = true;
    if(!reqObj.vendorId || !reqObj.order_quote || !reqObj.orderId){
        flag = false;
    }
    return flag;
}

// create a new order with the details supplied
function createActualOrder(Order,reqObj){

    var promise = new Promise(function(resolve,reject){
        
        // create the description object with order details
        var order_details = {
            quantity : reqObj.description.quantity,
            document : reqObj.description.document,
            expexted_date : reqObj.description.expexted_date || null
        };

        // create the new order
        var new_order = new Order({
            name : reqObj.order_name || "New Order",
            description : order_details,
            customer_id : reqObj.customerId
        });

        // save the new order
        new_order.save(function(err){
            if(!err){
                resolve(new_order);
            }
            else{
                reject("order couldn't be created");
            }
        });
    });
    
    return promise;
}

// updates an order with the supplied work info
function updateOrder(Order,reqObj,vendorId){

    var promise = new Promise(function(resolve,reject){
        
        var order_update = {
            quote : reqObj.order_quote,
            status : 'NA',
            updated_by : vendorId,
            comment : reqObj.comment || "None" 
        };

        Order.findById(reqObj.orderId,function(err, order){
            if(!err){
                order.work_info.push(order_update);
                order.save(function(err){
                    if(!err){
                        resolve(order);
                    }
                    else{
                        reject(err);
                    }
                });
            }
            else{
                reject(err);
            }
        });
    });
    
    return promise;
}

