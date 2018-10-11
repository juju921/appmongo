  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  mongoose.Promise = global.Promise;
  const md5 = require('md5');
  const validator = require('validator');
  const bcrypt = require('bcryptjs');
  const mongodbErrorHandler = require('mongoose-mongodb-errors');
  const passportLocalMongoose = require('passport-local-mongoose');


  const userSchema = new Schema({
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Invalid Email Address'],
      required: 'Please Supply an email address'
    },
    name: {
      type: String,
      required: 'Please supply a name',
      trim: true
    },
    password : {
        type: String,
        allowNull: false,
        required: true,
        len: [2,10]
    }
  });

  userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
  });

  userSchema.plugin(mongodbErrorHandler);
  userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });


   const User =  mongoose.model('User', userSchema);


  
  module.exports.getUserByEmail = (email, callback) => {
    let Obj = {email: email}
    User.findOne(Obj, callback);
  }
  
  module.exports.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, function(err, isMatch){
      if(err) throw err;
      callback(null, isMatch);
    });
  }
  
  module.exports.getUserById = (id, callback) => {
      User.findById(id, callback);
  }
