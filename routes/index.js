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


router.get('/',  catchErrors(storeController.getStores));
router.get('/stores',  catchErrors(storeController.getStores));
router.get('/add',authController.isLoggedIn,  storeController.addStore);
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.post('/add', storeController.createStore);



router.post('/add',
	storeController.upload,
	catchErrors(storeController.resize),
	catchErrors(storeController.createStore)
);

router.post('/add/:id',
	storeController.upload,
	catchErrors(storeController.resize),
	catchErrors(storeController.updateStore)
);



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
							return done(null, user, req.flash('success', 'Vous êtes connecté ! ' + user.name));
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



router.post('/login', passport.authenticate('local', {
	failureRedirect: '/', failureFlash: true
	}), 
	function(req, res){
		res.redirect('/');
	}
);


router.get('/register', userController.registerForm);

router.post('/register',
	userController.validateRegister,
	//authController.login
);


router.get('/logout', userController.logout);


router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

module.exports = router;