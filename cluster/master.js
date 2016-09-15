import cluster from 'cluster';
import express from 'express';
import path from 'path';
import winston from 'winston';
import schemas from '../schemas';
const config = require(path.resolve('server', process.env.NODE_ENV))
const port = config.port
const baseUrl = config.baseUrl;

/**
 *  We would really like to create another instance (eg. AWS) for each process,
 *  but cluster fork works for now since vertically scaling is not an issue.
 *  Also we would like to have all workers listening on the same port and do the
 *  map partition by path (eg. /map54122 ) but again the numbers are not an issue at the moment.
 *  Express was chosen for ease but it might not be the best option.
 * */
const instances = new Map();
const app = express();

process.on('uncaughtException', function(error) {
    winston.error('UncaughtError',error);
    stopAllWorkers();
});

const stopAllWorkers = () => {
    cluster.disconnect(function () {
        winston.log('All workers stopped');
    })
}

const mapUrl = (mapId)=>{
    return  baseUrl + ':' + (port + parseInt(mapId)) + '/map'
}

const existsInARegion = (mapId) => {
  return new Promise((resolve,reject)=>{
      schemas.Region.find({maps:{$elemMatch:mapId}}).exec().
        then((error,region)=>{
          if (error || !region)
            return reject(error);
          resolve();
        }).catch(reject)
  });
}

app.post('/mapUrl/:id', (req, res) => {
    let mapId = req.params.id;
    if (!mapId) {
        return res.status(400).send('Need a mapId as argument')
    }
    existsInARegion(mapId).then(()=>{
      res.status(200);
      if (instances.has(mapId)) {
          res.send({
              url: mapUrl(mapId)
          })
      } else {
          let worker = cluster.fork({
              MAP_ID: mapId
          });
          worker.on('exit', (code, signal) => {
              if (signal) {
                  winston.log(`worker was killed by signal: ${signal}`);
              } else if (code !== 0) {
                  winston.error(`worker exited with error code: ${code}`);
              } else {
                  winston.log('worker success!?');
              }
              instances.delete(mapId);
          }).
          once('listening', (worker) => {
              res.send({
                  url: mapUrl(mapId)
              })
          });
          instances.set(mapId, worker);
      }
    }).catch((error)=>{
        if(!error)
          return res.status(404).send('Map doesn\'t exist');
        res.status(500);
    })
})

app.listen(port);
