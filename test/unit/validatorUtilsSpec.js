"use strict"; // eslint-disable-line quotes

var validatorUtils = require('../../lib/utils/validatorUtils');
var expect = require('chai').expect;
var _ = require('lodash');
var validator = require('validator');

function isEven(n) {
  return n % 2 === 0;
}

describe('validatorUtils', function() {
  var evenValidator = validatorUtils.validator('input not even!', '', isEven);
  var numberValidator = validatorUtils.validator('input is not a number', '', _.isNumber);
  var checker = validatorUtils.checker(evenValidator, numberValidator);

  describe('#validates numbers', function() {
    it('validates number is even', function(done) {
      var errors = checker(2);
      expect(errors).to.be.empty; // eslint-disable-line
      done();
    });
    it('#validates number is not even', function(done) {
      var errors = checker(1);
      expect(errors).to.have.length(1);
      done();
    });
    it('#validates number is not number and not even', function(done) {
      var errors = checker('zero');
      expect(errors).to.have.length(2);
      done();
    });
    it('#validates email via validator function', function(done) {
      checker = validatorUtils.checker(validator.isEmail);
      var errors = checker('foo@bar.com');
      expect(errors).to.be.empty;  // eslint-disable-line
      done();
    });
  });
  describe('#validator functions tests', function() {
    it('isDecimal', function(done) {
      var n = '1234.1234';
      expect(validator.isDecimal(n)).to.be.ok;  // eslint-disable-line
      n = '123absc';
      expect(validator.isDecimal(n)).to.be.false;  // eslint-disable-line
      done();
    });
  });
});
