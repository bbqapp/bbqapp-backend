var commentRepository = require('../repositories/commentRepository');


var my = {
  saveComment: function(placeId, comment, done) {
    commentRepository.saveComment(placeId, comment, done);
  },

  getCommentsByPlaceId: function(placeId, done) {
    commentRepository.getCommentsByPlaceId(placeId, done);
  },

  getCommentByPlaceIdAndId: function(placeId, id, done) {
    commentRepository.getCommentByPlaceIdAndId(placeId, id, done);
  }
};


module.exports = my;
