const mongoose = require('mongoose');

const characterSchema = {
  id: {
    type: Number,
    required: true,
    unique:true,
  },
  radius: {
    type: Number,
    default: 10,
  },
  sheet: {
    attributes: {
      physical: {
        strength: {
          type: Number,
          default: 0,
        },
        dexterity: {
          type: Number,
          default: 0,
          
        },
        stamina: {
          type: Number,
          default: 0,
          
        },
      },
      social: {
        charisma: {
          type: Number,
          default: 0,
          
        },
        manipulation: {
          type: Number,
          default: 0,
          
        },
        appearence: {
          type: Number,
          default: 0,
          
        },
      },
      mental: {
        perception: {
          type: Number,
          default: 0,
          
        },
        intelligence: {
          type: Number,
          default: 0,
          
        },
        wits: {
          type: Number,
          default: 0,
          
        },
      }
    },
    abilities:{
      talents: {
        alertness: {
          type: Number,
          default: 0,
          
        },
        athletics: {
          type: Number,
          default: 0,
          
        },
        awareness: {
          type: Number,
          default: 0,
          
        },
        brawl: {
          type: Number,
          default: 0,
          
        },
        dodge: {
          type: Number,
          default: 0,
          
        },
        intimidation: {
          type: Number,
          default: 0,
          
        }
      },
      skills:{
        animalKen: {
          type: Number,
          default: 0,
          
        },
        archery: {
          type: Number,
          default: 0,
          
        },
        crafts: {
          type: Number,
          default: 0,
          
        },
        melee: {
          type: Number,
          default: 0,
          
        },
        riding: {
          type: Number,
          default: 0,
          
        },
        stealth: {
          type: Number,
          default: 0,
          
        },
      },
      knowledge: {
        enigmas: {
          type: Number,
          default: 0,
          
        },
        medicine: {
          type: Number,
          default: 0,
          
        },
        occult: {
          type: Number,
          default: 0,
          
        },
        metaphysics: {
          type: Number,
          default: 0,
          
        },
        rituals: {
          type: Number,
          default: 0,
          
        },
      }
    },
    maxHealth: {
      type: Number,
      default: 0,
      
    },
    otherTraits: [{
      name: {
        type: String,
        default: 0,
        
      },
      level: {
        type: Number,
        default: 0,
        
      },
    }],
  },
};
const schema = new mongoose.Schema(characterSchema);
const Character = mongoose.model('Character', schema);

module.exports = Character;