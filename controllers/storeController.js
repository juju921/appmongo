const mongoose = require('mongoose');
const  Store = require('../models/Store');


exports.homePage = (req, res) => {
    res.render('index');
    };

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Ajouter une boutique' });
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




