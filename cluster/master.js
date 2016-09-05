const cluster = require('cluster');
const express = require('express');
const path = require('path');
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

app.get('/mapUrl/:id', (req, res) => {
    let mapId = req.params.id;
    if (!mapId) {
        return res.status(400).send('Need a mapId as argument')
    }

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
                console.log(`worker was killed by signal: ${signal}`);
            } else if (code !== 0) {
                console.log(`worker exited with error code: ${code}`);
            } else {
                console.log('worker success!');
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
})


process.on('uncaughtException', function(err) {
    console.log('UncaughtError',error);
    stopAllWorkers();
});

function stopAllWorkers() {
    cluster.disconnect(function () {
        console.log('All workers stopped');
    })
}

function mapUrl(mapId) {
    return  baseUrl + ':' + (port + parseInt(mapId)) + '/map'
}

app.listen(port);
