"use strict";  // eslint-disable-line

var assert = require('chai').assert;
var supertest = require('supertest');
var app = require('../../app.js');
var mongoose = require('mongoose');
var _ = require('lodash');
var Place = require('../../lib/models/place.js');
var placesUtils = require('../utils/places.js')(app);

after(function(done) {
  mongoose.disconnect();
  done();
});

describe('Places CRUD', function() {

  before(function(done) {
    // mongoose connect is already done in app.js
    Place.remove(function(err, removed) { // eslint-disable-line
      done();
    });
  });

  describe('#savePlace()', function() {
    it('store place in mongodb', function(done) {
      var stuttgartRotebuelplatz = {
        type: 'grillplatz',
        location:
        {type: 'Point', coordinates: [9.171303, 48.774823]},
        tags: ['grill', 'rotebuehlplatz']
      };
      var stuttgartSchlossplatz = {
        type: 'grillplatz',
        location:
        {type: 'Point', coordinates: [9.179931, 48.778648]},
        tags: ['grill', 'schlossplatz']
      };
      var hamburg = {
        type: 'grillplatz',
        location:
        {type: 'Point', coordinates: [9.868667, 53.547881]},
        tags: ['grill', 'hamburg']
      };
      var frankfurt = {
        type: 'grillplatz',
        location:
        {type: 'Point', coordinates: [8.639660, 50.115110]},
        tags: ['grill', 'frankfurt']
      };
      var places = [stuttgartRotebuelplatz, stuttgartSchlossplatz,
                    hamburg, frankfurt];

      // insert all places (4 REST-calls)
      placesUtils.echo();
      placesUtils.insertPlaces(places,done);
    });
    it('get places near stuttgart schlossplatz', function(done) {
      supertest(app).get('/api/places')
        .query({location: '9.171304,48.774822'})
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var places = res.body;
          assert.lengthOf(places, 2);
          var tags =  _.flatten(_.pluck(places, 'tags'));
          assert.isTrue(_.includes(tags, 'schlossplatz'), 'should contain schlossplatz');
          assert.isTrue(_.includes(tags, 'schlossplatz'), 'should contain rotebuehlplatz');
          return done();
        });
    });
  });
});
