var mongoose = require('mongoose');

var coordinatesSchema = {
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  }
}
var Coordinates = mongoose.model('Coordinates', coordinatesSchema);


var exitSchema  = {
  position : {
    type:Coordinates.schema,
    required: true
  },
  destination:{
    type: Number,
    required: true
  },
  radius:{
    type: Number,
    default: 20
  },

}
var Exit = mongoose.model('Exit', exitSchema);

var elementSchema  = {
  position : {
    type:Coordinates.schema,
    required: true
  },
  type:{
    type: String,
    required: true
  },
  /*properties: {
    type: [Mixed]
  }*/
}
var MapElement = mongoose.model('MapElement', elementSchema);


var mapSchema = {
  id: {
    type: Number,
    required: true,
    unique:true
  },
  size: {
    type:Coordinates.schema,
    required:true
  },
  exits:{
    type: [Exit.schema]
  },
  elements:{
    type: [MapElement.schema]
  }
};
var schema = new mongoose.Schema(mapSchema);
var Map = mongoose.model('Map', schema);

module.exports = Map;
