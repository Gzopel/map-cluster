import cluster from 'cluster';

if (cluster.isMaster) {
   require('./cluster/master')
} else {
    require('./cluster/worker')
}
