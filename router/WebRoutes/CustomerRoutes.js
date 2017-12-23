var express = require('express'),
    customerController = require('../controllers/customer.controller');

var routes = function(Customer,Order){
    
    var CustomerRouter = express.Router();

    // ==================================== LOGIN ROUTE ========================================= //
    CustomerRouter.route('/login')
        .post(function(req, res){

            // if username or password is not supplied send back error
            if(!req.body.username || !req.body.password){
                
                console.log("no username/password given");
                res.status(400);
                res.send("Invalid username or password");  
            }
            else{
                // try to find the customer
                Customer.findOne({
                    username : req.body.username
                },function(err, user){
                    if(err){
                        console.log("login error for Customer",err);
                        res.status(400);
                        res.send("Invalid username or password");
                    }
                    else if(user == null){
                        console.log("Customer doesn't exist");
                        res.status(400);
                        res.send("Invalid username or password");
                    }
                    else{
                        console.log(user == null);
                        // check password, if match send the username, name and email back
                        if(user.password == req.body.password){
                            console.log("authenticated",user.username);
                            res.status(200);
                            res.json({
                                name : user.name,
                                username : user.username,
                                email : user.email,
                                customerId : user._id
                            });
                        }
                        else{
                            console.log("username/password does not match");
                            res.status(401);
                            res.send("Username or password doesn't match");
                        }
                    }
                })
            }
        });
    

    // ==================================== REGISTER ROUTE ========================================= //
    CustomerRouter.route('/register')
        .post(function(req, res){

            // register customer is an asynchronous function hence returns a promise
            customerController.registerCustomer(Customer,req.body).then(function(customer){
                console.log("customer created");
                res.status(200);

                // send only name, username and email back
                res.json({
                    username : customer.username,
                    name : customer.name,
                    email : customer.email,
                    customerId : customer._id
                });
            })
            .catch(function(err){
                console.log(err);
                res.status(400);
                res.send("Registration error");
            })
        });
    
    // ==================================== ORDERS ROUTE ========================================= //

    CustomerRouter.route('/orders/open')
        .get(function(req, res){
            
            // check if the customer id is supplied or not
            if(req.query.customerId){

                //get the orders via the controller function
                customerController.getOpenOrders(Customer,Order,req.query).then(function(orders){
                    console.log("orders returned for the customer",req.query.customerId);
                    res.status(200);
                    res.json(orders);
                })
                .catch(function(err){
                    console.log(err);
                    res.status(400);
                    res.send("Error in getting orders of the customer");
                });
            }
            
        });
    


    return CustomerRouter;

}

module.exports = routes;