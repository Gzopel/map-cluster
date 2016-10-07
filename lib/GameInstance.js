import { EventEmitter2 } from 'eventemitter2';
import winston from 'winston';
import Character from '../schemas/Character';
import Map from '../schemas/Map';
import GameLoop from './GameLoop';

export default class GameInstance {
  constructor(mapId, io) {
    this.mapId = mapId;
    this.io = io;
    this.emitter = new EventEmitter2();
    this.running = false;
  }

  init() {
    this.loadMap(this.mapId)
      .then((map) => {
        this.loop = new GameLoop(map, this.emitter);
        for (const characterConf of map.characters) {
          this.loop.addCharacter(characterConf);
        }
        this.loop.init();
        this.running = true;
        this.setUpSocket();
      })
      .catch((reason) => { throw new Error(reason); });
  }

  loadPlayingCharacter(id) {
    return new Promise((resolve, reject) => {
      Character.findOne({ id: id }).exec().then((character) => {
        if (!character) {
          return reject('Nothing found.');
        }
        return resolve(character);
      }).catch(reject);
    });
  }

  loadMap(id) {
    return new Promise((resolve, reject) => {
      Map.findOne({ id: id }).exec().then((map) => {
        if (!map) {
          return reject('Nothing found.');
        }
        return resolve(map);
      }).catch(reject);
    });
  }

  setUpSocket() {
    this.io.on('connection', (socket) => {
      socket.on('join', (msg) => {
        if (!msg.character) {
          winston.error('tried to join but has no player.id :', msg);
          return;
        }
        this.loadPlayingCharacter(msg.character).then((character) => {
          socket.characterId = msg.character;
          this.loop.addCharacter({ character: character, type: 'player' });
        }).catch((error) => {
          winston.error('Error loading character', error);
        });
      });
      socket.on('disconnect', () => {
        winston.info(`Left ${socket.characterId}`);
        this.loop.removeCharacter(socket.characterId);
      });
      socket.on('action', (msg) => {
        winston.info('player action: ', msg);
        this.loop.handlePlayerAction(msg);
      });

      this.emitter.on('characterUpdate', (event) => {
        socket.emit('characterUpdate', event);
      });
      this.emitter.on('rmCharacter', (event) => {
        socket.emit('rmCharacter', event);
      });
      this.emitter.on('snapshot', (event) => {
        socket.emit('snapshot', event);
      });
    });
  }
}
