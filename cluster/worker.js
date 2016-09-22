import cluster from 'cluster';
import express from 'express';
import path from 'path';
import winston from 'winston';
import Map from '../schemas/Map';
import MapInstance from '../lib/MapInstance'
const config = require(path.resolve('server',process.env.NODE_ENV));
const port = config.port;
const mapId = process.env.MAP_ID.replace(':','');
const offset = parseInt(mapId);
const app = express();

let mapInstance;
winston.log("starting server for map "+mapId);
Map.find({id:mapId}).exec().
  then((map)=>{
    if(!map) {
      winston.error('Error loading map: No map found.');
    }

    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    mapInstance = new MapInstance(map,io);

    app.get('/map',(req,res)=>{
      res.status(200).send({mapId:mapId});
    });

    const mapPort = port+offset;
    winston.info("MAPWORKER STARTING ON PORT:",mapPort);
    app.listen(mapPort)
  }).catch((error)=>{
    winston.error('Error loading map: ',error);
    process.exit();
  });

