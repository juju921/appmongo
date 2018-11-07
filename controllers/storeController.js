const mongoose = require('mongoose');
const Store = require('../models/Store');
const multer = require('multer');
const Jimp  = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype('image/');
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
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize =  (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo =  Jimp.read(req.file)
  .then(photo => {
    photo.resize(800, Jimp.AUTO);
    photo.write(`./public/uploads/${req.body.photo}`);
  })
  .catch(err => {
    console.error(err);
  });
  Console.log(req.file);
  next();
};

exports.createStore =  (req, res) => {
    const store = new Store(req.body);
    store.save();
    //  res.json(req.body);
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/`);
};

exports.getStores = async (req, res) => {
    // 1. Query the database for a list of all stores
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
};



exports.editStore = async (req, res) => {
    // 1. Find the store given the ID
    const store = await Store.findOne({ _id: req.params.id });
    // 2. confirm they are the owner of the store
    // TODO
    // 3. Render out the edit form so the user can update their store
    res.render('editStore', { title: `Edit ${store.name}`, store });
  };
  


exports.updateStore = async (req, res) => {
    // set the location data to be a point
    req.body.location.type = 'Point';
    // find and update the store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true, // return the new store instead of the old one
      runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store →</a>`);
    res.redirect(`/stores/${store._id}/edit`);
    // Redriect them the store and tell them it worked
  };
  
  exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug });
    if (!store) return next();
    res.render('store', { store, title: store.name });
  };




