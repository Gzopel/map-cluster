export const NPCS = {
  tree: {
    type: 'NNPC',
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
};

export default NPCS;
