import path from 'path';
import winston from 'winston';
import '../schemas'; //register schemas
import MapInstance from '../lib/GameInstance';

const socket = require('socket.io');
const config = require(path.resolve('server',process.env.NODE_ENV));
const basePort = config.port;
const mapId = parseInt(process.env.MAP_ID.replace(':',''));


winston.info(`starting server for map ${mapId}`);
const port = basePort + mapId;
const io = socket.listen(port);
const mapInstance = new MapInstance(mapId, io);

mapInstance.init()
  .then(() => winston.info(`Socket server started on port: ${port}`))
  .catch((cause) => {
    winston.error(`Something went wrong: ${cause}`);
    process.emit(1);
  });


