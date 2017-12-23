var express = require('express'),
    vendorController = require('../controllers/vendor.controller');

var routes = function(Vendor,Order){

    var VendorRouter = express.Router();

    // ==================================== LOGIN ROUTE ========================================= //
    VendorRouter.route('/login')
        .post(function(req, res){

            // if username or password is not supplied send back error
            if(!req.body.username || !req.body.password){
                
                console.log("no username/password given");
                res.status(400);
                res.send("Invalid username or password");  
            }
            else{
                // try to find the vendor
                Vendor.findOne({
                    username : req.body.username
                },function(err, vendor){
                    if(err){
                        console.log("login error for Vendor",err);
                        res.status(400);
                        res.send("Invalid username or password");
                    }
                    else if(vendor == null){
                        console.log("Vendor doesn't exist");
                        res.status(400);
                        res.send("Invalid username or password");
                    }
                    else{
                        // check password, if match send the username, name and email back
                        if(vendor.password == req.body.password){
                            console.log("authenticated",vendor.username);
                            res.status(200);
                            res.json({
                                name : vendor.name,
                                username : vendor.username,
                                email : vendor.email,
                                vendorId : vendor._id
                            });
                        }
                        else{
                            console.log("username/password does not match");
                            res.status(401);
                            res.send("Invalid username or password");
                        }
                    }
                })
            }
        });


    // ==================================== REGISTER ROUTE ========================================= //
    VendorRouter.route('/register')
        .post(function(req, res){

            // register vendor is an asynchronous function hence returns a promise
            vendorController.registerVendor(Vendor,req.body).then(function(vendor){
                console.log("vendor created");
                res.status(200);

                // send only name, username and email back
                res.json({
                    username : vendor.username,
                    name : vendor.name,
                    email : vendor.email,
                    vendorId : vendor._id
                });
            })
            .catch(function(err){
                console.log(err);
                res.status(400);
                res.send("Registration error for vendor");
            })
        });

    // ==================================== ORDERS ROUTE ========================================= //

    // params => vendorId
    VendorRouter.route('/orders/quoted')
        .get(function(req, res){
            
            // check if the vendor id is supplied or not
            if(req.query.vendorId){

                //get the orders via the controller function
                vendorController.getQuotedOrders(Vendor,Order,req.query).then(function(orders){
                    console.log("orders returned for the vendor",req.query.vendorId);
                    res.status(200);
                    res.json(orders);
                })
                .catch(function(err){
                    console.log(err);
                    res.status(400);
                    res.send("Error in getting quoted orders the vendor");
                });
            }
            
        });
    
    // ==================================== OPEN ORDERS FOR VENDOR PERUSAL ========================================= //

    VendorRouter.route('/orders/open')
        .get(function(req, res){
            
            // check if the vendor id is supplied or not
            if(req.query.vendorId){
                
                //get the orders via the controller function
                vendorController.getQuotedOrders(Vendor,Order,req.query).then(function(orders){
                    console.log("quoted orders returned for the vendor",req.query.vendorId);
                    return vendorController.getOpenOrders(Order,orders);
                })
                .then(function(orders){
                    console.log("open orders returned for the vendor",req.query.vendorId);
                    res.status(200);
                    res.json(orders);
                })
                .catch(function(err){
                    console.log(err);
                    res.status(400);
                    res.send("Error in getting quoted orders the vendor");
                });
            }

        });

    return VendorRouter;

}

module.exports = routes;