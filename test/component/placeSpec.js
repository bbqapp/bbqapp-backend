"use strict";  // eslint-disable-line

var expect = require('chai').expect;
var app = require('../../app.js');
var mongoose = require('mongoose');
var _ = require('lodash');
var Place = require('../../lib/models/place.js');
var placesUtils = require('../utils/places.js')(app);
var logger = require('../../lib/utils/logger');
var supertest = require('supertest');

after(function(done) {
  mongoose.disconnect();
  done();
});

describe('Places CRUD', function() {

  beforeEach(function(done) {
    // mongoose connect is already done in app.js
    Place.remove(function(err, removed) { // eslint-disable-line
      done();
    });
  });

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

  describe('#savePlace()', function() {
    it('#001 store place in mongodb', function(done) {
      // insert all places (4 REST-calls)
      placesUtils.savePlaces(places)
        .then(function(ids) {
          logger.debug('returned ids:', {ids: ids,
                                         filename: __filename,
                                         fn: 'savePlaces'});
          logger.debug('saved places ids: ', {ids: ids});
          done(null);
        })
        .catch(function(err) {
          done(err);
        });
    });
    it('#002 get places near stuttgart schlossplatz', function(done) {
      placesUtils.savePlaces(places)
        .then(function(ids) {
          logger.debug('returned ids:', {ids: ids,
                                         filename: __filename,
                                         fn: 'savePlaces'});
          var location = '9.171304,48.774822';
          placesUtils.getPlaces(location)
            .then(function(places) {
              expect(places).to.have.length(2);
              var tags =  _.flatten(_.pluck(places, 'tags'));
              expect(_.includes(tags, 'schlossplatz')).to.be.true;  // eslint-disable-line
              expect(_.includes(tags, 'rotebuehlplatz')).to.be.true;  // eslint-disable-line
              done(null);
            })
            .catch(function(err) {
              done(err);
            });
        });
    });
    it('#003 get place by id', function(done) {
      var place = {
        type: 'grillplatz',
        location:
        {type: 'Point', coordinates: [9.179931, 48.778648]},
        tags: ['grill', 'schlossplatz', 'id123']
      };
      placesUtils.savePlace(place)
        .then(placesUtils.getPlaceById)
        .then(function(place) {
          logger.debug('returned place: ',
            {
              file: __filename,
              fn: 'getPlaceById test #002',
              place: place
            });
          expect(place).to.be.ok;  // eslint-disable-line
          expect(place.type).to.be.equal('grillplatz');
          expect(place.tags).to.be.deep.equal(['grill', 'schlossplatz', 'id123']);
          done(null);
        })
        .catch(function(err) {
          done(err);
        });
    });
    it('#004 get places with invalid location', function(done) {
      placesUtils.savePlaces(places)
        .then(function(ids) {
          logger.debug('returned ids:', {ids: ids,
                                         filename: __filename,
                                         fn: 'savePlaces'});
          var location = '9.17130';
          supertest(app).get('/api/places')
            .query({location: location})
            .expect(400)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              logger.debug('res.body', {body: res.body});
              if (err) {
                done(err);
              }
              var error = res.body;
              expect(error.code).to.be.equal('BAD_REQUEST');;
              expect(error.err.errors).to.have.length(1);
              done(null);
            });
        });
    });
    it('#005 get places with no location', function(done) {
      placesUtils.savePlaces(places)
        .then(function(ids) {
          logger.debug('returned ids:', {ids: ids,
                                         filename: __filename,
                                         fn: 'savePlaces'});
          supertest(app).get('/api/places')
            .expect(400)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              logger.debug('res.body', {body: res.body});
              if (err) {
                done(err);
              }
              var error = res.body;
              expect(error.code).to.be.equal('BAD_REQUEST');;
              expect(error.err.errors).to.have.length(2);
              done(null);
            });
        });
    });
  });
});
