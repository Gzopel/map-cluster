import cluster from 'cluster';
import express from 'express';
import path from 'path';
import winston from 'winston';
const config = require(path.resolve('server',process.env.NODE_ENV));
const port = config.port;
const mapId = process.env.MAP_ID.replace(':','');
const offset = parseInt(mapId);

winston.log("starting server for map "+mapId);

const app = express();
app.get('/map',(req,res)=>{
    res.status(200).send({mapId:mapId});
});

let mapPort = port+offset;
winston.info("MAPWORKER STARTING ON PORT:",mapPort);
app.listen(mapPort)
