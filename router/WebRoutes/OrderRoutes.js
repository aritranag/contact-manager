var express = require('express'),
    multer = require('multer'),
    orderController = require('../controllers/order.controller'),
    path = require('path'),
    uuidv1 = require('uuid/v1'),
    fs = require('fs');

var uploadPath = path.join(__dirname + '/../../public/data/');

var diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null,  Date.now() + '-' + file.originalname)
    }
});

var upload = multer({
    storage : diskStorage
})

var routes = function(Order,Customer,Vendor){

    var OrderRouter = express.Router();
    
    // ==================================== NEW ORDER ========================================= //


    OrderRouter.route('/new')
        .post(upload.single('document'),function(req, res, next){
            
            next();
        },function(req, res){

            req.body.description.document = "/data/" + req.file.filename;
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
            /** */

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