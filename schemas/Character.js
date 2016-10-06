const mongoose = require('mongoose');

const characterSchema = {
  id: {
    type: Number,
    required: true,
    unique:true,
  },
  sheet: {
    attributes: {
      physical: {
        strength: {
          type: Number,
          default: 0,
          required: true,
        },
        dexterity: {
          type: [Number],
          default: 0,
          required: true,
        },
        stamina: {
          type: Number,
          default: 0,
          required: true,
        },
      },
      social: {
        charisma: {
          type: Number,
          default: 0,
          required: true,
        },
        manipulation: {
          type: Number,
          default: 0,
          required: true,
        },
        appearence: {
          type: Number,
          default: 0,
          required: true,
        },
      },
      mental: {
        perception: {
          type: Number,
          default: 0,
          required: true,
        },
        intelligence: {
          type: Number,
          default: 0,
          required: true,
        },
        wits: {
          type: Number,
          default: 0,
          required: true,
        },
      }
    },
    abilities:{
      talents: {
        alertness: {
          type: Number,
          default: 0,
          required: true,
        },
        athletics: {
          type: Number,
          default: 0,
          required: true,
        },
        awareness: {
          type: Number,
          default: 0,
          required: true,
        },
        brawl: {
          type: Number,
          default: 0,
          required: true,
        },
        dodge: {
          type: Number,
          default: 0,
          required: true,
        },
        intimidation: {
          type: Number,
          default: 0,
          required: true,
        }
      },
      skills:{
        animalKen: {
          type: Number,
          default: 0,
          required: true,
        },
        archery: {
          type: Number,
          default: 0,
          required: true,
        },
        crafts: {
          type: Number,
          default: 0,
          required: true,
        },
        melee: {
          type: Number,
          default: 0,
          required: true,
        },
        riding: {
          type: Number,
          default: 0,
          required: true,
        },
        stealth: {
          type: Number,
          default: 0,
          required: true,
        },
      },
      knowledge: {
        enigmas: {
          type: Number,
          default: 0,
          required: true,
        },
        medicine: {
          type: Number,
          default: 0,
          required: true,
        },
        occult: {
          type: Number,
          default: 0,
          required: true,
        },
        metaphysics: {
          type: Number,
          default: 0,
          required: true,
        },
        rituals: {
          type: Number,
          default: 0,
          required: true,
        },
      }
    },
    maxHealth: {
      type: Number,
      default: 0,
      required: true,
    },
    otherTraits: [{
      name: {
        type: String,
        default: 0,
        required: true,
      },
      level: {
        type: Number,
        default: 0,
        required: true,
      },
    }],
  },
};
const schema = new mongoose.Schema(characterSchema);
const Character = mongoose.model('Character', schema);

module.exports = Character;