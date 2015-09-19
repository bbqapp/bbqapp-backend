"use strict";  // eslint-disable-line

var _ = require('lodash');

var base  = {};

base.name = 'bbqapp';
base.env = process.env.NODE_ENV || 'development';
base.DB_URL = process.env.DB_URL || 'mongodb://localhost/app-dev';
base.LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
base.LOG_PATH = process.env.LOG_PATH || 'logs/development.log';

var config = {
  development: {},
  test: {},
  production: {}
};

module.exports = _.extend(base, config[base.env]);
