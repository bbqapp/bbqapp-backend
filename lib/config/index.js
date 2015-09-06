"use strict";  // eslint-disable-line

var config  = {};

config.DB_URL = process.env.DB_URL || null;
config.LOG_LEVEL = process.env.LOG_LEVEL || null;
config.LOG_PATH = process.env.LOG_PATH || null;


module.exports = config;
