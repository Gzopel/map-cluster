var mongoose = require('mongoose');

var regionSchema = {
  maps: {
    type: [Number],
    required: true
  }
};
var schema = new mongoose.Schema(regionSchema);
var Region = mongoose.model('Region', schema);
module.exports = Region;
