import { assert } from 'chai';
import GameInstance from '../lib/GameInstance';

const ioServer = require('socket.io').listen(5000);
const ioClient = require('socket.io-client');

const socketURL = 'http://0.0.0.0:5000';

const options ={
  transports: ['websocket'],
  'force new connection': true
};

const map = { size: { x: 400, z: 400 }, spawnLocations: [{ x: 10, z: 10, r: 10 }], exits: [{ x: 0, z: 0, to: 0 }] };
const mapData = { map: map, characters: [{ character: { position: { x: 2, z: 2 }, sheet: {} }, type: 'NNPC'}] };

describe(__filename, () => {
  const game = new GameInstance(mapData, ioServer);
  game.init();
  it('should connect and receive a map',(done) => {
    const client = ioClient.connect(socketURL, options);
    client.on('map', (data) => {
      assert(data, 'shouldn\'t be null');
      assert(data.map, 'should have a map');
      assert(data.map.size, 'should have a map size');
      assert(data.map.size.x > 0, 'should have a positive length');
      assert(data.map.size.z > 0, 'should have a positive width');
      assert(data.map.exits, 'should have an array of characters');
      assert(data.map.spawnLocations, 'should have an array of characters');
      assert(data.characters, 'should have an array of characters');
      done();
    });
  });

  it('should allow you to join and send a \'playerUpdate\'', (done) => {
    const client = ioClient.connect(socketURL, options);
    client.on('characterUpdate',(msg) => {
      assert(msg.type === 'characterUpdate', 'should be a character update');
      assert(msg.action === 'spawn', 'should be a spawn action');
      assert(msg.result === 'spawn', 'should have spawned');
      assert(msg.character === 2, 'not the expected character');
      assert(msg.position, 'should have a position');
      assert(msg.position.x > 0, 'should have a positive x');
      assert(msg.position.z > 0, 'should have a positive z');
      done();
    });
    client.emit('join',{character:2});
  });
});