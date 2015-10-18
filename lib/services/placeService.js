var placeRepository = require('../repositories/placeRepository');

var my = {
  getPlaces: function(params, done) {
    placeRepository.getPlaces(params, done);
  },

  getPlaceById: function(id, done) {
    placeRepository.getPlaceById(id, done);
  }
};

module.exports = my;
