import { EventEmitter2 } from 'eventemitter2';
import winston from 'winston';
import Character from '../schemas/Character';
import GameLoop from './GameLoop';

export default class MapInstance {
  constructor(mapData, io) {
    this.mapData = mapData;
    this.players = new Set();
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
        /*socket.client.playerId = msg.character;*/
        this.loop.addCharacter({ character: { id: msg.character, sheet: {} }, type: 'player' });// TODO loadPlayingCharacter
      });
      socket.on('disconnect', (msg) => {
/*        if (socket.client.playerId) {
          this.players.delete(socket.client.playerId);
        }*/
        winston.info('Left '+msg.character);
      });
      socket.on('player action', (msg) => {
        winston.info('player action: ', msg);
      });

      this.emitter.on('characterUpdate', (event) => {
        socket.emit('characterUpdate',event);
      });
    });
  }

  init() {
    this.loop.init();
  }

  loadPlayingCharacter(id) {
    return new Promise((resolve, reject) => {
      Character.find({ id: id }).exec().then(resolve).catch(reject);
    });
  }
}
