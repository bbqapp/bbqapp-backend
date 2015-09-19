"use strict";  // eslint-disable-line

var assert = require('chai').assert;
var moment = require('moment');
var utils = require('../../lib/utils/utils');
var logger = require('winston');

describe('test utils functions', function() {
  it('#isImageOrVideo()', function(done) {
    assert.ok(utils.matchImageOrVideo('image/jpeg'), 'content type matches');
    assert.ok(utils.matchImageOrVideo('video/mpeg'), 'content type matches');
    assert.notOk(utils.matchImageOrVideo('application/zip'), 'content type is not supported ');
    assert.notOk(utils.matchImageOrVideo('application/octet-stream'), 'content type is not supported ');
    done();
  });

  describe('Date and moment experimants', function() {
    it('#moment format() and valueOf()', function(done) {
      var m_utc = moment.utc();
      var m = moment();

      // print unix time
      logger.info('m.valueOf():     ' + m.valueOf());
      logger.info('m_utc.valueOf(): ' + m_utc.valueOf());

      // print human formated time
      logger.info('m.format():     ' + m.format());
      logger.info('m_utc.format(): ' + m_utc.format());
      done();
    });

    it('#default Date functions', function(done) {
      var date = new Date();
      logger.info('date: ' + date);
      logger.info('date.now: ' + Date.now());
      done();
    });
  });
});
