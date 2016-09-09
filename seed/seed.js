require('../schemas');
const mongoose = require('mongoose');
const path = require('path')
const jsonCompiler = require(path.resolve('seed','jsonCompiler'));
const seeds = require(path.resolve('seed','pseudoJson',process.env.SEED))

let modelNames = Object.keys(seeds);
const promises = [];
let maxPromiseCount = 0;

modelNames.forEach((modelName)=>{
    const Model = mongoose.model(modelName);
    seeds[modelName].forEach((entry)=>{
        maxPromiseCount++;
        Model.remove(entry._id, (err)=>{
            if (err) console.log('Remove Error:', err);
            promises.push(new Model(entry).save());
            if (promises.length === maxPromiseCount) {
                Promise.all(promises).then(function() {
                    console.log('Finished seeding ' + maxPromiseCount + ' records total.');
                    process.exit(0);
                }).catch(function(err) {
                    console.log(err);
                    process.exit(0);
                });
            }
        })
    })
});
