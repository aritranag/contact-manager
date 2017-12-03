var utilityService = require('../services/utilities.service');

module.exports = {
    registerVendor : registerVendor,
    getQuotedOrders : getQuotedOrders
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


// get all the open orders for a vendor
function getQuotedOrders(Vendor,Order,reqObj){
    
    var promise = new Promise(function(resolve,reject){
        
        utilityService.isValidVendor(Vendor,reqObj.vendorId).then(function(vendor){
            
            // get the order details open for this vendor
            var open_orders = vendor.open_orders;
            
            // if order Ids are there fetch order details else return empty array
            if(open_orders.length > 0){
                return utilityService.getOrders(Order,open_orders);
            }
            else{
                return [];
            }
        })
        .then(function(orders){
            resolve(orders);
        })
        .catch(function(err){
            reject(err);
        })
    });
    
    return promise;
}


/* ---------------------------- OTHER FUNCTIONS (specific to vendor) --------------------------------- */