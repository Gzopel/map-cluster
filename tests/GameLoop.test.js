import { assert } from 'chai';
import { EventEmitter2 } from 'eventemitter2';

import GameLoop from '../lib/GameLoop';
import axeGuy from '../node_modules/rabbits-engine/tests/testData/axeGuy.json';

describe(__filename, () => {
  const emitter = new EventEmitter2();
  const gameLoop = new GameLoop(emitter);
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
    const timestamp = new Date().getTime();
    return new Promise((resolve) => {
      const testFn = (event) => {
        assert.equal(event.type, 'characterUpdate', 'not the expected event');
        assert.equal(event.result, 'walk', 'not the expected event');
        assert.equal(event.character, axeGuy.id, 'not the expected player');
        assert(event.position, 'should have a position');
        assert(event.position.x > axeGuy.position.x, 'should have increased x');
        assert(event.position.z > axeGuy.position.z, 'should have increased z');
        assert(event.timestamp > timestamp, 'should have tick timestamp');
        emitter.removeListener('characterUpdate', testFn);
        resolve();
      };
      emitter.on('characterUpdate', testFn);
      gameLoop.handlePlayerAction({
        character: character.id,
        type: 'walk',
        direction: { x: 10, z: 10 },
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