// libs
var config = require('./lib/config');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('./lib/utils/logger.js');
var utils = require('./lib/utils/utils.js');

// routes
var health = require('./lib/routes/health.js');
var place = require('./lib/routes/place.js');

// init express app
var app = express();

// log config
logger.info(config);

// connect to mongodb
mongoose.connect(config.DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({limit: '10mb', type: utils.isImageOrVideo}));
app.use(cookieParser());

// health check
app.use('/health', health);

// routes
app.use('/api/places', place);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
app.use(function(err, req, res, next) { // eslint-disable-line
  var status = err.status || 500;
  var code = err.code || 'INTERNAL_ERROR';
  res.status(status);
  res.set('Content-Type', 'application/json');
  logger.error({status: err.status,
                msg: err.message, err: err, code: code});
  if (app.get('env') === 'development' || app.get('env') === 'test') {
    // development respond with stacktrace for better debugging
    res.json({status: status, msg: err.message, code: code, err: err});
  } else {
    // production (don't respond with error stacktrace)
    res.json({status: status, msg: err.message, code: code});
  }

});

module.exports = app;
