const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User,  comparePassword, getUserByEmail, getUserById }  =  require('../models/User');
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');
const LocalStrategy = require('passport-local').Strategy;
const logins = require('../handlers/passport');



router.get('/', storeController.getStores);
router.get('/stores', storeController.getStores);
router.get('/add',userController.isLoggedIn,  storeController.addStore);
router.post('/add', storeController.createStore);
router.get('/stores/:id', storeController.editStore);



	router.get('/login', userController.loginForm);


	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback : true
	},
		function(req, email, password, done) {
			getUserByEmail(email, function(err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, req.flash('error', 'Emai non trouvé'));
				}
				comparePassword(password, user.password, function(err, isMatch) {
					if (err) { return done(err); }
					if(isMatch){
						
							return done(null, user, req.flash('success', 'You have successfully logged in!!'));
					}
					else{
							return done(null, false, req.flash('error', 'Mot de passe incorect'));
					}
				});
			});
		}
	));

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		getUserById(id, function(err, user) {
			done(err, user);
		});
	});

	router.get('/logout', userController.logout);











	router.post('/login', passport.authenticate('local', {
			successRedirect:'/',
			failureFlash: 'Failed Login!',
			badRequestMessage: 'Your message you want to change.', 
			failureRedirect:'/login',
	}));





	router.get('/register', userController.registerForm);


	router.post('/register',
	userController.validateRegister,
	//authController.login
	);




	module.exports = router;