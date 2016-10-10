var idCount = 0;
var puff = new Buffer(12);
puff.fill(0);

var helper = module.exports = {
  getId : function () {
    return helper.getIntId(idCount++);
  },
  getIntId :function (i) {
    puff.writeUInt16BE(i, 10, 1);
    return puff.toString("hex");
  },
  
}
