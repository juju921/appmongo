const mongoose = require('mongoose');
const  Store = require('../models/Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');



const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
        next(null, true);
    } else {
        next({ message: 'That filetype isn\'t allowed!' }, false);
    }
    }
};




exports.homePage = (req, res) => {
    res.render('index');
    };

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Ajouter une boutique' });
};

exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
    // check if there is no new file to resize
    if (!req.file) {
      next(); // skip to the next middleware
      return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // once we have written the photo to our filesystem, keep going!
    next();
};

exports.createStore = (req, res) => {
    const store = new Store(req.body);
    store.save();
    req.flash('success', `Créé avec succès   ${store.name}`);
    res.redirect('/');
    
};

exports.getStores = (req, res) => {
    const stores = Store.find();
    console.log(stores);
    res.render('stores', { title: 'Stores', stores });
};


exports.editStore  = (req, res) => {
        const store =  Store.findOne({ _id: req.params.id });
        res.render('editStore', { title: `Edit ${store.name}`, store });
        next();
};

exports.getStoreBySlug = async (req, res, next) => {
        if (!store) return next();
        res.render('store', { store, title: store.name });
};
const confirmOwner = (store, user) => {
    if (!store.author.equals(user._id)) {
      throw Error('You must own a store in order to edit it!');
    }
  };

exports.getStores = async (req, res) => {
        const page = req.params.page || 1;
        const limit = 4;
        const skip = (page * limit) - limit;
      
        // 1. Query the database for a list of all stores
        const storesPromise = Store
          .find()
          .skip(skip)
          .limit(limit)
          .sort({ created: 'desc' });
      
        const countPromise = Store.count();
      
        const [stores, count] = await Promise.all([storesPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!stores.length && skip) {
        req.flash('info', `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`);
        res.redirect(`/stores/page/${pages}`);
        return;
        }

        res.render('stores', { title: 'Stores', stores, page, pages, count });
};




