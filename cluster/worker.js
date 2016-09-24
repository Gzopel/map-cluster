import express from 'express';
import path from 'path';
import winston from 'winston';
import MapInstance from '../lib/MapInstance';

const Map = require(path.resolve('schemas/')).Map;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require(path.resolve('server',process.env.NODE_ENV));
const port = config.port;
const mapId = process.env.MAP_ID.replace(':','');
const offset = parseInt(mapId);

let mapInstance = null;

winston.info('starting server for map ' + mapId);

Map.findOne({ id: mapId }).exec()
  .then((map) => {
    if (!map) {
      return winston.error('Error loading map: No map found.');
    } else winston.info("got map")

    mapInstance = new MapInstance(map, io);

    app.get('/mapInstance', (req, res) => {
      res.status(200).send({ map: map });
    });

    const mapPort = port + offset;
    winston.info('MAPWORKER STARTING ON PORT:', mapPort);
    return app.listen(mapPort);
  })
  .catch((error) => {
    winston.error('Error loading map: ', error);
    process.exit();
  });
