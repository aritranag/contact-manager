var utilityService = require('../services/utilities.service');

module.exports = {
    registerVendor : registerVendor,
    getQuotedOrders : getQuotedOrders,
    getOpenOrders : getOpenOrders
};

/* ---------------------------- EXPORT FUNCTIONS --------------------------------- */
// register a new Vendor with the given params provided
function registerVendor(Vendor,reqObj){

    var promise = new Promise(function(resolve, reject){

        // check whether username and password provided
        var isValid = utilityService.checkCredentials(reqObj);
        if(isValid){

            var new_vendor = new Vendor({
                name : reqObj.name || '',
                username : reqObj.username,
                password : reqObj.password,
                email : reqObj.email || ''
            });

            new_vendor.save(function(err){
                if(err){
                    reject(err);
                }
                else{
                    resolve(new_vendor);
                }
            });
        }
        else{
            reject("Invalid credentials");
        }
    });

    return promise;
}


// get all the quoted orders for a vendor
function getQuotedOrders(Vendor,Order,reqObj){
    
    var promise = new Promise(function(resolve,reject){
        
        utilityService.isValidVendor(Vendor,reqObj.vendorId).then(function(vendor){
            
            // get the order details quoted by this vendor
            var open_orders = vendor.quoted_orders;
            
            // if order Ids are there fetch order details else return empty array
            if(open_orders.length > 0){
                return utilityService.getOrders(Order,open_orders);
            }
            else{
                return [];
            }
        })
        .then(function(orders){
            let modified_orders = removeOtherWorkInfo(orders,reqObj.vendorId);
            resolve(modified_orders);
        })
        .catch(function(err){
            reject(err);
        })
    });
    
    return promise;
}


// get all the open orders which the vendor can still place a bid upon
// add the conditions of isFinalised and isDelivered
function getOpenOrders(Order,orders){

    var orderIds = getOrderIds(orders);
    
    var promise = new Promise(function(resolve,reject){
        
        Order
        .where('_id')
        .nin(orderIds)
        .select('name description')
        .exec(function(err,orders){
            if(!err){
                resolve(orders);
            }
            else{
                reject(err);
            }
        });
    });
    
    return promise;
}


/* ---------------------------- OTHER FUNCTIONS (specific to vendor) --------------------------------- */
// removes other vendor bids from the orders
function removeOtherWorkInfo(orders,vendorId){
    let result = [];

    // iterate through the order results and remove all other bids by other vendors
    for(order of orders){
        let obj = {};
        obj.customerId = order.customer_id;
        obj.name = order.name;
        obj.description = order.description;
        obj.workInfo = [];
        obj.orderId = order._id;
    
        for(update of order.work_info){
            if(update.updated_by == vendorId){
                obj.workInfo.push(update);
            }
        }
        result.push(obj);
    }

    return result;
}

function getOrderIds(orders){

    let result = [];
    for(order of orders){
        result.push(order.orderId);
    }

    return result;
}