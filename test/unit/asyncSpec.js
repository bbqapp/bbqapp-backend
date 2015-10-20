"use strict";  // eslint-disable-line

var expect = require('chai').expect;
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
        expect(2).to.be.equal(result);
        done();
      });
    });
    it('#async.map()', function(done) {
      var arr = [1,2,3];
      async.map(arr, increase, function(err, results){
        // results is now an array with numbers+1
        expect(results).to.include(4);
        expect(results).to.have.length(3);
      });
      done();
    });
    it('#async.each()', function(done) {
      var arr = [1,2,3,4,5,6,7,8,9,-1];
      async.each(arr, increase, function(err){
        // results is now an array with numbers+1
        expect(err).to.be.ok; // eslint-disable-line
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
          expect(results).to.include('one');
          expect(results).to.include('two');
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
          expect(results).to.include(1);
          expect(results).to.include(2);
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
          expect(1).to.be.equal(arg1);
          expect(2).to.be.equal(arg2);
          callback(null, 3);
        }
      ],
                      function(err, result) {
                        expect(err).to.be.null;  // eslint-disable-line
                        expect(3).to.be.equal(result);
                        done();
                      });
    });
  });
});
