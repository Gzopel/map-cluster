import { assert } from 'chai';
import { EventEmitter2 } from 'eventemitter2';

import GameLoop from '../lib/GameLoop';
import axeGuy from '../node_modules/rabbits-engine/tests/testData/axeGuy.json';

describe(__filename, () => {
  const emitter = new EventEmitter2();
  const map = { size: { x: 400, z: 400 } };
  const gameLoop = new GameLoop(map, emitter);
  const character = JSON.parse(JSON.stringify(axeGuy));
  it('1. Should emit \'newCharacter\' event one tick after addCharacter is called', () => {
    return new Promise((resolve) => {
      const testFn = (event) => {
        assert.deepEqual(event.character, character, 'not the expected character');
        assert.equal(event.characterType, 'player', 'not the expected type');
        resolve();
        emitter.removeListener('newCharacter', testFn);
      };

      emitter.on('newCharacter', testFn);

      gameLoop.addCharacter(character, 'player');

      gameLoop.init();
    });
  });


  it('2. Given a walk action should emmit \'characterUpdate\' event after tick', () => {
    const targetX = 100;
    const targetZ = 100;
    let prevTimestamp = 0;
    let prevX = axeGuy.position.x;
    let prevZ = axeGuy.position.z;
    return new Promise((resolve) => {
      const testFn = (event) => {
        assert.equal(event.type, 'characterUpdate', 'not the expected event');
        assert.equal(event.result, 'walk', 'not the expected event');
        assert.equal(event.character, axeGuy.id, 'not the expected player');
        assert(event.position, 'should have a position');
        assert(event.position.x > prevX, 'should have increased x');
        assert(event.position.z > prevZ, 'should have increased z');
        if (prevTimestamp) {
          const timeDiff = Math.abs(event.timestamp - (prevTimestamp + 25));
          assert(timeDiff < 5, 'timediff out of range');
        }
        if (event.position.x === targetX && event.position.z === targetZ) {
          emitter.removeListener('characterUpdate', testFn);
          resolve();
        } else {
          prevTimestamp = event.timestamp;
          prevX = event.position.x;
          prevZ = event.position.z;
        }
      };
      emitter.on('characterUpdate', testFn);
      gameLoop.handlePlayerAction({
        character: character.id,
        type: 'walk',
        direction: { x: targetX, z: targetZ },
      });
    });
  });

  it('3. Should emit \'rmCharacter\' event one tick after removeCharacter is called', () => {
    return new Promise((resolve) => {
      const testFn = (event) => {
        assert.equal(event.characterId, character.id, 'not the expected id');
        resolve();
        emitter.removeListener('rmCharacter', testFn);
        gameLoop.stop();
      };

      emitter.on('rmCharacter', testFn);

      gameLoop.removeCharacter(character.id);

      gameLoop.init();
    });
  });
  
});