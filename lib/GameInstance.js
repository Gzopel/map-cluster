import { EventEmitter2 } from 'eventemitter2';
import uuid from 'uuid';
import winston from 'winston';
import NPCS from '../npcs';
import Character from '../schemas/Character';
import Map from '../schemas/Map';
import '../registerBabel';

import GameLoop from './GameLoop';

export default class GameInstance {
  constructor(mapId, io) {
    this.mapId = mapId;
    this.io = io;
    this.emitter = new EventEmitter2();
    this.running = false;
  }

  init() {
    return this.loadMap(this.mapId)
      .then((map) => {
        this.loop = new GameLoop(map, this.emitter);
        for (const characterConf of map.characters) {
          this.loadNPCdata(characterConf);
        }
        this.loop.init();
        this.running = true;
        this.setUpSocket();
      });
  }

  loadNPCdata(characterConf) {
    if (!NPCS[characterConf.type]) {
      winston.error(`No template for character type ${characterConf.type}`);
      return;
    }
    const template = JSON.parse(JSON.stringify(NPCS[characterConf.type]));
    template.character.id = uuid.v4();
    const characterData = {}
    characterData.character = characterConf.character || template.character;
    characterData.character.position = characterConf.position;
    characterData.transitions = characterConf.transitions || template.transitions;
    characterData.role = characterConf.role || template.role;
    console.log('post',characterData);
    this.loop.addCharacter(characterData);
  }

  loadPlayingCharacter(id) {
    return new Promise((resolve, reject) => {
      Character.findOne({ id: id }).exec().then((character) => {
        if (!character) {
          return reject(`Character not found ${id}.`);
        }
        return resolve(character);
      }).catch(reject);
    });
  }

  loadMap(id) {
    return new Promise((resolve, reject) => {
      Map.findOne({ id: id }).exec().then((map) => {
        if (!map) {
          return reject(`Map not found ${id}.`);
        }
        return resolve(map);
      }).catch(reject);
    });
  }

  setUpSocket() {
    this.io.on('connection', (socket) => {
      winston.info('GOt connection!!!');
      socket.on('join', (msg) => {
        if (!msg.character) {
          winston.error('tried to join but has no player.id :', msg);
          return;
        }
        winston.info('player joing',msg);
        const characterId = msg.type === 'anonymous' ? 0 : msg.character;
        this.loadPlayingCharacter(characterId).then((character) => {
          socket.characterId = msg.character;
          character = {
            sheet: character.sheet,
            id: msg.character,
          };
          this.loop.addCharacter({ character: character, role: 'player' });
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
        winston.info('sending update',event);
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
