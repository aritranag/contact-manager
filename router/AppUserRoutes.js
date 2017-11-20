var express = require('express');

var routes = function(AppUser,Contact){

    var AppUserRouter = express.Router();

    // POST route to create a new user
    AppUserRouter.route('/new_user')
        .post(function(req, res){

            console.log("Creating new user request",req.body.user_email);

            if(!req.body.user_email){
                // if no email id is present then return error
                res.status(400);
                res.send("Invalid email address");
            }
            else{
                console.log("trying to find if app user exists");

                
                // find if the user already exists or not
                AppUser.find({
                    email : req.body.user_email
                },function(err, users){
                    if(err){
                        console.log(err);
                        res.status(400);
                        res.send("Error in creating new user");
                    }
                    else if(users.length == 0){
                        console.log("No user exists, creating new");
                        // no email id exists for this user; create the user, save it and return the _id
                        var user = new AppUser({email : req.body.user_email});

                        // try to save the user, if user doesn't get saved return error, else return user id
                        user.save(function(err){
                            if(!err){
                                console.log("User created",user._id);
                                res.status(200);
                                res.send(user._id);
                            }
                            else{
                                console.log(err);
                                res.status(400);
                                res.send("Error in saving user");
                            }
                        })
                    }
                    else if(users.length == 1){
                        // user already exists, send back user._id

                        var user = users[0];
                        console.log("user already exists",user);
                        res.status(200);
                        res.send(user._id);
                    }
                    else{
                        // too many results, send an error and check database
                        res.status(400);
                        res.send("Too many results, check db");
                    }
                })
                
            }
        });


    // ----------------------- SINGLE User ROUTES ---------------------- */
    AppUserRouter.route('/contact/:userid')
    .get(function(req, res){

        console.log(req.params.userid);
        Contact.find({
            user_id : req.params.userid
        },function(err, contacts){
            if(!err){
                // return the Contact details
                res.status(200);
                res.json(contacts);
            }
            else{
                console.log("Id searched : ",req.params.user_id,"Error in retieving",err);
                res.status(400);
                res.send("Error in getting Contact details");
            }
        });
    });

    return AppUserRouter;

}

module.exports = routes;