import '../registerBabel';
import { TRANSITIONS } from 'rabbits-engine/lib/FSM/transitions';

export const NPCS = {
  tree: {
    role: 'NNPC',
    transitions: [],
    character: {
      type: 'tree',
      sheet: {
        attributes: {
          physical: {
            stamina: 10,
          },
        },
        maxHealth: 20,
      },
      radius:10,
    },
  },
  evilRabbit: {
    role: 'NPC',
    transitions: [TRANSITIONS.uneasy, TRANSITIONS.idleAfterCollision,
      TRANSITIONS.attackOnRangeIfIDLE, TRANSITIONS.attackWhenAttackedAndIDLE,
      TRANSITIONS.attackWhenAttackedAndWalking, TRANSITIONS.resumeAttackAfterCollision,
      TRANSITIONS.stopAttackingWhenResultIdle],
    character: {
      type: 'evilRabbit',
      sheet: {
        attributes: {
          physical: {
            strength: 3,
            dexterity: 3,
            stamina: 4,
          },
          mental: {
            perception: 4,
          },
        },
        abilities: {
          talents: {
            alertness: 4,
            athletics: 2,
            dodge: 2,
          },
          skills: {
            melee: 3,
          },
        },
        maxHealth: 7,
        items: {
          weapon: {
            range: 3,
            type: 'SWORD',
            damage: 4,
            difficulty: 6,
          },
        },
      },
      radius: 10,
    },
  },
};

export default NPCS;
