var placeRepository = require('../repositories/placeRepository');


var getPlaces = function(params, done) {
  placeRepository.getPlaces(params, done);
};

var getPlaceById = function(id, done) {
  placeRepository.getPlaceById(id, done);
};

module.exports = {getPlaces: getPlaces,
                  getPlaceById: getPlaceById};
