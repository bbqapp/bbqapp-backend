var Place = require('../models/place.js');

var my = {
  savePlace: function(place, done) {
    Place.create(place, function(err, place) {
      if (err) {
        return done(err);
      }
      done(null, place._id);
    });
  },
  getPlaces: function(params, done) {
    Place.find({
      location:
      { $geoWithin:
        { $centerSphere: [params.loc, params.radius/6378.1]}}}, function (err, places) {
          if (err) {
            return done(err);
          }
          done(null, places);
        });
  },
  getPlaceById: function(id, done) {
    Place.findById(id, function(err, place) {
      if (err) {
        err.status = 404;
        err.message = 'Not Found';
        err.code = 'NOT_FOUND';
        return done(err);
      }
      done(null, place);
    });
  }
};


module.exports = my;
