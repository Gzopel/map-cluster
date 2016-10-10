const mongoose = require('mongoose');
const Character = require('./Character');
const Coordinates = require('./Coordinates');

var npcSchema = {
  role: {
    type: String, // TODO enum
    //required: true,
  },
  type: {
    type: String, // TODO enum
    //required: true,
  },
  position: {
    type: [Coordinates.schema],
  },
  transitions: {
    type: [String],
  },
  character: {
    type: Character.schema,
    //required: true,
  },
};

const schema = new mongoose.Schema(npcSchema);
const NPC = mongoose.model('NPC', schema);
module.exports = NPC;