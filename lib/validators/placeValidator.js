var validatorUtils = require('../../lib/utils/validatorUtils');


var isExistingLocationParam = function(req) {
  if (!req.query.location) {
    return false;
  }
  return true;
};

var isValidLocationParam = function(req) {
  try {
    var locString = _.words(req.query.location, /[^, ]+/g);
    var loc = _.map(locString, function(s) {
      return Number(_.trim(s));
    });
    if (loc.length !== 2) {
      return false;
    }
  } catch(e) {
    return false;
  }
  return true;
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
