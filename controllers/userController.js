  const mongoose = require('mongoose');
  const User = require('../models/User');
  const bcrypt = require('bcryptjs');
  const passport = require('passport');
  
  
  
  exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
    
  };
  
  
  exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
  };
  
  
  
  
  
  exports.validateRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    req.sanitizeBody('name');
req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email', 'That Email is not valid!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
      gmail_remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
    req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);
    
    const errors = req.validationErrors();
    
    if(errors){
      req.flash('error', errors.map(err => err.msg));
      res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
      return; 
    } else {
      
      let newUser = new User({
        name:name,
        email:email,
        password:password
      });
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(function(err){
            if(err){
              return;
            } else {
              req.flash('success','Votre compte à bien été enregistré');
              res.redirect('/');
              next();
            }
          });
        });
      });
    }
};

  
  
exports.isLoggedIn = (req, res, next) => {
    // first check if the user is authenticated
    if (req.isAuthenticated()) {
      next(); // carry on! They are logged in!
      Console.log('done');
      return User;
    }
    req.flash('error', 'Oops Vous devez être connecté pour effectuer cette action');
    res.redirect('/login');
};
  
exports.accout = (req,res) => {
    res.render('account', {title : 'modifier votre compte'});
};
exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Vous êtes déconnecté 👋');
    res.redirect('/');
};
  
exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Updated the profile!');
  res.redirect('back');
};