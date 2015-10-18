var pictureRepository = require('../repositories/pictureRepository');

var my = {
  savePicture: function(placeId, imgBuffer, mimeType, done) {
    pictureRepository.savePicture(placeId, imgBuffer, mimeType, done);
  },
  getPictures: function(placeId, done) {
    pictureRepository.getPictures(placeId, done);
  },
  getPictureById: function(placeId, id, done) {
    pictureRepository.getPictureById(placeId, id, done);
  }
};


module.exports = my;
