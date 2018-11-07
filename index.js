// On initialise le module Express 
const express = require('express');
const path = require('path');
const passport = require('passport');
// On initialise le module express-session afin de pouvoir utiliser les notifications flash
const session = require('express-session')
const mongoose = require('mongoose');
const routes = require('./routes/index');
const flash = require('connect-flash');
const helpers = require('./helpers');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
require('./handlers/passport');
const appPort= 3000;

mongoose.connect('mongodb://localhost:27017/cafe',{useNewUrlParser: true}).catch((err)=>{
    console.log(err)
})

//On instancie une nouvelle Constante app
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());

app.use(flash());
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
}));

require('./handlers/passport');
app.use(passport.initialize());
app.use(passport.session());




app.use((req, res, next) => {
        res.locals.flashes = req.flash();
        res.locals.h = helpers;
        res.locals.user = req.user || null;
        next();
});    

app.use(expressValidator());
// Passport Config


// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

app.use('/',routes);
// On dit à express d'utiliser le chemin afin d'afficher les vues
app.set('views',path.join(__dirname,'views'));
// On utilise le moteur de template Pug afin de pouvoir afficher nos vues (http://ejs.co/, http://handlebarsjs.com/ ...)
app.set('view engine','pug');


//On utilise express.static afin de charger des fichiers (css, images)
app.use(express.static(path.join(__dirname,'public')));

const Store = require('./models/Store');
const User = require('./models/User');



const server = app.listen(appPort, () => {
    console.log(`App running on port ${appPort}`)
})