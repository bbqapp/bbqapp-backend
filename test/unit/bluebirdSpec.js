"use strict"; // eslint-disable-line

var logger = require('../../lib/utils/logger');
var expect = require('chai').expect;
var Promise = require('bluebird');
var _ = require('lodash');

var simpleAdd = function(a, b) {
  return a + b;
};

var add = function(numbers, done) {
  setTimeout(function() {
    var sum = _.reduce(numbers, simpleAdd, 0);
    done(null, sum);
  }, 0);
};

var addAsync = function(/* arguments */) {
  var allargs = _.toArray(arguments);
  return new Promise(function(resolve, reject) {
    add(allargs, function(err, sum) {
      if (err){
        reject(err);
      } else {
        resolve(sum);
      }
    });
  });
};

describe('bluebird promise experiments', function() {
  describe('tests', function() {
    it('normal async call', function(done) {
      add([1, 2, 3], function(err, sum) {
        logger.info('sum: ' + sum);
        done();
      });
    });
    it('promise add', function(done) {
      addAsync(1, 2, 3)
        .then(function(sum) {
          logger.info('output async:' + sum);
          done();
        });
    });
    it('promise.spread()', function(done) {
      Promise.resolve(['hello', 'daniel'])
        .spread(function(hello, daniel) {
          expect(hello).to.be.equal('hello');
          expect(daniel).to.be.equal('daniel');
          done();
        });
    });
    it('promise.all()', function(done) {
      // create 10 promises
      var promises = _.times(10, function(index) {
        var range = _.range(0, index + 1);
        return addAsync.apply(null, range);
      });
      Promise.all(promises)
        .then(function(results) {
          logger.info('sums: ', {sums: results});
          done();
        })
        .catch(function(e) {
          logger.error(e);
          done(e);
        });
    });
    it('promise.all() with error throwing and catch handler', function(done) {
      // create 10 promises
      var promises = _.times(10, function(index) {
        var range = _.range(0, index + 1);
        return addAsync.apply(null, range);
      });
      Promise.all(promises)
        .then(function() {
          throw new Error('provoke error');
        })
        .catch(function(e) {
          logger.error(e);
          // do not fail test, we want to provoke error!
          done();
        });
    });
    it('promise.all() with error throwing and catch handler', function(done) {
      // create 10 promises
      var promises = _.times(10, function(index) {
        var range = _.range(0, index + 1);
        return addAsync.apply(null, range);
      });
      promises.push(Promise.reject('reject promise'));
      Promise.all(promises)
        .then(function() {
          throw new Error('provoke error');
        })
        .catch(function(e) {
          // logger.error(e);
          // do not fail test, we want to provoke error!
          done();
        });
    });
  });
});
