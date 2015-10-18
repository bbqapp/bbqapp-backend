var Place = require('../models/place.js');

var getPlaces = function(params, done) {
  Place.find({
    location:
    { $geoWithin:
      { $centerSphere: [params.loc, params.radius/6378.1]}}}, function (err, places) {
        if (err) {
          return done(err);
        }
        done(null, places);
      });
};

var getPlaceById = function(id, done) {
  Place.findById(id, function(err, place) {
    if (err) {
      err.status = 404;
      err.message = 'Not Found';
      err.code = 'NOT_FOUND';
      return done(err);
    }
    done(null, place);
  });
};


module.exports = {getPlaces: getPlaces,
                  getPlaceById: getPlaceById};
