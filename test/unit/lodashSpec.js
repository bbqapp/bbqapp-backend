"use strict";  // eslint-disable-line

var _ = require('lodash');
var assert = require('chai').assert;

describe('lodash experiments', function() {
  describe('#words()', function() {
    it('split without whitespaces', function(done) {
      var s = '8.12334,52.123345';
      var arr = _.words(s, /[^,]+/g);
      assert.lengthOf(arr, 2);
      var numbers = _.map(arr, function(s) {
        return Number(_.trim(s));
      });
      _.filter(numbers, function(n) {
        return _.isNumber(n);
      });
      done();
    });

    it('split with whitespaces', function(done) {
      var s = '8.12334,  52.123345';
      var arr = _.words(s, /[^, ]+/g);
      assert.lengthOf(arr, 2);
      var numbers = _.map(arr, function(s) {
        return Number(_.trim(s));
      });
      _.filter(numbers, function(n) {
        return _.isNumber(n);
      });
      done();
    });
  });
});
