import { assert } from 'chai';
import { EventEmitter2 } from 'eventemitter2';

import GameLoop from '../lib/GameLoop';

describe(__filename, () => {
  const emitter = new EventEmitter2();
  const gameLoop = new GameLoop(emitter);
  it('Should emit \'newCharacter\' event one tick after addCharacter is called', () => {
    return new Promise((resolve) => {
      const testFn = () => {
        resolve();
        emitter.removeListener('newCharacter', testFn);
        gameLoop.stop();
      };

      emitter.on('newCharacter', testFn);

      gameLoop.addCharacter({},'player');

      gameLoop.init();
    });
  });
});