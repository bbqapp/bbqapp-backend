"use strict";  // eslint-disable-line

var winston = require('winston');
var config = require('../config');

var consoleTransport = function() {
  return new winston.transports.Console({
    level: config.LOG_LEVEL,
    timestamp: true,
    prettyPrint: true,
    showLevel: true,
    colorize: true,
    handleExceptions: true,
    silent: process.env.NODE_ENV === 'development' ? true : false
  });
};

var fileTransport = function() {
  return new winston.transports.File({
    level: config.LOG_LEVEL,
    filename: config.LOG_PATH,
    showLevel: true,
    handleExceptions: true,
    maxsize: 128 * 1024 * 1024, // 128MB
    maxFiles: 10,
    silent: false
  });
};

var transports = function() {
  var transports = [consoleTransport(), fileTransport()];
  return transports;
};

var logger = new (winston.Logger)({
  transports: transports()
});


module.exports = logger;
