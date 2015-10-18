var Picture = require('../models/picture');
var mongoose = require('mongoose');

var my = {
  savePicture: function(placeId, imgBuffer, mimeType, done) {
    Picture.create(
      { meta:
        {mimetype: mimeType,
         url: ''
        },
        data: imgBuffer,
        _place: mongoose.Types.ObjectId(placeId)
      },
      function(err, picture) {
        if (err) {
          return done(err);
        }
        var url = '/places/' + placeId + '/pictures/' + picture._id;
        Picture.update(
          {_id: picture._id},
          {$set: {'meta.url': url}},
          function(err, raw) {    // eslint-disable-line
            if (err) {
              return done(err);
            }
            done(null, picture._id);
          });
      });
  },
  getPictures: function(placeId, done) {
    Picture.find({_place: placeId}, {data: 0}, function(err, pictures) {
      if (err) {
        return done(err);
      }
      done(null, pictures);
    });
  },
  getPictureById: function(placeId, id, done) {
    Picture.findById(id, function(err, picture) {
      if (err) {
        return done(err);
      }
      done(null, picture);
    });
  }
};

module.exports = my;
