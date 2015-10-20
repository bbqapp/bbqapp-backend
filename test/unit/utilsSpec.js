"use strict";  // eslint-disable-line

var expect = require('chai').expect;
var moment = require('moment');
var utils = require('../../lib/utils/utils');
var logger = require('../../lib/utils/logger');

describe('test utils functions', function() {
  it('#isImageOrVideo()', function(done) {
    expect(utils.matchImageOrVideo('image/jpeg')).to.be.ok; // eslint-disable-line
    expect(utils.matchImageOrVideo('video/mpeg')).to.be.ok; // eslint-disable-line
    expect(utils.matchImageOrVideo('application/zip')).to.be.false;  // eslint-disable-line
    expect(utils.matchImageOrVideo('application/octet-stream')).to.be.false; // eslint-disable-line
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
      logger.info('m.toISOString(): ' + m.toISOString());
      logger.info('m_utc.format(): ' + m_utc.format());
      logger.info('m_utc.toISOString(): ' + m_utc.toISOString());
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
