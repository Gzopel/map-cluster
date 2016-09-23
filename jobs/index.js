const fs = require('fs');
const path = require('path');

module.exports = () => {
  fs.readdirSync(__dirname).forEach((file) =>{
    const filePath = path.join(__dirname, file);
    if (__filename != filePath) {
      require(filePath)();
    }
  });
}