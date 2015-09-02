var assert = require('chai').assert;
var supertest = require('supertest');
var async = require('async');
var logger = require('winston');

module.exports = function(app) {

  var my = {
    insertPlaces: function(places, done) {
      async.each(places, function(item, callback) {
        supertest(app).post('/api/places')
          .send(item)
          .expect(201)
          .end(function(err, res) {
            if (err) {
              return callback(err);
            }
            // response should contain new mongo ObjectIds
            assert.isDefined(res.body._id, 'res.body should contain an _id');
            return callback();
          });
      }, function(err) {
        if (err) {
          done(err); // test failed
        } else  {
          done();  // test passed
        }
      });
    },
    echo: function() {
      logger.debug('echoooo');
    }
  };

  return my;
};
