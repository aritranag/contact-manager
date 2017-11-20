var express = require('express'),
    moment = require('moment'),
    Q = require('q');
    
var routes = function(Contact){

    var ContactRouter = express.Router();

    // post route to create a Contact
    ContactRouter.route('/save')
    .post(function(req, res){
        
        var isValid = checkContactParams(req.body);
        if(isValid){

            // check whether that contact exists for that user
            // check via phone number, and user id
            Contact.find({
                user_id : req.body.user_id,
                mobile : req.body.mobile
            },function(err, contacts){
                if(err || contacts.length > 0){
                    console.log("contact already exists, return success");
                    res.status(200);
                    res.json(contacts[0]);
                }
                else{
                    // contact doesn't exist, create one
                    var contact = new Contact(req.body);
                    contact.save(function(err){
                        if(!err){
                            console.log(contact);
                            res.status(200);
                            res.json(contact);
                        }
                        else{
                            console.log(err,"Error in saving Contact details");
                            res.status(400);
                            res.send("Error in saving Contact details");
                        }
                    });
                }
            });
            
        }
        else{
            res.status(400);
            res.send("Request Error");
        }
    });

    ContactRouter.route('/all')
    .get(function(req, res){

        // get all contacts and return
        Contact.find(null,function(err, contacts){
            if(!err){
                res.status(200);
                res.json(contacts);
            }
            else{
                console.log(err);
                res.status(200);
                res.send("Error in getting Contact information")
            }
        });
    });
    

    return ContactRouter;
}

module.exports = routes;

// check the post parameters to create a new contact in the db
function checkContactParams(reqObj){

    //check for mobile
    if(!reqObj.user_id){
        // User id of the user who is creating the contact
        console.log("User Id not supplied");
        return false;
    }
    // details of the contact
    else if(!reqObj.mobile){
        console.log("Mobile number not supplied");
        return false;
    }
    else if(!reqObj.name){
        console.log("Name not supplied");
        return false;
    }
    else if(!reqObj.email){
        console.log("Email not supplied");
        return false;
    }
    else{
        return true;
    }
}


