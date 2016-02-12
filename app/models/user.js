var db = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var bluebird = require('bluebird');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  }
});

var User = mongoose.model('User', userSchema);

User.comparePassword = function(tried, saved, callback) {
    bcrypt.compare(tried, saved, function(err, isMatch) {
      if (err) {
        console.error("An error occurred checking password: ", err);
        callback(err);
      }
      callback(null, isMatch);
    });
  };
  
User.hashPassword = function(){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.get('password'), null, null).bind(this)
    .then(function(hash) {
      this.set('password', hash);
    });
};
  
userSchema.pre('save', function(next) {
  var cipher = bluebird.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
})

module.exports = User;
