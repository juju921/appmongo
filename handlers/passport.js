const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


exports.login = passport.use(new LocalStrategy({
    username: 'email',
    password: 'passwd'
    },
    function(username, password, done) {
        let query = {username:email};
        User.findOne(query, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'No user found'});
        }
    
        bcrypt.compare(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Wrong password'});
            }
        });
        });
    }));



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());