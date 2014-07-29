'use strict';

var mongoose = require('mongoose'),
    session = require('express-session'),
    User = mongoose.model('User'),
    Project = mongoose.model('Project'),
    moment = require('moment');

/**************** Idioma PTBR ****************/
//  moment.lang('pt-br');

    exports.findAllUsers = function(req, res){
        User.find(function(err, user){
            if(err){
                console.log(err);
            }else{
                res.send(user);
            }
        });
    };

    exports.addUser = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var user = new User({
        name: req.body.FullName,
        email: req.body.Email,
        modifiedOn: Date.now(),
        lastLogin: Date.now(),
    })

    user.save(function(err) {
        if(!err) {
            console.log('Created a new user: ' + req.body.FullName);
        } else {
            console.log('ERROR: ' + err);
        }
    });

    res.send(user);
  };

  exports.findUser = function(req,res){
    User.findById(req.params.id, function(err,user){
        if(err){
            console.log(err);
        }else{
            res.send(user);
        }
    });
  };

  exports.updateUser = function(req, res) {
    console.log('PUT');
    console.log(req.body);

    User.findById(req.params.id, function(err, user) {
    user.name = req.body.FullName;
    user.email = req.body.Email;
    user.modifiedOn = Date.now();

    user.save(function (err) {
      if (!err) {
        console.log("Updated " + req.body.name);
      } else {
        console.log("ERROR :" + err);
      }
      return res.send(user);
    });
  });
};

exports.deleteUser = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (!err && user){
          user.remove();
          res.json(200, {message: "User removed."});
        } else {
            res.json(403, {message: "Could not delete user. " + err});
          }
    });
  };

    //GET User creation form
    exports.create = function(req, res){
        res.render('user-form', {
            title: 'Create user',
            name: "",
            email: "",
            buttonText: "Join!"
        });
    };

    exports.doCreate = function(req, res){
        User.create({
            name: req.body.FullName,
            email: req.body.Email,
            modifiedOn: Date.now(),
            lastLogin: Date.now(),
        }, function(err, user){
            if(err){
                console.log(err);
                if(err.code===11000){
                    res.redirect('/user/new?exists=true');
                }else{
                    res.redirect('/?error=true');
                }
            }else{
                console.log("User created and saved: " + user);
                req.session.user = { "name": user.name, "email": user.email, "_id": user._id};
                req.session.loggedIn = true;
                res.redirect('/user');
            }
        });
    };

    //GET Logged in user page
    exports.index = function(req, res){
        if(req.session.loggedIn === true){
            res.render('user-page', {
                title: req.session.user.name,
                name: req.session.user.name,
                email: req.session.user.email,
                userID: req.session.user._id,
                login: moment(req.session.user.login).fromNow()
            })
        }else{
            res.redirect('/login');
        }
    };

    //GET Login page
    exports.login = function(req, res){
        res.render('login-form', {title: 'Log in'});
    };

    //POST Login page
    exports.doLogin = function(req, res){
        if(req.body.Email){
            User.findOne(
                {'email': req.body.Email},
                '_id name email lastLogin',
                function(err, user){
                    if(!err){
                        if(!user){
                            res.redirect('/login?404=user');
                        }else{
                            req.session.user = {
                                "name": user.name,
                                "email": user.email,
                                "_id": user._id,
                                "login": user.lastLogin
                            };
                            req.session.loggedIn = true;
                            console.log("Logged in user: " + user);
                            User.update(
                                {_id: user._id},
                                {$set: {lastLogin: Date.now()}},
                                function(){
                                    res.redirect('/user');
                                }
                            )
                        };
                    }else{
                    res.redirect('/login?404=error');
                    };
            });
        }else{
        res.redirect('/login?404=error');
        }
    };

    //GET Edit user
    exports.edit = function(req, res){
        if(req.session.loggedIn !== true){
            res.redirect('/login');
        }
        else{
            res.render('user-form', {
                title: 'Edit Profile',
                _id: req.session.user._id,
                name: req.session.user.name,
                email: req.session.user.email,
                buttonText: "Save"
            });
        }
    };

    //POST Edit user
    exports.doEdit = function(req,res){
        if(req.session.user._id){
            User.findById(req.session.user._id, function(err, user){
                if(err){
                    console.log(err);
                    res.redirect('/user?error=finding');
                }else{
                    user.name = req.body.FullName;
                    user.email = req.body.Email;
                    user.modifiedOn = Date.now();
                    user.save(function(err){
                        if(!err){
                            console.log('User updated ' + req.body.FullName);
                            req.session.user.name = req.body.FullName;
                            req.session.user.email = req.body.Email;
                            res.redirect('/user');
                        }
                    });
                }
            });
        };
    };

    //GET Confirm delete
    exports.confirmDelete = function(req, res){
        res.render('user-delete-form', {
            title: 'Delete Account',
            _id: req.session.user._id,
            name: req.session.user.name,
            email: req.session.user.email
        });
    };

    //GET Delete User Account
    exports.doDelete = function(req,res){
        if(req.body._id){
            User.findByIdAndRemove(
                req.body._id,
                function(err, user){
                    if(err){
                        console.log(err);
                        redirect('/user?error=deleting');
                    }
                    console.log("User deleted " + user);
                    clearSession(req.session, function(){
                        res.redirect('/');
                    });
                }
            );
        }
    };

    var clearSession = function(session, callback){
        session.destroy();
        callback();
    };

    exports.doLogout = function(req, res){
        req.session.destroy();
        res.redirect('/');
    };