const mongoose = require('mongoose');
const { coordinatesSchema } = require('./Coordinates');
const NPC = require('./NPC');


const spawnLocationSchema  = new mongoose.Schema({
  position : {
    type: coordinatesSchema,
  },
  origin:{
    type: Number,
    required: true
  },
  radius:{
    type: Number,
    default: 20
  },
});

const exitSchema  = new mongoose.Schema({
  position : {
    type: coordinatesSchema,
  },
  destination:{
    type: Number,
    required: true
  },
  radius:{
    type: Number,
    default: 20
  },
});

const elementSchema  = new mongoose.Schema({
  position : {
    type: coordinatesSchema,
  },
  type:{
    type: String,
    required: true
  },
  /*properties: {
    type: [Mixed]
  }*/
});



const mapSchema = {
  id: {
    type: Number,
    required: true,
    unique:true,
  },
  size: {
    type: coordinatesSchema,
  },
  exits: {
    type: [exitSchema],
  },
  spawnLocations: {
    type: [spawnLocationSchema],
  },
  characters: {
    type: [NPC.schema],
  },
  elements: {
    type: [elementSchema],
  }
};

const schema = new mongoose.Schema(mapSchema);
const Map = mongoose.model('Map', schema);

module.exports = Map;
