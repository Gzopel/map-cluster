const mongoose = require('mongoose');
const Character = require('./Character');

var npcSchema = {
  type: {
    type: String, // TODO enum
    //required: true,
  },
  subType: {
    type: String, // TODO enum
    //required: true,
  },
  character: {
    type: Character.schema,
    //required: true,
  },
};

const schema = new mongoose.Schema(npcSchema);
const NPC = mongoose.model('NPC', schema);
module.exports = NPC;