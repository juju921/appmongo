const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User =  require('../models/User');
const bcrypt = require('bcryptjs');




exports.login = passport.authenticate('local', {
  usernameField: 'email',
  passwordField: 'password'
  },

  function(email, password) {

      let query = {email: email};
      
      User.findOne(query, function(err, user){
      if(err) throw err;
      console.log(user)
      if(!user){
          return (null, false, {message: 'No user found'});
      }
  
      bcrypt.compare(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
              return (null, user);
          } else {
              return (null, false, {message: 'Wrong password'});
          }
      });
      });
});


exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out! 👋');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next(); // carry on! They are logged in!
    return;
  }
  req.flash('error', 'Oops you must be logged in to do that!');
  res.redirect('/login');
};