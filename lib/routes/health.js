"use strict";  // eslint-disable-line

var express = require('express');
var router = express.Router();


// GET /health check for load balancing and smoke testing
router.get('/', function(req, res) {
  // needed because server should respond with HTTP OK 200, instead of
  // 302
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  res.json({status: 'ok'});
});


module.exports = router;
