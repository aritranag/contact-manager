var express = require('express'),
    moment = require('moment'),
    Q = require('q');
    


var routes = function(Person){

    var PersonRouter = express.Router();

    // middle ware to check for the authorization header
    PersonRouter.use(function(req, res, next){
        var authValue = req.get('Authorization');
        if(authValue == process.env.AUTH_SECRET){
            next();
        }
        else{
            res.status(401);
            res.send("Unauthorized request");
        }
    });

    // post route to create a person
    PersonRouter.route('/')
    .post(function(req, res){
        
        var isValid = checkPersonParams(req.body);
        if(isValid){
            var person = new Person(req.body);
            person.save(function(err){
                if(!err){
                    console.log(person._id);
                    res.status(200);
                    res.json(person);
                }
                else{
                    console.log(err,"Error in saving person details");
                    res.status(400);
                    res.send("Error in saving person details");
                }
            });
        }
        else{
            res.status(400);
            res.send("Request Error");
        }
    })
    .get(function(req, res){

        // get all contacts and return
        Person.find(null,function(err, persons){
            if(!err){
                res.status(200);
                res.json(persons);
            }
            else{
                console.log(err);
                res.status(200);
                res.send("Error in getting person information")
            }
        });
    });


    // ----------------------- SINGLE PERSON ROUTES ---------------------- */
    PersonRouter.route('/:personId')
    .get(function(req, res){

        // getting data for a single person
        Person.findById(req.params.personId,function(err, person){
            if(!err){
                // return the person details
                res.status(200);
                res.json(person);
            }
            else{
                console.log("Id searched : ",req.params.personId,"Error in retieving",err);
                res.status(400);
                res.send("Error in getting person details");
            }
        });
    });
    

    return PersonRouter;
}

module.exports = routes;

// check the post parameters to create a new contact in the db
function checkPersonParams(reqObj){

    //check for mobile
    if(!reqObj.mobile){
        console.log("Mobile number not supplied");
        return false;
    }
    else if(!reqObj.name){
        console.log("Mobile number not supplied");
        return false;
    }
    else if(!reqObj.email){
        console.log("Mobile number not supplied");
        return false;
    }
    else{
        return true;
    }
}


