const cluster = require('cluster');
const express = require('express');
const path = require('path');
const config = require(path.resolve('server',process.env.NODE_ENV))
const port = config.port
const mapId = process.env.MAP_ID.replace(':','');
const offset = parseInt(mapId);
require(path.resolve('schemas'));

console.log("starting server for map "+mapId);

const app = express();
app.get('/map',(req,res)=>{
        res.status(200).send({mapId:mapId});
});

let mapPort = port+offset;
console.log("MAPWORKER STARTING ON PORT:",mapPort);
app.listen(mapPort)
