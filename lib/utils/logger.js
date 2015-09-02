var winston = require('winston');
var config = require('../config.js');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ name: 'file-logger',
                                    filename: config.LOG_PATH,
                                    level: config.LOG_LEVEL })
  ]
});


module.exports = logger;
