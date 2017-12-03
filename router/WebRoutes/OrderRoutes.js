var express = require('express'),
    orderController = require('../controllers/order.controller');

var routes = function(Order,Customer,Vendor){

    var OrderRouter = express.Router();
    
    // ==================================== NEW ORDER ========================================= //
    OrderRouter.route('/new')
        .post(function(req, res){
            
            orderController.createNewOrder(Order,Customer,req.body).then(function(order){
                console.log("Order is created");
                res.status(200);
                res.json(order);
            })
            .catch(function(err){
                console.log(err);
                res.status(400);
                res.send("order not created");
            });

        });
    
    // ==================================== UPDATE ORDER ========================================= //
    OrderRouter.route('/update/workinfo')
        .post(function(req, res){
            
            orderController.updateOrderWorkinfo(Order,Vendor,req.body).then(function(order){
                console.log("order is updated");
                res.status(200);
                res.json(order);
            })
            .catch(function(err){
                console.log(err);
                res.status(400);
                res.send("order not updated");
            });
        });
    
    return OrderRouter;
}

module.exports = routes;