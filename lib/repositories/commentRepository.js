var MyComment = require('../models/comment.js');
var mongoose = require('mongoose');

var my = {
  saveComment: function(placeId, comment, done) {
    // link place with comment
    comment._place = mongoose.Types.ObjectId(placeId);
    // save comment
    MyComment.create(comment, function(err, entry) {
      if (err) {
        return done(err);
      }
      done(null, entry._id);
    });
  },
  getCommentsByPlaceId: function(placeId, done) {
    MyComment.find({_place: placeId}, function(err, comments) {
      if (err) {
        return done(err);
      }
      done(null, comments);
    });
  },
  getCommentByPlaceIdAndId: function(placeId, id, done) {
    MyComment.findById(id, function(err, comment) {
      if (err) {
        return done(err);
      }
      done(null, comment);
    });
  }
};

module.exports = my;
