// libs
var config = require('./config');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('./utils/logger.js');
var utils = require('./utils.js');

// routes
var place = require('./routes/place.js');

// init express app
var app = express();

// log config
logger.info(config);

// connect to mongodb
mongoose.connect(config.DB_URL);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({limit: '10mb', type: utils.isImageOrVideo}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/places', place);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) { // eslint-disable-line
    logger.error({status: err.status,
                  msg: err.message, err: err});
    var status = err.status || 500;
    res.status(status);
    res.set('Content-Type', 'application/json');
    res.json({status: status, msg: err.message, err: err});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) { // eslint-disable-line
  logger.error(err);
  var status = err.status || 500;
  res.status(status);
  res.set('Content-Type', 'application/json');
  res.json({status: status, msg: err.message});
});

module.exports = app;
