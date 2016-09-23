import winston from 'winston';

const cron = require("cron").CronJob;
const path = require('path');

module.exports = function () {
  winston.info('CREATING CRON CLOSE JOB');
  //every 5 mins
  new cron('0,5,10,15,20,25,30,35,40,45,50,55 * * * *', () => {
    winston.info('RUNNING CRON CLOSE JOB');
    if (shouldExit()) {
      //close gracefully
      process.exit();
    }
  }, null, true);
}

function shouldExit() {
  // TODO check db for lastactivity>T and active players === 0
  return false;
}