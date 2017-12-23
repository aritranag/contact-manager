module.exports = {
    checkCredentials : checkUsernamePassword,
    isValidCustomer  : isValidCustomer,
    isValidVendor    : isValidVendor,
    getOrders        : getOrders
};

// checking for username and password in the provided requestObj
function checkUsernamePassword(reqObj){

    var flag = true;
    if(!reqObj.username || !reqObj.password){
        flag = false;
    }
    return flag;
}

// checking whether a particular customer exists or not
// if exists return customer, else return error
function isValidCustomer(Customer,customerId){

    var promise = new Promise(function(resolve,reject){
        
        Customer.findById(customerId,function(err,customer){
            if(!err && customer){
                resolve(customer);
            }
            else{
                reject("customer not found");
            }
        })
    });

    return promise;
}

// checking whether a particular customer exists or not
// if exists return customer, else return error
function isValidVendor(Vendor,vendorId){
    
        var promise = new Promise(function(resolve,reject){
            
            Vendor.findById(vendorId,function(err,vendor){
                if(!err && vendor){
                    resolve(vendor);
                }
                else{
                    reject("vendor not found");
                }
            })
        });
    
        return promise;
    }

// returns orders for the order ids specified
function getOrders(Order,orderIds){

    var promise = new Promise(function(resolve,reject){
        
        Order.find({
            _id : { $in : orderIds}
        },function(err, orders){
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


