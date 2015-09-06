"use strict";  // eslint-disable-line

var assert = require('chai').assert;
var async = require('async');

function increase(i, callback) {
  if (i < 0) {
    callback(new Error('number to increase must be > 0 but was: ' + i), null);
    return;
  }
  var result = i + 1;
  callback(null, result);  // null ==> no error
}

describe('asyncjs test', function() {
  describe('call async with array', function() {
    it('single input', function(done) {
      increase(1, function(err, result) {
        if (err) {
          done(err);
          return;
        }
        assert.equal(2, result, 'increased number must match');
        done();
      });
    });
    it('#async.map()', function(done) {
      var arr = [1,2,3];
      async.map(arr, increase, function(err, results){
        // results is now an array with numbers+1
        assert.include(results, 4, 'results must include number');
        assert.lengthOf(results, 3, 'result array length must match');
      });
      done();
    });
    it('#async.each()', function(done) {
      var arr = [1,2,3,4,5,6,7,8,9,-1];
      async.each(arr, increase, function(err){
        // results is now an array with numbers+1
        assert.isDefined(err, 'error must be defined');
      });
      done();
    });

  });

  describe('call functions in series', function() {
    it('#async.series()', function(done) {
      async.series(
        [function(callback) {
          callback(null, 'one');
        },
         function(callback) {
           callback(null, 'two');
         }],
        function(err, results) {
          assert.include(results, 'one', 'result must include one');
          assert.include(results, 'two', 'result must include two');
          done();
        });
    });
    it('#async.series() with increase numbers (more complex)', function(done) {
      async.series(
        [function(callback) {
          increase(0, callback);
        },
         function(callback) {
           increase(1, callback);
         }],
        function(err, results) {
          assert.include(results, 1, 'results must include 1');
          assert.include(results, 2, 'results must include 2');
          done();
        });
    });
  });

  describe('async with waterfall, pass result from function to function', function() {
    it('#async.waterfall()', function(done) {
      async.waterfall([
        function(callback) {
          callback(null, 1, 2);
        },
        function(arg1, arg2, callback) {
          assert.equal(1, arg1, 'number must match');
          assert.equal(2, arg2, 'number must match');
          callback(null, 3);
        }],
                      function(err, result) {
                        assert.isNull(err, 'err must not be defined');
                        assert.equal(3, result, 'result must match');
                        done();
                      });
    });
  });
});
