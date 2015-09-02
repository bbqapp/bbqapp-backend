var config  = {};

config.DB_URL = process.env.DB_URL || 'mongodb://localhost/app-test';
config.LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
config.LOG_PATH = process.env.LOG_PATH || 'logs/development.log';


module.exports = config;
