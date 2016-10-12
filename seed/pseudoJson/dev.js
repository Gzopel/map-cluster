const helper = require('../helper');
/*
*        Region:
*    _________________
*   |        |        |
*   |  Map 4    Map 3 |
*   |___  ___|___  ___|
*   |        |        |
*   |  Map 2    Map 1 |
*   |________|________|
*/


const models = {
  Character: [ // anonymous
    {
      id: 0,
      sheet: {
        attributes: {
          physical: {
            strength: 3,
            dexterity: 3,
            stamina: 3,
          },
        },
        abilities: {
          talents: {
            athletics: 3,
          },
          skills: {
            melee: 5,
          },
        },
        maxHealth: 7,
        items: {},
      },
      radius: 10,
    },
  ],
  Region: [
    {
      _id: helper.getId(),
      maps: [1, 2, 3, 4],
    },
  ],
  Map: [
    {
      _id: helper.getId(),
      id: 1,
      size: {
        x: 1600,
        z: 1600,
      },
      exits: [{
        position: { x: 1600, z: 800 },
        radius: 150,
        destination: 2,
      }, {
        position: { x: 800, z: 1600 },
        radius: 150,
        destination: 3,
      }],
      spawnLocations: [{
        position: { x: 1300, z: 800 },
        radius: 100,
        origin: 2,
      }, {
        position: { x: 800, z: 1300 },
        radius: 100,
        origin: 3,
      }],
    }, {
      _id: helper.getId(),
      id: 2,
      size: {
        x: 1600,
        z: 1600,
      },
      exits: [{
        position: { x: 800, z: 1600 },
        radius: 150,
        destination: 4,
      }, {
        position: { x: 0, z: 800 },
        radius: 150,
        destination: 1,
      }],
      spawnLocations: [{
        origin: 4,
        position: { x: 800, z: 1300 },
        radius: 100,
      }, {
        origin: 1,
        position: { x: 300, z: 800 },
        radius: 100,
      }],
    }, {
      _id: helper.getId(),
      id: 3,
      size: {
        x: 1600,
        z: 1600,
      },
      exits: [{
        position: { x: 800, z: 0 },
        radius: 150,
        destination: 1,
      }, {
        position: { x: 1600, z: 800 },
        radius: 150,
        destination: 4,
      }],
      spawnLocations: [{
        origin: 1,
        position: { x: 800, z: 300 },
        radius: 100,
      }, {
        origin: 4,
        position: { x: 1300, z: 800 },
        radius: 100,
      }],
    }, {
      _id: helper.getId(),
      id: 4,
      size: {
        x: 1600,
        z: 1600,
      },
      exits: [{
        position: { x: 800, z: 0 },
        radius: 150,
        destination: 2,
      }, {
        position: { x: 0, z: 800 },
        radius: 150,
        destination: 3,
      }],
      spawnLocations: [{
        origin: 2,
        position: { x: 800, z: 300 },
        radius: 100,
      }, {
        origin: 3,
        position: { x: 300, z: 800 },
        radius: 100,
      }],
    },
  ],
}

models.Map.forEach(map => helper.addRandomTrees(map, 100));

export default models;
