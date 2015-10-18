"use strict";  // eslint-disable-line

var expect = require('chai').expect;
var supertest = require('supertest');
var Promise = require('bluebird');
var logger = require('../../lib/utils/logger');
var _ = require('lodash');

module.exports = function(app) {

  var my = {
    savePlace: function(place) {
      logger.debug('in savePlace(): ', {place: place});
      return new Promise(function(resolve, reject) {
        supertest(app).post('/api/places')
          .send(place)
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              logger.error('ERROR during savePlace()', {err: err});
              reject(err);
            } else {
              logger.debug('savePlace() returns: ', {body: res.body});
              expect(res.body._id).to.be.ok;  // eslint-disable-line
              resolve(res.body._id);
            }
          });
      });
    },
    savePlaces: function(places) {
      var promises = _.map(places, this.savePlace, this);
      return Promise.all(promises);
    },
    getPlaceById: function(id) {
      logger.debug('getPlaceById() id: ', {id: id});
      return new Promise(function(resolve, reject) {
        supertest(app).get('/api/places/' + id)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              reject(err);
            } else {
              resolve(res.body);
            }
          });
      });
    },
    getPlaces: function(location) {
      return new Promise(function(resolve, reject) {
        supertest(app).get('/api/places')
          .query({location: location})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              reject(err);
            }
            var places = res.body;
            resolve(places);
          });
      });
    }
  };

  return my;
};
