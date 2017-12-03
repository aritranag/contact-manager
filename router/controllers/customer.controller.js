var utilityService = require('../services/utilities.service');

module.exports = {
    registerCustomer : registerCustomer,
    getOpenOrders : getOpenOrders
};

/* ---------------------------- EXPORT FUNCTIONS --------------------------------- */
// register a new Customer with the given params provided
function registerCustomer(Customer,reqObj){

    var promise = new Promise(function(resolve, reject){

        // check whether username and password provided
        var isValid = utilityService.checkCredentials(reqObj);
        if(isValid){

            var new_customer = new Customer({
                name : reqObj.name || '',
                username : reqObj.username,
                password : reqObj.password,
                email : reqObj.email || ''
            });

            new_customer.save(function(err){
                if(err){
                    reject(err);
                }
                else{
                    resolve(new_customer);
                }
            });
        }
        else{
            reject("Invalid credentials");
        }
    });

    return promise;
}


// get all the open orders for a customer
function getOpenOrders(Customer,Order,reqObj){
    
    var promise = new Promise(function(resolve,reject){
        
        utilityService.isValidCustomer(Customer,reqObj.customerId).then(function(customer){
            
            // get the order details open for this customer
            var open_orders = customer.open_orders;
            
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


/* ---------------------------- OTHER FUNCTIONS (specific to customer) --------------------------------- */