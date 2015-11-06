var validatorUtils = require('../../lib/utils/validatorUtils');
var logger = require('../../lib/utils/logger');
var _ = require('lodash');

var isExistingLocationParam = function(req) {
  if (!req.query.location) {
    return false;
  }
  return true;
};

var isValidLocationParam = function(req) {
  if (req.query.location) {
    var locString = req.query.location.split(',');
    try {
      var loc = _.map(locString, function(s) {
        return Number(_.trim(s));
      });
    } catch(e) {
      return false;
    }
    if (loc.length === 2) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

var validPlaceParam = function(req) {
  if (req.body && !req.body.type) {
    return false;
  }
  return true;
};

var my = {
  validateGETPlaces: function(req) {
    var existingLocationValidator = validatorUtils.validator('location query param must be set', 'location', isExistingLocationParam);
    var validLocationValidator = validatorUtils.validator('location query param must comma separeted numbers e.g. 9.12234,53.1234', 'location', isValidLocationParam);
    var checker = validatorUtils.checker(existingLocationValidator, validLocationValidator);
    var errors = checker(req);
    return errors;
  },
  validatePOSTPlace: function(req) {
    var validPlaceValidator = validatorUtils.validator('place.type must be set', 'place.type', validPlaceParam);
    var checker = validatorUtils.checker(validPlaceValidator);
    var errors = checker(req);
    return errors;
  }
};

module.exports = my;
