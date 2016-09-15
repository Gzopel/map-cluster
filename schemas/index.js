const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const mongoHost = require(path.resolve('server',process.env.NODE_ENV)).mongoHost;
mongoose.connect(mongoHost);
mongoose.Promise = Promise;

fs.readdirSync(__dirname).forEach((file)=>{
  if (__filename != file) {
    var mod = require(path.join(__dirname, file));
    var name = file.slice(0, -3); // remove '.js'
    module.exports[name] = mod;
  }
});
