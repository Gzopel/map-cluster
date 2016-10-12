import { assert } from 'chai';

require('../registerBabel');

import GameInstance from '../lib/GameInstance';
import schemas from '../schemas';
import axeGuy from '../node_modules/rabbits-engine/tests/testData/axeGuy.json';

const npc = JSON.parse(JSON.stringify(axeGuy));

const Character = schemas.Character;
const Map = schemas.Map;

const ioServer = require('socket.io').listen(5000);
const ioClient = require('socket.io-client');

const socketURL = 'http://localhost:5000';

const options = {
  transports: ['websocket'],
  'force new connection': true,
};

const charId = 1234;
const charIdTwo = 4321;
const mapId = 1111;

const mapData = {
  id: mapId,
  size: { x: 400, z: 400 },
  spawnLocations: [{ position: { x: 10, z: 10 }, radius: 10, origin: -1 }],
  exits: [{ position: { x: 100, z: 0 }, destination: 1, radius: 10 }],
  characters: [],
  elements: [],
};

describe(__filename, () => {
  let game;
  let prevX;
  let prevZ;
  let client;
  before((done) => {
    const character = JSON.parse(JSON.stringify(axeGuy));
    const characterTwo = JSON.parse(JSON.stringify(axeGuy));
    character.id = charId;
    characterTwo.id = charIdTwo;
    Promise.all([
      new Character(character).save(),
      new Character(characterTwo).save(),
      new Map(mapData).save(),
    ]).then(() => {
      game = new GameInstance(mapId, ioServer);
      game.init();
      client = ioClient.connect(socketURL, options);
      done();
    });
  });
  after((done) => {
    Promise.all([
      Character.remove({ id: charId }).exec(),
      Character.remove({ id: charIdTwo }).exec(),
      Map.remove({ id: mapId }).exec(),
    ]).then(() => { done(); });
  });

  it('should send a snapshot of the game and a \'characterUpdate\' (spawn) on player join', (done) => {
    const snapshotPromise = new Promise((resolve) => {
      const onSnapshot = (data) => {
        assert(data, 'shouldn\'t be null');
        assert(data.map, 'should have a map');
        assert(data.map.size, 'should have a map size');
        assert(data.map.size.x > 0, 'should have a positive length');
        assert(data.map.size.z > 0, 'should have a positive width');
        assert(data.map.exits, 'should have an array of exits');
        assert(data.map.exits.length, 'should have at least one exit');
        assert(data.map.spawnLocations, 'should have an array of spawnLocation');
        assert(data.map.spawnLocations.length, 'should have at least one spawnLocation');
        //TODO This should be contain character states
        // assert(data.characters, 'should have an array of characters');
        client.removeListener('snapshot', onSnapshot);
        resolve();
      };
      client.on('snapshot', onSnapshot);
    });
    const updatePromise = new Promise((resolve) => {
      const onUpdate = (msg) => {
        assert(msg.type === 'characterUpdate', 'should be a character update');
        assert(msg.action === 'spawn', 'should be a spawn action');
        assert(msg.result === 'spawn', 'should have spawned');
        assert(msg.character === charId, 'not the expected character');
        assert(msg.position, 'should have a position');
        assert(msg.position.x > 0, 'should have a positive x');
        assert(msg.position.z > 0, 'should have a positive z');
        prevX = msg.position.x;
        prevZ = msg.position.z;
        client.removeListener('characterUpdate', onUpdate);
        resolve();
      };
      client.on('characterUpdate', onUpdate);
    });
    Promise.all([snapshotPromise, updatePromise]).then(() => done());
    client.emit('join', { character: charId, type: 'player' });
  });

  it('should allow player to move and \'playerUpdate\'', (done) => {
    const targetX = 100;
    const targetZ = 100;
    const testFn = (msg) => {
      assert(msg.type === 'characterUpdate', 'should be a character update');
      assert(msg.action === 'walk', 'should be a walk action');
      assert(msg.result === 'walk', 'should have walked');
      assert(msg.character === charId, 'not the expected character');
      assert(msg.position, 'should have a position');
      assert(msg.position.x > prevX, 'should have increased x');
      assert(msg.position.z > prevZ, 'should have increased z');
      if (msg.position.x === targetX && msg.position.z === targetZ) {
        client.removeListener('characterUpdate', testFn);
        return done();
      }
      prevX = msg.position.x;
      prevZ = msg.position.z;
    };
    client.on('characterUpdate', testFn);
    setTimeout(() => {
      client.emit('action', {
        character: charId,
        type: 'walk',
        direction: { x: targetX, z: targetZ },
      });
    }, 100);
  });

  it('should notify on player join and disconnect', (done) => {
    const clientTwo = ioClient.connect(socketURL, options);
    const onJoin = (msg) => {
      assert(msg.type === 'characterUpdate', 'should be a character update');
      assert(msg.action === 'spawn', 'should be a spawn action');
      assert(msg.result === 'spawn', 'should have spawned');
      assert(msg.character === charIdTwo, 'not the expected character');
      assert(msg.position, 'should have a position');
      assert(msg.position.x > 0, 'should have a positive x');
      assert(msg.position.z > 0, 'should have a positive z');
      client.removeListener('characterUpdate', onJoin);

      clientTwo.disconnect();
    };

    const onRemove = (msg) => {
      assert(msg.character === charIdTwo, 'not the expected character');
      assert(msg.type === 'rmCharacter', 'should be a remove event');
      client.removeListener('rmCharacter', onRemove);
      done();
    };

    client.on('characterUpdate', onJoin);
    client.on('rmCharacter', onRemove);

    clientTwo.emit('join', { character: charIdTwo });
  });


  it('should emit a \'warp\' event after stepping in an exit for the player followed by a \'rmCharacter\' for all clients', (done) => {
    const warpPromise = new Promise((resolve) => {
      const onWarp = (msg) => {
        assert(msg.type === 'characterUpdate', 'should be a character update');
        assert(msg.action === 'walk', 'should be a walk action');
        assert(msg.character === charId, 'not the expected character');
        if (msg.result === 'warp') {
          assert(msg.destination, 'should have a destination');
          client.removeListener('characterUpdate', onWarp);
          resolve();
        }
      };
      client.on('characterUpdate', onWarp);
    });
    const removePromise = new Promise((resolve) => {
      const onRemove = (msg) => {
        assert(msg.character === charId, 'not the expected character');
        assert(msg.type === 'rmCharacter', 'should be a remove event');
        client.removeListener('rmCharacter', onRemove);
        resolve();
      };
      client.on('rmCharacter', onRemove);
    });

    Promise.all([warpPromise, removePromise]).then(() => done());

    client.emit('action', {
      character: charId,
      type: 'walk',
      direction: { x: 100, z: 0 },
    });
  });
});