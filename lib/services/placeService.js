var placeRepository = require('../repositories/placeRepository');

var my = {
  savePlace: function(place, done) {
    placeRepository.savePlace(place, done);
  },
  getPlaces: function(params, done) {
    placeRepository.getPlaces(params, done);
  },

  getPlaceById: function(id, done) {
    placeRepository.getPlaceById(id, done);
  }
};

module.exports = my;
