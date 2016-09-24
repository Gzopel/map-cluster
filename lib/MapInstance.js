import winston from 'winston';
import Character from '../schemas/Character';

export default class MapInstance {
  constructor(map, io) {
    this.map = map;
    this.players = new Set();
    this.playingCharacters = new Set();
    this.io = io;
  }

  init() {
    io.on('connection', (socket) => {
      socket.on('join', function(msg) {
        if (!msg.player || msg.player.id) {
          winston.error('tried to join but has no player.id :',msg);
        }
        socket.client.playerId = msg.player.id;
        this.players.add(msg.player.id);
/*        loadPlayingCharacter(msg.character.id).then((pc) => {
          if (!pc) {
            winston.error(`couldn\'t find Character $(msg.character.id) for player $(msg.player.id) `);
            this.players.delete(socket.client.playerId);
            return;
          }
          this.playingCharacters.add(pc);
          io.sockets.emit('player join',pc);*/// Do not send the stats, send the visuals
          socket.emit({map:this.map}); // should be sended by chunks based on character vision
/*        }).catch((error) => {
          winston.error(`couldn\'t find Character $(msg.character.id) for player $(msg.player.id) error: $(error)`);
          this.players.delete(socket.client.playerId);
        })*/
      });
      socket.on('disconnect',  function(msg){
        if (socket.client.playerId){
          this.players.delete(socket.client.playerId);
        }
      });
      socket.on('player action', function(msg){
        winston.info('player action: ',msg);
        // TODO validate action
        if (msg.action && msg.action === 'MOVE') {
          const exit = !this.isOnExit(msg.position) && !this.isOnExit(this.nextPosition(msg));
          if (exit) {

          } else {
            io.sockets.emit('player update',msg);
          }
        }
      });
    });
  }

  loadPlayingCharacter(id) {
    return new Promise((resolve, reject) => {
      Character.find({ id: id }).exec().then(resolve).catch(reject);
    });
  }

  nextPosition() {
    return {x:0, y:0};
  }

  isOnExit(position) {
    this.map.exits.forEach((exit) => {
      if (dist2(position, exit.position)<exit.radius) {
        return exit;
      }
    })
    return false;
  }
}

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
