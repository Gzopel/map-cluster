const mongoose = require('mongoose');

const regionSchema = {
  maps: {
    type: [Number],
    required: true
  }
};
const schema = new mongoose.Schema(regionSchema);
const Region = mongoose.model('Region', schema);
module.exports = Region;
