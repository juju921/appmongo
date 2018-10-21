const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User =  require('../models/User');
const bcrypt = require('bcryptjs');

exports.login = passport.use(new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
            },
                function(req, email, password, done) {
                    getUserByEmail(email, function(err, user) {
                        if (err) { return done(err); }
                        if (!user) {
                            return done(null, false, req.flash('error', 'No email is found'));
                        }
                        comparePassword(password, user.password, function(err, isMatch) {
                            if (err) { return done(err); }
                            if(isMatch){
                                    return done(null, user, req.flash('success', 'You have successfully logged in!!'));
                            }
                            else{
                                    return done(null, false, req.flash('error', 'Incorrect Password'));
                            }
                        });
                    });
                }
));
            

exports.verification = passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Failed Login!',
        successRedirect: '/',
        successFlash: 'You are now logged in!'
});

exports.isLoggedIn = (req, res, next) => {
    // first check if the user is authenticated
    if (req.isAuthenticated()) {
      next(); // carry on! They are logged in!
      Console.log('done');
      return;
    }
    req.flash('error', 'Oops you must be logged in to do that!');
    res.redirect('/login');
};



        
        //     passport.serializeUser(function(user, done) {
        //         done(null, user._id);
        //   });
          
        //   passport.deserializeUser(function(id, done) {
        //         getUserById(id, function(err, user) {
        //           done(err, user);
        //         });
        //   });