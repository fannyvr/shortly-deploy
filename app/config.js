var path = require('path');
var env = require('dotenv').config({verbose: false});
var crypto = require('crypto');
var mongoose = require('mongoose');
var db;

mongoUri = process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017';


mongoose.connect(mongoUri);

db = mongoose.connection;

db.on('err', function(err){
  console.log('Error connecting to database', err)
});

db.once('open', function() {
  console.log('Mongo is so open now!!');
});

module.exports = db;
