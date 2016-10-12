import seeds from './pseudoJson/dev';
import schemas from '../schemas';

let modelNames = Object.keys(seeds);
const promises = [];
let maxPromiseCount = 0;

modelNames.forEach((modelName) => {
  const Model = schemas[modelName];
  seeds[modelName].forEach((entry) => {
    maxPromiseCount++;
    Model.remove(entry._id, (err) => {
      if (err) console.log('Remove Error:', err);
      promises.push(new Model(entry).save());
      if (promises.length === maxPromiseCount) {
        Promise.all(promises).then(() => {
          console.log('Finished seeding ' + maxPromiseCount + ' records total.');
          process.exit(0);
        }).catch((err) => {
          console.log(err);
          process.exit(0);
        });
      }
    })
  })
});
