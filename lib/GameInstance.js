import { EventEmitter2 } from 'eventemitter2';
import winston from 'winston';
import Character from '../schemas/Character';
import GameLoop from './GameLoop';

export default class MapInstance {
  constructor(mapData, io) {
    this.mapData = mapData;
    this.io = io;
    this.emitter = new EventEmitter2();
    this.loop = new GameLoop(mapData.map, this.emitter);
    for (const characterConf of mapData.characters) {
      this.loop.addCharacter(characterConf);
    }
    this.io.on('connection', (socket) => {
      socket.emit('map',this.mapData);
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
      socket.on('disconnect', (msg) => {
        winston.info('Left '+socket.characterId);
        this.loop.removeCharacter(socket.characterId);
      });
      socket.on('action', (msg) => {
        winston.info('player action: ', msg);
        this.loop.handlePlayerAction(msg);
      });

      this.emitter.on('characterUpdate', (event) => {
        socket.emit('characterUpdate',event);
      });
      this.emitter.on('rmCharacter', (event) => {
        socket.emit('rmCharacter',event);
      });
    });
  }

  init() {
    this.loop.init();
  }

  loadPlayingCharacter(id) {
    return new Promise((resolve, reject) => {
      Character.findOne({ id: id }).exec().then((character) => {
        if (!character) {
          return reject('Nothing found.');
        }
        resolve(character);
      }).catch(reject);
    });
  }
}
