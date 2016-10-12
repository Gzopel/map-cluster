import '../registerBabel';
import { vectorDistanceToVector } from 'rabbits-engine/lib/rules/math'
let idCount = 0;
const puff = new Buffer(12);
puff.fill(0);

const helper = module.exports = {
  getId() {
    return helper.getIntId(idCount++);
  },
  getIntId(i) {
    puff.writeUInt16BE(i, 10, 1);
    return puff.toString('hex');
  },
  addRandomTrees(map, treeNumber) { // not very efficient, but works for now.
    if (!map.characters) {
      map.characters = [];
    }
    for (let i = 0; i < treeNumber; i++) {
      let tries = 0;
      let position = null;
      const detectCollision = (element) => {
        if (position && vectorDistanceToVector(position, element.position) < element.radius + 20) {
          position = null;
        }
      }
      while (tries < 100 && position == null) {
        position = {
          x: Math.ceil(Math.random() * map.size.x),
          z: Math.ceil(Math.random() * map.size.z),
        };
        map.spawnLocations.forEach(detectCollision);
        map.exits.forEach(detectCollision);
        map.characters.forEach(detectCollision);
      }
      if (position) {
        map.characters.push({
          position: position,
          type: 'tree',
        });
      }
    }
  },
}
