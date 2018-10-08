const express = require('express');
const router = express.Router();
const passport = require('passport');
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');
const logins = require('../handlers/passport');



router.get('/', storeController.getStores);
router.get('/stores', storeController.getStores);
router.get('/add', storeController.addStore);
router.post('/add', storeController.createStore);
router.get('/stores/:id', storeController.editStore);



router.get('/login', userController.loginForm);
// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureFlash: 'Failed Login!',
    badRequestMessage: 'Your message you want to change.', 
    failureRedirect:'/login',
  })(req, res, next);
});
// function(req, res, next){
//   passport.authenticate('local', {
//     successRedirect:'/',
//     failureFlash: 'Failed Login!',
//     badRequestMessage: 'Your message you want to change.', 
//     failureRedirect:'/login',
//   })(req, res, next);


router.get('/register', userController.registerForm);


router.post('/register',
  userController.validateRegister,
  authController.login
);




module.exports = router;